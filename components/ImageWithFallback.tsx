import { Image, ImageProps } from 'expo-image';
import { useState, useCallback, useLayoutEffect } from 'react';
import { Icon, IconProps } from './ui/Icon';

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

type ImageWithFallbackProps = ImageProps & {
  fallbackSize?: number;
  fallbackIcon?: IconProps['name'];
};

const ImageWithFallback = ({
  source,
  fallbackSize = 44,
  fallbackIcon = 'image',
  ...restProps
}: ImageWithFallbackProps) => {
  const [imageLoadingStatus, setImageLoadingStatus] =
    useState<ImageLoadingStatus>('idle');

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

  if (!haveSource || imageLoadingStatus === 'error') {
    return (
      <Icon
        name={fallbackIcon}
        colorStep="8"
        style={{ fontSize: fallbackSize }}
      />
    );
  }

  return (
    <Image
      source={source}
      transition={300}
      {...restProps}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export { ImageWithFallback };
