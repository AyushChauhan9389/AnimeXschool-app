import React from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, TextProps } from './Text';
import { Icon, IconProps } from './Icon';
import { genericForwardRef } from '@/utils/genericForwardRef';
import { PolymorphicProps } from '@/types/components';
import { Color } from '@/styles/tokens';

type SettingsListColor = Color;

type SettingsListProps<T extends React.ElementType = typeof View> =
  PolymorphicProps<T>;

const SettingsList = genericForwardRef(function SettingsList<
  T extends React.ElementType<React.ComponentPropsWithoutRef<typeof View>>,
>({ as, ...restProps }: SettingsListProps<T>, ref: React.ForwardedRef<View>) {
  const Comp = as || View;

  return <Comp ref={ref} {...restProps} />;
});

type SettingsListItemContextValue = {
  color: SettingsListColor;
};

const SettingsListItemContext =
  React.createContext<SettingsListItemContextValue | null>(null);

const useSettingsListItem = () => {
  const ctx = React.useContext(SettingsListItemContext);
  if (ctx === null) {
    throw new Error(
      'useSettingsListItem must be used within a <SettingsListItem />',
    );
  }
  return ctx;
};

type SettingsListItemProps<T extends React.ElementType = typeof Pressable> =
  PolymorphicProps<T> & {
    color?: SettingsListColor;
  };

const SettingsListItem = genericForwardRef(function SettingsListItem<
  T extends React.ElementType<React.ComponentPropsWithoutRef<typeof Pressable>>,
>(
  { as, color = 'neutral', style, ...restProps }: SettingsListItemProps<T>,
  ref: React.ForwardedRef<View>,
) {
  const { styles } = useStyles(stylesheet);

  const Comp = as || Pressable;
  return (
    <SettingsListItemContext.Provider value={{ color }}>
      <Comp
        ref={ref}
        style={state => [
          styles.listItem(state.pressed, color),
          typeof style === 'function' ? style(state) : style,
        ]}
        {...restProps}
      />
    </SettingsListItemContext.Provider>
  );
});

type SettingsListItemTitleProps<T extends React.ElementType = typeof Text> =
  TextProps<T>;

const SettingsListItemTitle = genericForwardRef(function SettingsListItemTitle<
  T extends React.ElementType<React.ComponentPropsWithoutRef<typeof Text>>,
>({ ...props }: SettingsListItemTitleProps<T>, ref: React.ForwardedRef<T>) {
  const { color } = useSettingsListItem();

  return (
    <Text
      ref={ref}
      color={color}
      highContrast={color === 'neutral' || color === 'neutralA'}
      {...props}
    />
  );
});

type SettingsListItemIconProps = IconProps & {
  isEndIcon?: boolean;
};

const SettingsListItemIcon = React.forwardRef<
  React.ElementRef<typeof Icon>,
  SettingsListItemIconProps
>(function SettingsListItemIcon(
  { isEndIcon = false, style, ...restProps }: SettingsListItemIconProps,
  ref,
) {
  const { color } = useSettingsListItem();

  const { styles } = useStyles(stylesheet);

  return (
    <Icon
      ref={ref}
      color={color}
      size={isEndIcon ? 'md' : 'xl'}
      style={[isEndIcon && styles.endIcon, style]}
      {...restProps}
    />
  );
});

const stylesheet = createStyleSheet(({ colors, space }) => ({
  listItem: (pressed: boolean, color: Color) => ({
    backgroundColor: pressed ? colors[`${color}3`] : colors.transparent,
    paddingHorizontal: space[20],
    paddingVertical: space[16],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  }),
  endIcon: {
    flexGrow: 1,
    textAlign: 'right',
  },
}));

export {
  SettingsList,
  SettingsListItem,
  SettingsListItemTitle,
  SettingsListItemIcon,
};

export type {
  SettingsListProps,
  SettingsListItemProps,
  SettingsListItemTitleProps,
  SettingsListItemIconProps,
};
