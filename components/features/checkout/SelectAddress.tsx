import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';

import { Text } from '@/components/ui/Text';
import { Address } from '@/types/user';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/RadioGroup';

const ITEM_AVG_HEIGHT = 158 + 16; // height of the item + gap(16px)

type SelectAddressProps = {
  label?: string;
  data: Address[];
  address: Address;
  onAddressChange: (value: Address) => void;
  disabled?: boolean;
};

const SelectAddress = ({
  label,
  data,
  address,
  onAddressChange,
  disabled,
}: SelectAddressProps) => {
  const { styles } = useStyles(stylesheet);

  const initialScrollIndex = data.findIndex(
    item => item.address_id === address.address_id,
  );

  const handleValueChange = useCallback(
    (addressId: string) => {
      const selectedAddress = data.find(item => item.address_id === addressId);
      if (selectedAddress) {
        onAddressChange(selectedAddress);
      }
    },
    [data, onAddressChange],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Address>) => {
      return (
        <RadioGroupItem
          key={item.address_id}
          as={DialogClose}
          value={item.address_id}
          style={styles.radioGroupItem(item.address_id === address.address_id)}
        >
          <RadioGroupIndicator />
          <AddressView item={item} />
        </RadioGroupItem>
      );
    },
    [address.address_id, styles],
  );

  return (
    <Dialog>
      <DialogTrigger
        style={state => [
          styles.trigger(state.pressed),
          disabled && styles.disabledTrigger,
        ]}
        disabled={disabled}
      >
        <AddressView item={address} />
        <Icon name="chevron-expand" size="xl" />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent width={600} insets={{ left: 16, right: 16 }}>
          <DialogTitle>{label ?? 'Select Address'}</DialogTitle>
          <RadioGroup
            value={address.address_id}
            onValueChange={handleValueChange}
            style={styles.scrollViewContainer}
          >
            <FlashList
              renderItem={renderItem}
              data={data}
              estimatedItemSize={ITEM_AVG_HEIGHT}
              initialScrollIndex={initialScrollIndex}
            />
          </RadioGroup>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

const AddressView = ({ item }: { item: Address }) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.group}>
      <View style={styles.itemGroup}>
        <Text variant="labelMd" highContrast>
          {item.first_name} {item.last_name}
        </Text>
      </View>
      <View style={styles.itemGroup}>
        <Text variant="bodySm" highContrast>
          {item.postcode}
        </Text>
        <Text variant="bodySm" highContrast>
          {item.city}, {item.state}
        </Text>
        <Text variant="bodySm" highContrast>
          {item.address_1}
        </Text>
        {item.address_2 ? (
          <Text variant="bodySm" highContrast>
            {item.address_2}
          </Text>
        ) : null}
      </View>
      <View style={styles.itemGroup}>
        <Text variant="bodySm" highContrast>
          {item.phone}
        </Text>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ space, radius, colors }) => ({
  trigger: (pressed: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[8],
    padding: space[16],
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: pressed ? colors.neutral4 : colors.neutral3,
  }),
  disabledTrigger: {
    opacity: 0.7,
  },
  group: {
    gap: space[8],
  },
  itemGroup: {
    gap: space[1],
  },
  scrollViewContainer: {
    height: 400,
    marginTop: space[8],
  },
  scrollView: {
    gap: space[16],
  },
  radioGroupItem: (selected: boolean) => ({
    flexDirection: 'row',
    gap: space[12],
    padding: space[16],
    borderRadius: radius.md,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: selected ? colors.primary8 : colors.neutral7,
    marginBottom: space[16],
  }),
}));

export { SelectAddress };
export type { SelectAddressProps };
