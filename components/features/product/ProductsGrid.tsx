import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import { Href, usePathname } from 'expo-router';

import { Product } from '@/types/product';
import { PRODUCT_CARD_HEIGHT, ProductCard } from './ProductCard';
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateImage,
  EmptyStateTitle,
} from '@/components/EmptyState';
import { Button, ButtonIcon } from '@/components/ui/Button';

const windowHeight = Dimensions.get('window').height;

const drawDistance = windowHeight * 2;

const scrollToTopThreshold = windowHeight / 2;

type ProductsGridProps = Omit<
  FlashListProps<Product>,
  'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'
> & {
  data: Product[];
};

const ProductsGrid = ({
  data,
  ListEmptyComponent = DefaultListEmptyComponent,
  contentContainerStyle: contentContainerStyleProp,
  onScroll: onScrollProp,
  ...restProps
}: ProductsGridProps) => {
  const listRef = useRef<FlashList<Product>>(null);

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const contentContainerStyle = useMemo(() => {
    if (contentContainerStyleProp) {
      return { paddingBottom: 180, ...contentContainerStyleProp };
    }
    return { paddingBottom: 180 };
  }, [contentContainerStyleProp]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset } = event.nativeEvent;
      const scrollOffset = contentOffset.y;
      if (scrollOffset > scrollToTopThreshold) {
        // If scrolled past threshold and button isn't visible, show it
        if (!showScrollToTop) {
          setShowScrollToTop(true);
        }
      } else {
        // If scrolled back above threshold and button is visible, hide it
        if (showScrollToTop) {
          setShowScrollToTop(false);
        }
      }
      onScrollProp?.(event);
    },
    [onScrollProp, showScrollToTop],
  );

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      return (
        <View
          style={{
            flex: 1,
            // this is a workaround for the gap(16px), see https://github.com/Shopify/flash-list/discussions/706
            paddingRight: index % 2 === 0 ? 8 : 0,
            paddingLeft: index % 2 !== 0 ? 8 : 0,
          }}
        >
          <ProductCard product={item} />
        </View>
      );
    },
    [],
  );

  const keyExtractor = useCallback(
    (item: Product, i: number) => `${i}-${item.id}`,
    [],
  );

  return (
    <View style={{ height: '100%' }}>
      <FlashList
        ref={listRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={PRODUCT_CARD_HEIGHT}
        numColumns={2}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        drawDistance={drawDistance}
        onEndReachedThreshold={0.5}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}
        ListEmptyComponent={ListEmptyComponent}
        {...restProps}
      />
      {showScrollToTop && <ScrollToTopButton onPress={scrollToTop} />}
    </View>
  );
};

const ScrollToTopButton = ({ onPress }: { onPress: () => void }) => {
  const { styles } = useStyles(stylesheet);

  const pathnames = usePathname().split('/');
  const pathname = '/' + pathnames[pathnames.length - 1];

  // Bottom tab bar is visible on these screens
  const bottomTabPaths: Href[] = [
    '/categories',
    '/cart',
    '/wishlist',
    '/account',
  ];

  const isBottomTabVisible =
    pathname === '/' || bottomTabPaths.includes(pathname as any);

  return (
    <Animated.View
      collapsable={false}
      entering={FadeInDown}
      exiting={FadeOutDown}
      layout={LinearTransition}
      style={styles.scrollToTopContainer(isBottomTabVisible)}
    >
      <Button
        color="neutral"
        variant="soft"
        size="lg"
        iconOnly
        onPress={onPress}
        style={styles.scrollToTopButton}
      >
        <ButtonIcon name="chevron-up" />
      </Button>
    </Animated.View>
  );
};

const DefaultListEmptyComponent = () => {
  return (
    <EmptyState>
      <EmptyStateImage source={require('@/assets/images/animal-pana.png')} />
      <EmptyStateTitle>No products found</EmptyStateTitle>
      <EmptyStateDescription>
        Try searching for your favorite products
      </EmptyStateDescription>
    </EmptyState>
  );
};

const stylesheet = createStyleSheet(({ colors }) => ({
  scrollToTopContainer: (isBottomTabVisible: boolean) => {
    return {
      position: 'absolute',
      top: isBottomTabVisible ? '85%' : '70%',
      right: 0,
      zIndex: 999999,
      width: 52,
      height: 52,
    };
  },
  scrollToTopButton: {
    shadowColor: colors.neutral6,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.45,
    shadowRadius: 8,
  },
}));

export { ProductsGrid };
export type { ProductsGridProps };
