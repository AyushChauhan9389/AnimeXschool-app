import React, { useCallback, useMemo } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { AddressCard } from './AddressCard';
import {
  EmptyState,
  EmptyStateImage,
  EmptyStateTitle,
} from '@/components/EmptyState';
import { Address } from '@/types/user';

type AnimatedFlatListProps<ItemT> = React.ComponentProps<
  typeof Animated.FlatList<ItemT>
>;
type AddressListProps = Omit<
  AnimatedFlatListProps<Address>,
  'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'
> & {
  data: Address[];
};

const AddressList = ({
  data,
  ListEmptyComponent = DefaultListEmptyComponent,
  columnWrapperStyle: columnWrapperStyleProp,
  contentContainerStyle: contentContainerStyleProp,
  ...restProps
}: AddressListProps) => {
  const contentContainerStyle = useMemo(() => {
    return [{ paddingBottom: 200, gap: 16 }, contentContainerStyleProp];
  }, [contentContainerStyleProp]);

  const renderItem = useCallback(({ item }: { item: Address }) => {
    return <AddressCard item={item} />;
  }, []);

  const keyExtractor = useCallback((item: Address) => item.address_id, []);

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
      <EmptyStateTitle>No saved addresses</EmptyStateTitle>
    </EmptyState>
  );
};

export { AddressList };
export type { AddressListProps };
