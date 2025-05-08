import { Dimensions, ScrollView, View } from 'react-native';
import { useCallback, useMemo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { Link } from 'expo-router';

import { ProductsGrid } from '../product/ProductsGrid';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Text } from '@/components/ui/Text';
import { Button, ButtonText } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { PRODUCT_CARD_HEIGHT, ProductCard } from '../product/ProductCard';
import { BannerCarousel } from './BannerCarousel';
import { useExploreProducts, useProducts } from '@/hooks/api/useProducts';
import { ProductsResponse } from '@/api/productsApi';
import { ProductsGridSkeleton } from '../product/ProductGridSkeleton';
import { Spinner } from '@/components/ui/Spinner';

const WOMEN_CATEGORY_ID = 282;
const JEWELRY_CATEGORY_ID = 288;

const HomeSlot = () => {
  const womenQueryResult = useProducts({
    category: WOMEN_CATEGORY_ID,
  });

  const jewelryQueryResult = useProducts({
    category: JEWELRY_CATEGORY_ID,
  });

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useExploreProducts();

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

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      LoadingComponent={LoadingComponent}
    >
      <ProductsGrid
        data={products}
        onRefresh={refetch}
        refreshing={isRefetching}
        onEndReached={handleEndReached}
        ListHeaderComponent={
          <ListHeaderComponent
            womenQueryResult={womenQueryResult}
            jewelryQueryResult={jewelryQueryResult}
          />
        }
        ListFooterComponent={ListFooterComponent}
      />
    </AsyncBoundary>
  );
};

const ListHeaderComponent = ({
  womenQueryResult,
  jewelryQueryResult,
}: {
  womenQueryResult: UseInfiniteQueryResult<
    InfiniteData<ProductsResponse, unknown>,
    Error
  >;
  jewelryQueryResult: UseInfiniteQueryResult<
    InfiniteData<ProductsResponse, unknown>,
    Error
  >;
}) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.listHeaderComponent}>
      <BannerCarousel />
      {/* First best category */}
      <BestOfCategoryScrollView
        id={WOMEN_CATEGORY_ID}
        title="Best of Women"
        queryResult={womenQueryResult}
      />
      {/* Second best category */}
      <BestOfCategoryScrollView
        id={JEWELRY_CATEGORY_ID}
        title="Best of Jewelry"
        queryResult={jewelryQueryResult}
      />
      <Text variant="headingSm" highContrast>
        Explore Products
      </Text>
    </View>
  );
};

const BestOfCategoryScrollView = ({
  id,
  title,
  queryResult,
}: {
  id: number;
  title: string;
  queryResult: UseInfiniteQueryResult<
    InfiniteData<ProductsResponse, unknown>,
    Error
  >;
}) => {
  const { styles } = useStyles(stylesheet);

  const { data, isLoading, error, refetch, isRefetching } = queryResult;

  const products = data?.pages.flatMap(page => page.data) || [];

  return (
    <View style={styles.bestOfCategoryScrollContainer}>
      <View style={styles.bestOfCategoryHeader}>
        <Text variant="headingSm" highContrast>
          {title}
        </Text>
        <Link
          href={{
            pathname: '/category/[id]',
            params: {
              id,
              name: title,
            },
          }}
          asChild
        >
          <Button color="neutral" variant="plain">
            <ButtonText>View All</ButtonText>
          </Button>
        </Link>
      </View>
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        isRetrying={isRefetching}
        LoadingComponent={() => (
          <Skeleton style={{ height: PRODUCT_CARD_HEIGHT - 60, flex: 1 }} />
        )}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              style={{ width: Dimensions.get('window').width / 2.5 }}
            />
          ))}
        </ScrollView>
      </AsyncBoundary>
    </View>
  );
};

const LoadingComponent = () => {
  const { styles } = useStyles(stylesheet);
  return (
    <ProductsGridSkeleton
      ListHeaderComponent={
        <View style={styles.skeletonHeader}>
          <Skeleton style={{ flex: 1 }} />
          <Skeleton style={{ height: 18 }} />
        </View>
      }
    />
  );
};

const stylesheet = createStyleSheet(({ space }) => ({
  listHeaderComponent: {
    gap: space[12],
    marginTop: space[8],
    marginBottom: space[16],
  },
  skeletonHeader: {
    flex: 1,
    height: 240,
    gap: space[12],
    marginBottom: space[12],
  },
  bestOfCategoryScrollContainer: {
    gap: space[12],
    marginBottom: -space[8],
  },
  bestOfCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredProductsContainer: {
    paddingTop: space[4],
  },
}));

export { HomeSlot };
