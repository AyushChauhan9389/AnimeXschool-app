import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link, useLocalSearchParams } from 'expo-router';
import he from 'he';

import { BackButton } from '@/components/BackButton';
import { ProductsGrid } from '@/components/features/product/ProductsGrid';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Spinner } from '@/components/ui/Spinner';
import { useProducts } from '@/hooks/api/useProducts';
import { ProductsGridSkeleton } from '@/components/features/product/ProductGridSkeleton';
import { Text } from '@/components/ui/Text';
import { Button, ButtonIcon } from '@/components/ui/Button';
import { ProductFilters } from '@/components/features/product/ProductFilters';
import { useCategoryFilters } from '@/hooks/api/useCategories';
import { ProductFilter, ProductSortFilter } from '@/types/product';
import { ProductSort } from '@/components/features/product/ProductSort';

export default function CategoryScreen() {
  const { styles } = useStyles(stylesheet);

  const { id, name } = useLocalSearchParams();

  const [selectedFilters, setSelectedFilters] = useState<ProductFilter[]>([]);
  const [filterQuery, setFilterQuery] = useState('');

  const [sortFilter, setSortFilter] = useState<ProductSortFilter>({
    order: 'desc',
    orderby: 'date',
  });

  const categoryFiltersQuery = useCategoryFilters(Number(id));

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useProducts({
    category: Number(id),
    filterQuery,
    ...sortFilter,
  });

  const shouldShowFilters =
    !categoryFiltersQuery.isLoading && categoryFiltersQuery.data?.filter.length;
  const filters = categoryFiltersQuery.data?.filter || [];

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
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton variant="soft" />
        <Text variant="labelLg" highContrast>
          {he.decode(name as string)}
        </Text>
        <View style={styles.headerRight}>
          <Link href="/search" asChild>
            <Button color="neutral" variant="soft" iconOnly>
              <ButtonIcon name="search" />
            </Button>
          </Link>
        </View>
      </View>

      <View style={styles.slotContainer}>
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

          {shouldShowFilters ? (
            <ProductFilters
              filters={filters}
              selectedFilters={selectedFilters}
              onApply={handleApplyFilter}
              onClearAll={handleClearAllFilters}
            />
          ) : null}
        </View>

        {/* Products listing */}
        <AsyncBoundary
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          isRetrying={isRefetching}
          LoadingComponent={ProductsGridSkeleton}
        >
          <ProductsGrid
            data={products}
            onRefresh={refetch}
            refreshing={isRefetching}
            onEndReached={handleEndReached}
            ListFooterComponent={ListFooterComponent}
          />
        </AsyncBoundary>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.insets.top + space[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[4],
  },
  headerRight: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  slotContainer: {
    paddingTop: space[8],
    paddingHorizontal: space[16],
  },
}));
