import * as React from 'react';
import { Text as RNText } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { genericForwardRef } from '@/utils/genericForwardRef';
import type { PolymorphicProps } from '@/types/components';
import type { Color, ColorStep } from '@/styles/tokens';
import {
  fontFamilies,
  type FontSize,
  type TextVariants,
} from '@/styles/tokens';

type TextProps<T extends React.ElementType = typeof RNText> =
  PolymorphicProps<T> & {
    color?: Color;
    colorStep?: ColorStep;
    fontFamily?: keyof typeof fontFamilies;
    fontSize?: FontSize;
    textAlign?: 'auto' | 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    highContrast?: boolean;
    /**
     * Set `true` to inherit the styles from parent Text component instead of using default values
     */
    inherit?: boolean;
    variant?: keyof TextVariants;
  };

const defaultColor: Color = 'neutral';
const defaultVariant: keyof TextVariants = 'bodyMd';

const Text = genericForwardRef(function Text<
  T extends React.ElementType<React.ComponentPropsWithoutRef<typeof RNText>>,
>(
  {
    as,
    color,
    colorStep,
    variant,
    highContrast = false,
    fontFamily,
    fontSize,
    textAlign = 'auto',
    textTransform = 'none',
    disabled,
    inherit = false,
    style,
    ...restProps
  }: TextProps<T>,
  ref: React.ForwardedRef<T>,
) {
  const { styles } = useStyles(stylesheet);

  const Comp = as || RNText;

  return (
    <Comp
      ref={ref}
      disabled={disabled}
      style={[
        inherit && !color
          ? null
          : styles.color(color || defaultColor, highContrast, colorStep),
        inherit && !variant ? null : styles.variant(variant || defaultVariant),
        fontSize && styles.fontSize(fontSize),
        fontFamily && styles.fontFamily(fontFamily),
        textAlign && { textAlign },
        textTransform && { textTransform },
        disabled && styles.disabled,
        style,
      ]}
      {...restProps}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  color: (color: Color, highContrast: boolean, colorStep?: ColorStep) => ({
    color: theme.colors[`${color}${colorStep ?? (highContrast ? '12' : '11')}`],
  }),
  variant: (variant: keyof TextVariants) => ({
    ...theme.typography.textVariants[variant],
  }),
  fontSize: (fontSize: FontSize) => ({
    fontSize: theme.typography.fontSizes[fontSize],
  }),
  fontFamily: (fontFamily: keyof typeof fontFamilies) => ({
    fontFamily: theme.typography.fontFamilies[fontFamily],
  }),
  disabled: {
    color: theme.colors.neutral8,
  },
}));

export { Text };
export type { TextProps };
