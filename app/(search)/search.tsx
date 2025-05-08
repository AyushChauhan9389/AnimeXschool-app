import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { BackButton } from '@/components/BackButton';
import { Icon } from '@/components/ui/Icon';
import { TextInput, TextInputAdornment } from '@/components/ui/TextInput';
import { ProductsGrid } from '@/components/features/product/ProductsGrid';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Spinner } from '@/components/ui/Spinner';
import { useSearchProducts } from '@/hooks/api/useProducts';
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from '@/components/EmptyState';
import { ProductsGridSkeleton } from '@/components/features/product/ProductGridSkeleton';
import { ProductFilters } from '@/components/features/product/ProductFilters';
import { ProductFilter, ProductSortFilter } from '@/types/product';
import { ProductSort } from '@/components/features/product/ProductSort';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';
import { Skeleton } from '@/components/ui/Skeleton';

export default function SearchScreen() {
  const { styles } = useStyles(stylesheet);

  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounceCallback(setSearch, 500);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton variant="ghost" />
        <TextInput
          accessibilityRole="search"
          accessibilityLabel="Search"
          placeholder="Search"
          color="neutral"
          variant="soft"
          autoFocus
          inputMode="search"
          onChangeText={debouncedSearch}
          containerStyle={{ flex: 1 }}
          startAdornment={
            <TextInputAdornment>
              <Icon name="search" size="lg" />
            </TextInputAdornment>
          }
        />
      </View>

      <View style={styles.slotContainer}>
        {search ? (
          <Slot search={search} />
        ) : (
          <EmptyState>
            <Icon name="search" size="4xl" />
            <EmptyStateTitle>Search for anything</EmptyStateTitle>
            <EmptyStateDescription>
              Try searching for your favorite products
            </EmptyStateDescription>
          </EmptyState>
        )}
      </View>
    </View>
  );
}

const Slot = ({ search }: { search: string }) => {
  const [selectedFilters, setSelectedFilters] = useState<ProductFilter[]>([]);
  const [filterQuery, setFilterQuery] = useState('');

  const [sortFilter, setSortFilter] = useState<ProductSortFilter>({
    order: 'desc',
    orderby: 'date',
  });

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useSearchProducts({
    search,
    filterQuery,
  });

  const filters = data?.pages[0].filter || [];
  const shouldShowFilters = filters.length > 0;
  const products = data?.pages.flatMap(page => page.data) || [];

  const ListFooterComponent = useMemo(() => {
    return isFetchingNextPage && hasNextPage ? (
      <View style={{ paddingVertical: 16, alignItems: 'center' }}>
        <Spinner size="lg" />
      </View>
    ) : null;
  }, [isFetchingNextPage, hasNextPage]);

  const handleEndReached = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) {
      return;
    }
    fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleApplyFilter = useCallback(
    (selectedFilters: ProductFilter[], filterQuery: string) => {
      setSelectedFilters(selectedFilters);
      setFilterQuery(filterQuery);
    },
    [],
  );

  const handleClearAllFilters = useCallback(() => {
    setSelectedFilters([]);
    setFilterQuery('');
  }, []);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      LoadingComponent={LoadingComponent}
    >
      {/* Sorting and Filters */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 48, // 'sm' button height + 12px margin
        }}
      >
        <ProductSort
          sortFilter={sortFilter}
          onSortFilterChange={setSortFilter}
        />

        {shouldShowFilters && (
          <ProductFilters
            filters={filters}
            selectedFilters={selectedFilters}
            onApply={handleApplyFilter}
            onClearAll={handleClearAllFilters}
          />
        )}
      </View>
      <ProductsGrid
        data={products}
        onRefresh={refetch}
        refreshing={isLoading}
        onEndReached={handleEndReached}
        ListFooterComponent={ListFooterComponent}
      />
    </AsyncBoundary>
  );
};

const LoadingComponent = () => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 48, // 'sm' button height + 12px margin
        }}
      >
        <Skeleton style={{ width: 100, height: 36 }} />
        <Skeleton style={{ width: 100, height: 36 }} />
      </View>
      <ProductsGridSkeleton />
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.insets.top + space[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[8],
    paddingHorizontal: space[16],
    paddingLeft: space[8],
    paddingVertical: space[4],
  },
  slotContainer: {
    paddingTop: space[8],
    paddingHorizontal: space[16],
  },
  featuredProductsContainer: {
    paddingTop: space[4],
  },
}));
