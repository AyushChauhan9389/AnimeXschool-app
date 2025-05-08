import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  ViewToken,
  ViewabilityConfig,
  LayoutChangeEvent,
  ViewProps,
} from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Href, Link } from 'expo-router';

type CarouselItem = {
  url: string;
  alt?: string;
  fallbackUrl?: string;
  href?: Href;
};

type CarouselProps = {
  data: CarouselItem[];
  autoScrolling?: boolean;
  /**
   * By default takes the available width
   */
  imageWidth?: number;
  /**
   * @default 200
   */
  imageHeight?: number;
  /**
   * Image resize mode
   * @default 'cover'
   */
  contentFit?: ImageProps['contentFit'];
  containerStyle?: ViewProps['style'];
};

const Carousel = ({
  data,
  autoScrolling = false,
  imageWidth: imageWidthProp,
  imageHeight: imageHeightProp = 200,
  contentFit = 'cover',
  containerStyle,
}: CarouselProps) => {
  const { styles } = useStyles(stylesheet);

  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [containerWidth, setContainerWidth] = useState(0);

  const [isManualScrolling, setIsManualScrolling] = useState(false);

  // Handle auto-scroll
  useEffect(() => {
    if (data.length <= 1 || !autoScrolling) return;

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % data.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      }, 3000);
    };

    if (!isManualScrolling) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoScrolling, isManualScrolling, currentIndex, data.length]);

  const viewabilityConfig: ViewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<any>[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    },
    [],
  );

  const handleScrollBegin = useCallback(() => {
    setIsManualScrolling(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const handleScrollEnd = useCallback(() => {
    setIsManualScrolling(false);
  }, []);

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const keyExtractor = useCallback(
    (item: CarouselItem, index: number) => index.toString(),
    [],
  );

  const imageWidth = imageWidthProp ?? containerWidth;
  const imageHeight = imageHeightProp;

  const renderItem = useCallback(
    ({ item }: { item: CarouselItem }) => {
      if (item.href) {
        return (
          <Link href={item.href} style={{ width: imageWidth }}>
            <Image
              source={{ uri: item.url || item.fallbackUrl }}
              alt={item.alt}
              transition={300}
              contentFit={contentFit}
              style={{
                width: imageWidth,
                height: imageHeight,
              }}
            />
          </Link>
        );
      }
      return (
        <Image
          source={{ uri: item.url || item.fallbackUrl }}
          alt={item.alt}
          transition={300}
          contentFit={contentFit}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />
      );
    },
    [imageHeight, imageWidth, contentFit],
  );

  return (
    <View
      collapsable={false}
      onLayout={onContainerLayout}
      style={[styles.container, containerStyle]}
    >
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <View style={styles.pagination}>
        {data.length > 1 &&
          data.map((_, index) => (
            <View
              key={index.toString()}
              style={[styles.dot(index === currentIndex)]}
            />
          ))}
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  container: {
    position: 'relative',
    borderRadius: radius.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.transparent,
  },
  pagination: {
    position: 'absolute',
    bottom: space[8],
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: (active: boolean) => ({
    height: 8,
    width: 8,
    borderRadius: radius.md,
    margin: space[4],
    backgroundColor: active ? colors.neutralA12 : colors.neutralA5,
    boxShadow: `0 0 2 0 ${colors.neutralA2}`,
  }),
}));

export default Carousel;
export type { CarouselItem };
