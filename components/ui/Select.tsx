// NOTE: This is a work in progress
import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  View,
  ViewProps,
} from 'react-native';

import {
  Dialog,
  DialogContent,
  DialogContentProps,
  DialogOverlay,
  DialogOverlayProps,
  DialogPortal,
  DialogPortalProps,
  DialogTrigger,
  DialogTriggerProps,
  useDialog,
} from './Dialog';
import { useControllableState } from '@/hooks/useControllableState';
import { Text, TextProps } from './Text';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Icon } from './Icon';

type SelectContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelect = () => {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error('useSelect must be used within a <Select />');
  }
  return ctx;
};

type SelectProps = {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

const Select = ({
  children,
  defaultValue,
  value: valueProp,
  onValueChange: onValueChangeProp,
  defaultOpen = false,
  open,
  onOpenChange,
  disabled = false,
}: SelectProps) => {
  const [value, onValueChange] = useControllableState({
    defaultValue: defaultValue || '',
    controlledValue: valueProp,
    onControlledChange: onValueChangeProp,
  });

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        disabled,
      }}
    >
      <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    </SelectContext.Provider>
  );
};

// type SelectTriggerProps = Omit<DialogTriggerProps, 'as'>;

// const SelectTrigger = ({ children, ...restProps }: SelectTriggerProps) => {
//   const { disabled } = useSelect();

//   return (
//     <DialogTrigger disabled={disabled} {...restProps}>
//       {children}
//     </DialogTrigger>
//   );
// };
type SelectTriggerProps = DialogTriggerProps;

const SelectTrigger = DialogTrigger;

type SelectValueTextProps = TextProps & {
  placeholder?: string;
};

const SelectValueText = ({
  placeholder,
  ...restProps
}: SelectValueTextProps) => {
  const { value } = useSelect();
  const hasValue = !!value;
  return (
    <Text colorStep={hasValue ? '12' : '9'} {...restProps}>
      {value || placeholder}
    </Text>
  );
};

type SelectPortalProps = DialogPortalProps;

const SelectPortal = ({ children, ...restProps }: SelectPortalProps) => {
  const ctx = useSelect();

  return (
    <DialogPortal {...restProps}>
      <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>
    </DialogPortal>
  );
};

type SelectOverlayProps = DialogOverlayProps;

const SelectOverlay = DialogOverlay;

type SelectContentProps = DialogContentProps;

const SelectContent = DialogContent;

type SelectItemContextValue = {
  value: string;
};

const SelectItemContext = React.createContext<SelectItemContextValue | null>(
  null,
);

const useSelectItem = () => {
  const ctx = React.useContext(SelectItemContext);
  if (!ctx) {
    throw new Error('useSelectItem must be used within a <SelectItem />');
  }
  return ctx;
};

type SelectItemProps = PressableProps & {
  value: string;
};

const SelectItem = ({
  value: valueProp,
  onPress: onPressProp,
  style: styleProp,
  ...restProps
}: SelectItemProps) => {
  const { disabled, onValueChange } = useSelect();
  const { onClose } = useDialog();

  const { styles } = useStyles(stylesheet);

  const onPress = React.useCallback(
    (e: GestureResponderEvent) => {
      onValueChange(valueProp);
      onPressProp?.(e);
      onClose();
    },
    [onValueChange, valueProp, onPressProp, onClose],
  );

  return (
    <SelectItemContext.Provider
      value={{
        value: valueProp,
      }}
    >
      <Pressable
        role="option"
        disabled={disabled}
        onPress={onPress}
        style={state => [
          styles.item(state.pressed),
          typeof styleProp === 'function' ? styleProp(state) : styleProp,
        ]}
        {...restProps}
      />
    </SelectItemContext.Provider>
  );
};

type SelectItemIndicatorProps = ViewProps;

const SelectItemIndicator = ({
  children: childrenProp,
  style,
  ...restProps
}: SelectItemIndicatorProps) => {
  const { value: ctxValue } = useSelect();
  const { value } = useSelectItem();

  const { styles } = useStyles(stylesheet);

  const children = childrenProp || <Icon name="checkmark" size="xl" />;

  return (
    <View style={[styles.itemIndicator, style]} {...restProps}>
      {value === ctxValue && children}
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  item: (pressed: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[12],
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: pressed ? colors.neutral3 : colors.transparent,
  }),
  itemIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export {
  Select,
  SelectTrigger,
  SelectValueText,
  SelectPortal,
  SelectOverlay,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  useSelect,
  useSelectItem,
};
export type {
  SelectProps,
  SelectTriggerProps,
  SelectValueTextProps,
  SelectPortalProps,
  SelectOverlayProps,
  SelectContentProps,
  SelectItemProps,
  SelectItemIndicatorProps,
  SelectItemContextValue,
};
