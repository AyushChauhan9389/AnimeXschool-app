import React, { useCallback, useMemo } from 'react';
import { FlatList, FlatListProps } from 'react-native';

import { Skeleton } from '@/components/ui/Skeleton';
import { CART_CARD_HEIGHT } from './CartCard';

type CartListSkeletonProps = {
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

const SKELETON_CARD_HEIGHT = CART_CARD_HEIGHT;

const CartListSkeleton = ({
  dataCount = 8,
  ListEmptyComponent,
  contentContainerStyle: contentContainerStyleProp,
  ...restProps
}: CartListSkeletonProps) => {
  const data = useMemo(
    () => new Array(dataCount).map((_, i) => i + 1),
    [dataCount],
  );

  const contentContainerStyle = useMemo(() => {
    return [{ paddingBottom: 16, gap: 16 }, contentContainerStyleProp];
  }, [contentContainerStyleProp]);

  const renderItem = useCallback(() => {
    return (
      <Skeleton
        style={{
          flex: 1,
          height: SKELETON_CARD_HEIGHT,
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
      numColumns={1}
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={contentContainerStyle}
      {...restProps}
    />
  );
};

export { CartListSkeleton };
export type { CartListSkeletonProps };
