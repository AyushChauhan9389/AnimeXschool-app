import React, { useCallback, useMemo } from 'react';
import { Link } from 'expo-router';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { CartCard } from './CartCard';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateImage,
  EmptyStateTitle,
} from '@/components/EmptyState';
import { Button, ButtonText } from '@/components/ui/Button';
import { CartItem } from '@/types/cart';

type AnimatedFlatListProps<ItemT> = React.ComponentProps<
  typeof Animated.FlatList<ItemT>
>;
type CartListProps = Omit<
  AnimatedFlatListProps<CartItem>,
  'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'
> & {
  data: CartItem[];
};

const CartList = ({
  data,
  ListEmptyComponent = DefaultListEmptyComponent,
  columnWrapperStyle: columnWrapperStyleProp,
  contentContainerStyle: contentContainerStyleProp,
  ...restProps
}: CartListProps) => {
  const contentContainerStyle = useMemo(() => {
    return [{ paddingBottom: 80, gap: 16 }, contentContainerStyleProp];
  }, [contentContainerStyleProp]);

  const renderItem = useCallback(({ item }: { item: CartItem }) => {
    return <CartCard item={item} />;
  }, []);

  const keyExtractor = useCallback((item: CartItem) => item.id.toString(), []);

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
      <EmptyStateTitle>Your cart is empty</EmptyStateTitle>
      <EmptyStateDescription>
        You don't have any items in your cart yet. Start shopping to add
        products to your cart.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Link href="/categories" asChild>
          <Button>
            <ButtonText>Start Shopping</ButtonText>
          </Button>
        </Link>
      </EmptyStateActions>
    </EmptyState>
  );
};

export { CartList };
export type { CartListProps };
