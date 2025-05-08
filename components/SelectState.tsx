import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import {
  Select,
  SelectItem,
  SelectOverlay,
  SelectTrigger,
  SelectValueText,
  useSelect,
} from './ui/Select';
import { SelectContent, SelectItemIndicator, SelectPortal } from './ui/Select';
import { Text } from './ui/Text';
import { Button, ButtonIcon } from './ui/Button';
import { DialogClose, DialogTitle } from './ui/Dialog';
import { TextInput, TextInputAdornment } from './ui/TextInput';
import { Icon } from './ui/Icon';
import { indiaTerritories } from '@/constants/india';

// avg height of a state item
const ITEM_HEIGHT = 48;

type SelectStateProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string;
};

const SelectState = ({
  value,
  onValueChange,
  onBlur,
  disabled,
  placeholder = 'Select state',
}: SelectStateProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        as={Button}
        variant="outline"
        color="neutral"
        accessibilityLabel="Select state"
        onBlur={onBlur}
        disabled={disabled}
        style={{ justifyContent: 'space-between' }}
      >
        <SelectValueText placeholder={placeholder} />
        <ButtonIcon name="chevron-down" />
      </SelectTrigger>
      <SelectPortal>
        <SelectOverlay />
        <SelectContent>
          <View style={styles.header}>
            <DialogTitle>Select state</DialogTitle>
            <DialogClose
              as={Button}
              color="neutral"
              variant="soft"
              size="sm"
              iconOnly
            >
              <ButtonIcon name="close" />
            </DialogClose>
          </View>

          <List />
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

const List = () => {
  const { value } = useSelect(); // we can access the value from the context

  const listRef = useRef<FlashList<(typeof indiaTerritories)[number]>>(null);

  const [searchValue, setSearchValue] = useState('');

  const initialScrollIndex = indiaTerritories.findIndex(
    item => item.state === value,
  );

  const countries = React.useMemo(() => {
    if (!searchValue) {
      return indiaTerritories;
    }
    return indiaTerritories.filter(item =>
      item.state.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [searchValue]);

  const keyExtractor = useCallback(
    (item: (typeof indiaTerritories)[number]) => {
      return item.state;
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: (typeof indiaTerritories)[number] }) => {
      return (
        <SelectItem value={item.state} accessibilityLabel={item.state}>
          <SelectItemIndicator />
          <Text highContrast style={{ flex: 1 }}>
            {item.state}
          </Text>
        </SelectItem>
      );
    },
    [],
  );

  return (
    <>
      {/* Search bar */}
      <TextInput
        placeholder="Search state"
        value={searchValue}
        onChangeText={setSearchValue}
        startAdornment={
          <TextInputAdornment>
            <Icon name="search" />
          </TextInputAdornment>
        }
      />
      <FlashList
        ref={listRef}
        data={countries}
        extraData={countries}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={ITEM_HEIGHT}
        initialScrollIndex={initialScrollIndex}
        scrollEventThrottle={16}
      />
    </>
  );
};

const stylesheet = createStyleSheet(() => ({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export { SelectState };
export type { SelectStateProps };
