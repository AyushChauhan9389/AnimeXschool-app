import { useCallback, useState, useLayoutEffect } from 'react';
import { Image, ImageProps } from 'expo-image';
import { DimensionValue, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Icon } from '@/components/ui/Icon';

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

type ProductImageProps = Pick<
  ImageProps,
  'source' | 'alt' | 'contentFit' | 'accessibilityLabel'
> & {
  width?: DimensionValue;
  height?: DimensionValue;
  containerStyle?: ViewProps['style'];
  fallbackSize?: number;
};

const ProductImage = ({
  width,
  height,
  containerStyle,
  fallbackSize,
  source,
  ...imageProps
}: ProductImageProps) => {
  const [imageLoadingStatus, setImageLoadingStatus] =
    useState<ImageLoadingStatus>('idle');

  const { styles } = useStyles(stylesheet);

  const haveSource = typeof source === 'object' ? !!source?.uri : !!source;

  useLayoutEffect(() => {
    setImageLoadingStatus('loading');

    return () => {
      setImageLoadingStatus('idle');
    };
  }, []);

  const onLoad = useCallback(() => {
    setImageLoadingStatus('loaded');
  }, []);

  const onError = useCallback(() => {
    setImageLoadingStatus('error');
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
        },
        containerStyle,
      ]}
    >
      {haveSource && (
        <Image
          source={source}
          transition={300}
          style={styles.image}
          onLoad={onLoad}
          onError={onError}
          {...imageProps}
        />
      )}
      {(!haveSource || imageLoadingStatus === 'error') && (
        <Icon
          name="image"
          colorStep="8"
          style={{ fontSize: fallbackSize ?? 80 }}
        />
      )}
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, radius }) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    backgroundColor: colors.neutralA3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
}));

export { ProductImage };
export type { ProductImageProps };
