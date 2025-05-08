import React, { useCallback, useMemo } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { OrderCard } from './OrderCard';
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateImage,
  EmptyStateTitle,
} from '@/components/EmptyState';
import { Order } from '@/types/order';

type AnimatedFlatListProps<ItemT> = React.ComponentProps<
  typeof Animated.FlatList<ItemT>
>;
type OrderListProps = Omit<
  AnimatedFlatListProps<Order>,
  'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'
> & {
  data: Order[];
};

const OrderList = ({
  data,
  ListEmptyComponent = DefaultListEmptyComponent,
  columnWrapperStyle: columnWrapperStyleProp,
  contentContainerStyle: contentContainerStyleProp,
  ...restProps
}: OrderListProps) => {
  const contentContainerStyle = useMemo(() => {
    return [{ paddingBottom: 80, gap: 16 }, contentContainerStyleProp];
  }, [contentContainerStyleProp]);

  const renderItem = useCallback(({ item }: { item: Order }) => {
    return <OrderCard item={item} />;
  }, []);

  const keyExtractor = useCallback((item: Order) => item.id.toString(), []);

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
      <EmptyStateTitle>No Orders</EmptyStateTitle>
      <EmptyStateDescription>
        You haven’t placed any orders yet. When you place an order, it will
        appear here.
      </EmptyStateDescription>
    </EmptyState>
  );
};

export { OrderList };
export type { OrderListProps };
