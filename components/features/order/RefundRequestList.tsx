import React, { useCallback, useMemo } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';

import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateImage,
  EmptyStateTitle,
} from '@/components/EmptyState';
import { OrderRefund } from '@/types/order';
import { RefundRequestCard } from './RefundRequestCard';

type AnimatedFlatListProps<ItemT> = React.ComponentProps<
  typeof Animated.FlatList<ItemT>
>;
type RefundRequestListProps = Omit<
  AnimatedFlatListProps<OrderRefund>,
  'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'
> & {
  data: OrderRefund[];
};

const RefundRequestList = ({
  data,
  ListEmptyComponent = DefaultListEmptyComponent,
  columnWrapperStyle: columnWrapperStyleProp,
  contentContainerStyle: contentContainerStyleProp,
  ...restProps
}: RefundRequestListProps) => {
  const contentContainerStyle = useMemo(() => {
    return [{ paddingBottom: 80, gap: 16 }, contentContainerStyleProp];
  }, [contentContainerStyleProp]);

  const renderItem = useCallback(({ item }: { item: OrderRefund }) => {
    return <RefundRequestCard item={item} />;
  }, []);

  const keyExtractor = useCallback(
    (item: OrderRefund) => item.id.toString(),
    [],
  );

  return (
    <Animated.FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      itemLayoutAnimation={LinearTransition}
      numColumns={1}
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={contentContainerStyle}
      {...restProps}
    />
  );
};

const DefaultListEmptyComponent = () => {
  return (
    <EmptyState>
      <EmptyStateImage source={require('@/assets/images/animal-pana.png')} />
      <EmptyStateTitle>No Refund Requests</EmptyStateTitle>
      <EmptyStateDescription>
        You haven’t requested any refunds yet.
      </EmptyStateDescription>
    </EmptyState>
  );
};

export { RefundRequestList };
export type { RefundRequestListProps };
