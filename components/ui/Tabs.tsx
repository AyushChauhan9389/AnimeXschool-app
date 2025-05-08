// NOTE: This component is in development.

import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  View,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, TextProps } from './Text';
import { useControllableState } from '@/hooks/useControllableState';
import { genericForwardRef } from '@/utils/genericForwardRef';
import { Color } from '@/styles/tokens';
import type { PolymorphicProps } from '@/types/components';

type TabsColor = Color;
type TabsOrientation = 'horizontal' | 'vertical';

type TabsContextValue = {
  baseId: string;
  value: string;
  onValueChange: (value: string) => void;
  color: TabsColor;
  orientation: TabsOrientation;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const ctx = React.useContext(TabsContext);
  if (ctx === null) {
    throw new Error('useTabs must be used within a <Tabs />');
  }
  return ctx;
};

type TabsProps<T extends React.ElementType = typeof View> =
  PolymorphicProps<T> & {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    color?: TabsColor;
    orientation?: TabsOrientation;
  };

const Tabs = genericForwardRef(function Tabs<
  T extends React.ElementType<React.ComponentPropsWithoutRef<typeof View>>,
>(
  {
    as,
    defaultValue,
    value: valueProp,
    onValueChange: onValueChangeProp,
    color = 'neutral',
    orientation = 'horizontal',
    style: styleProp,
    ...restProps
  }: TabsProps<T>,
  ref: React.ForwardedRef<View>,
) {
  const [value, onValueChange] = useControllableState({
    defaultValue: defaultValue ?? '',
    controlledValue: valueProp,
    onControlledChange: onValueChangeProp,
  });

  const { styles } = useStyles(stylesheet, { orientation });

  const Comp = as || View;

  return (
    <TabsContext.Provider
      value={{
        baseId: React.useId(),
        value,
        onValueChange,
        color,
        orientation,
      }}
    >
      <Comp ref={ref} style={[styles.container, styleProp]} {...restProps} />
    </TabsContext.Provider>
  );
});

type TabsListProps<T extends React.ElementType = typeof View> =
  PolymorphicProps<T>;

const TabsList = genericForwardRef(function TabsList<
  T extends React.ElementType<React.ComponentPropsWithoutRef<typeof View>>,
>(
  { as, style: styleProp, ...restProps }: TabsListProps<T>,
  ref: React.ForwardedRef<View>,
) {
  const { color, orientation } = useTabs();
  const { styles } = useStyles(stylesheet, {
    orientation,
  });

  // if `as` prop is ScrollView, apply styles to `contentContainerStyle`
  const hasContentContainerStyleProp = 'contentContainerStyle' in restProps;

  const styleProps = hasContentContainerStyleProp
    ? {
        contentContainerStyle: [
          styles.tabList(color),
          restProps.contentContainerStyle,
        ],
      }
    : { style: [styles.tabList(color), styleProp] };

  const Comp = as || View;

  return (
    <Comp
      ref={ref}
      accessibilityRole="tablist"
      {...restProps}
      {...styleProps}
    />
  );
});

type TabsTriggerContextValue = {
  value: string;
  disabled: boolean;
};

const TabsTriggerContext = React.createContext<TabsTriggerContextValue | null>(
  null,
);

const useTabsTrigger = () => {
  const ctx = React.useContext(TabsTriggerContext);
  if (ctx === null) {
    throw new Error('useTabsTrigger must be used within a <TabsTrigger />');
  }
  return ctx;
};

type TabsTriggerProps<T extends React.ElementType = typeof Pressable> =
  PolymorphicProps<T> & {
    children?:
      | React.ReactNode
      | ((
          state: PressableStateCallbackType,
          value: string,
          isSelected: boolean,
        ) => React.ReactNode);
    value: string;
  };

