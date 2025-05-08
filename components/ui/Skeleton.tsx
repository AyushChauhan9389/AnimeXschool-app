import React from 'react';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';

type SkeletonProps = React.ComponentPropsWithoutRef<Animated.View> & {
  /**
   * Animation duration in milliseconds
   *
   * @default 700
   */
  duration?: number;
};

const Skeleton = React.forwardRef<
  React.ElementRef<typeof Animated.View>,
  SkeletonProps
>(function Skeleton(
  { duration = 700, style, ...restProps }: SkeletonProps,
  ref,
) {
  const { theme } = useStyles();

  const colorProgressDv = useDerivedValue(() => {
    return withRepeat(
      withSequence(
        withTiming(0, { easing: Easing.ease, duration }),
        withTiming(1, { easing: Easing.ease, duration }),
      ),
      -1,
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        colorProgressDv.value,
        [0, 1],
        [theme.colors.neutral2, theme.colors.neutral3],
      ),
    };
  });
  return (
    <Animated.View
      ref={ref}
      style={[
        { borderRadius: theme.radius.md, borderCurve: 'continuous' },
        animatedStyle,
        style,
      ]}
      {...restProps}
    />
  );
});

export { Skeleton };
export type { SkeletonProps };
