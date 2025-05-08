import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';

import { Button, ButtonIcon, ButtonProps } from './ui/Button';

type BackButtonProps = ButtonProps;

const BackButton = ({
  onPress: onPressProp,
  ...restProps
}: BackButtonProps) => {
  const router = useRouter();

  const onPress = React.useCallback(
    (e: GestureResponderEvent) => {
      router.back();
      onPressProp?.(e);
    },
    [router, onPressProp],
  );

  return (
    <Button
      color="neutral"
      variant="soft"
      iconOnly
      onPress={onPress}
      {...restProps}
    >
      <ButtonIcon name="chevron-back" />
    </Button>
  );
};

export { BackButton };
export type { BackButtonProps };