const TabsTrigger = genericForwardRef(function TabsTrigger<
  T extends React.ElementType<React.ComponentPropsWithoutRef<typeof Pressable>>,
>(
  {
    as,
    value,
    onPress: onPressProp,
    children,
    disabled: disabledProp,
    style: styleProp,
    ...restProps
  }: TabsTriggerProps<T>,
  ref: React.ForwardedRef<View>,
) {
  const {
    baseId,
    value: selectedValue,
    onValueChange,
    orientation,
    color,
  } = useTabs();

  const { styles } = useStyles(stylesheet, {
    orientation,
  });

  const disabled = disabledProp ?? false;
  const isSelected = selectedValue === value;

  const triggerId = makeTriggerId(baseId, value);

  const onPress = React.useCallback(
    (e: GestureResponderEvent) => {
      onValueChange?.(value);
      onPressProp?.(e);
    },
    [onPressProp, onValueChange, value],
  );

  const Comp = as || Pressable;

  return (
    <TabsTriggerContext.Provider value={{ value, disabled }}>
      <Comp
        ref={ref}
        nativeID={triggerId}
        accessibilityRole="tab"
        accessibilityState={{ selected: isSelected }}
        disabled={disabled}
        onPress={onPress}
        style={state => [
          styles.tabsTrigger(isSelected, color),
          typeof styleProp === 'function' ? styleProp(state) : styleProp,
        ]}
        {...restProps}
      >
        {state =>
          typeof children === 'function'
            ? children(state, value, isSelected)
            : children
        }
      </Comp>
    </TabsTriggerContext.Provider>
  );
});

type TabsTriggerTextProps<T extends React.ElementType = typeof Text> =
  TextProps<T>;

const TabsTriggerText = genericForwardRef(function TabsTriggerText<
  T extends React.ElementType<React.ComponentPropsWithoutRef<typeof Text>>,
>(props: TabsTriggerTextProps<T>, ref: React.ForwardedRef<T>) {
  const { value: selectedValue, color } = useTabs();
  const { value, disabled } = useTabsTrigger();

  return (
    <Text
      ref={ref}
      variant="labelMd"
      color={color}
      highContrast={value === selectedValue}
      disabled={disabled}
      {...props}
    />
  );
});

type TabsContentProps<T extends React.ElementType = typeof View> =
  PolymorphicProps<T> & {
    value: string;
  };

const TabsContent = genericForwardRef(function TabsContent<
  T extends React.ElementType<React.ComponentPropsWithoutRef<typeof View>>,
>(
  { as, value, ...restProps }: TabsContentProps<T>,
  ref: React.ForwardedRef<View>,
) {
  const { baseId, value: tabValue } = useTabs();

  const isSelected = tabValue === value;

  const triggerId = makeTriggerId(baseId, value);

  if (!isSelected) {
    return null;
  }

  const Comp = as || View;

  return (
    <Comp
      ref={ref}
      role="tabpanel"
      accessibilityLabelledBy={triggerId}
      {...restProps}
    />
  );
});

const stylesheet = createStyleSheet(({ colors, radius, space }) => ({
  container: {
    variants: {
      orientation: {
        horizontal: {
          flexDirection: 'column',
        },
        vertical: {
          flexDirection: 'row',
        },
      },
    },
  },
  tabList: (color: Color) => ({
    padding: space[4],
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    backgroundColor: colors[`${color}3`],
    variants: {
      orientation: {
        horizontal: {
          flexDirection: 'row',
          alignSelf: 'flex-start', // it prevents tabs list to take all available width
        },
        vertical: {
          flexDirection: 'column',
        },
      },
    },
  }),
  tabsTrigger: (isSelected: boolean, color: Color) => ({
    justifyContent: 'center',
    alignItems: 'center',
    gap: space[8],
    paddingVertical: space[8],
    paddingHorizontal: space[16],
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: isSelected ? colors[`${color}1`] : colors.transparent,
    elevation: isSelected ? 4 : 0,
    shadowColor: isSelected ? colors[`${color}8`] : colors.transparent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  }),
}));

function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`;
}

export { Tabs, TabsList, TabsTrigger, TabsTriggerText, TabsContent, useTabs };
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsTriggerTextProps,
  TabsContentProps,
};
