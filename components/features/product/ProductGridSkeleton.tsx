import React, { useCallback, useMemo } from 'react';
import { FlatList, FlatListProps } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { PRODUCT_CARD_HEIGHT } from './ProductCard';

type ProductsGridSkeletonProps = {
  /**
   * Number of skeletons to render
   *
   * @default 8
   */
  dataCount?: number;
  keyboardDismissMode?: FlatListProps<FlatList>['keyboardDismissMode'];
  onEndReachedThreshold?: number;
  columnWrapperStyle?: FlatListProps<FlatList>['columnWrapperStyle'];
  contentContainerStyle?: FlatListProps<FlatList>['contentContainerStyle'];
  style?: FlatListProps<FlatList>['style'];
  ListHeaderComponent?: FlatListProps<FlatList>['ListHeaderComponent'];
  ListFooterComponent?: FlatListProps<FlatList>['ListFooterComponent'];
  ListEmptyComponent?: FlatListProps<FlatList>['ListEmptyComponent'];
};

const SKELETON_CARD_HEIGHT = PRODUCT_CARD_HEIGHT;
const GUTTER = 16;

const ProductsGridSkeleton = ({
  dataCount = 8,
  ListEmptyComponent,
  columnWrapperStyle: columnWrapperStyleProp,
  contentContainerStyle: contentContainerStyleProp,
  ...restProps
}: ProductsGridSkeletonProps) => {
  const data = useMemo(
    () => new Array(dataCount).map((_, i) => i + 1),
    [dataCount],
  );

  const columnWrapperStyle = useMemo(() => {
    return [{ gap: GUTTER }, columnWrapperStyleProp];
  }, [columnWrapperStyleProp]);

  const contentContainerStyle = useMemo(() => {
    return [{ paddingBottom: 80 }, contentContainerStyleProp];
  }, [contentContainerStyleProp]);

  const renderItem = useCallback(() => {
    return (
      <Skeleton
        style={{
          flex: 1,
          height: SKELETON_CARD_HEIGHT - GUTTER * 2,
          marginBottom: GUTTER,
        }}
      />
    );
  }, []);

  const keyExtractor = useCallback(
    (item: number, index: number) => index.toString(),
    [],
  );

  const getItemLayout = useCallback((data: any, index: number) => {
    return {
      length: SKELETON_CARD_HEIGHT,
      offset: SKELETON_CARD_HEIGHT * index,
      index,
    };
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      numColumns={2}
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={ListEmptyComponent}
      columnWrapperStyle={columnWrapperStyle}
      contentContainerStyle={contentContainerStyle}
      {...restProps}
    />
  );
};

export { ProductsGridSkeleton };
export type { ProductsGridSkeletonProps };
