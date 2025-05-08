import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { Address } from '@/types/user';
import { Button, ButtonIcon } from '@/components/ui/Button';
import { useDeleteAddressMutation } from '@/hooks/api/useCustomer';
import { useCallback } from 'react';

type AddressCardProps = {
  item: Address;
};

const AddressCard = ({ item }: AddressCardProps) => {
  const { styles } = useStyles(stylesheet);

  const deleteAddressMutation = useDeleteAddressMutation();

  const handleDeleteAddress = useCallback(() => {
    deleteAddressMutation.mutate({ addressId: item.address_id });
  }, [deleteAddressMutation, item.address_id]);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
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
      <View style={styles.rightContainer}>
        <Button
          variant="ghost"
          color="red"
          size="sm"
          iconOnly
          onPress={handleDeleteAddress}
        >
          <ButtonIcon name="trash" />
        </Button>
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: space[12],
    justifyContent: 'space-between',
    padding: space[16],
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: colors.neutral3,
  },
  leftContainer: {
    gap: space[8],
  },
  rightContainer: {
    gap: space[8],
    justifyContent: 'space-between',
  },
  itemGroup: {
    gap: space[1],
  },
}));

export { AddressCard };
export type { AddressCardProps };
