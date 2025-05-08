import { useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { Cart } from '@/types/cart';
import { ProductImage } from '../product/ProductImage';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/Collapsible';
import { Icon } from '@/components/ui/Icon';
import { RS } from '@/constants/currency';
import { formatRupee } from '@/utils/formatters';

type OrderSummaryProps = {
  cart: Cart;
};

const OrderSummary = ({ cart }: OrderSummaryProps) => {
  const { styles } = useStyles(stylesheet);

  const [open, setOpen] = useState(false);

  const items = cart.items;
  const items_count = cart.item_count;

  const total = Number(cart.totals.total) / 100; // convert from paise to rupee

  return (
    <View>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger style={styles.trigger}>
          <View>
            <Text variant="labelMd" highContrast>
              Your Order
            </Text>
            <Text variant="bodyMd" highContrast>
              {items_count} {items_count > 1 ? 'Items' : 'Item'}
            </Text>
          </View>
          <View style={styles.rowAlignCenter}>
            <View>
              <Text variant="bodyMd" highContrast>
                Total
              </Text>
              <Text variant="labelMd" highContrast>
                {RS}
                {formatRupee(`${total}`)}
              </Text>
            </View>
            <Icon name={open ? 'chevron-up' : 'chevron-down'} />
          </View>
        </CollapsibleTrigger>
        <CollapsibleContent style={styles.items}>
          {items.map((item, index) => {
            const variations =
              !Array.isArray(item.meta.variation) &&
              Object.entries(item.meta.variation).map(([key, value]) => ({
                label: key,
                value,
              }));
            const price = Number(item.price) * item.quantity.value;
            return (
              <View key={index} style={styles.item}>
                <ProductImage
                  source={item.featured_image}
                  containerStyle={styles.itemImage}
                />
                <View style={styles.itemRight}>
                  <Text variant="bodySm" numberOfLines={2} highContrast>
                    {item.name}
                  </Text>
                  <View style={styles.variations}>
                    {variations &&
                      variations.map(({ label, value }, i) => {
                        return (
                          <View key={i} style={styles.variation}>
                            <Text variant="bodyXs" textTransform="capitalize">
                              {label}:
                            </Text>
                            <Text variant="bodyXs" highContrast>
                              {value}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                  <View style={styles.variation}>
                    <Text variant="bodyXs" textTransform="capitalize">
                      Qty:
                    </Text>
                    <Text variant="bodyXs" highContrast>
                      {item.quantity.value}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text highContrast>
                    {RS}
                    {formatRupee(`${price / 100}`)}
                  </Text>
                </View>
              </View>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  trigger: {
    flexDirection: 'row',
    gap: space[12],
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: space[12],
    paddingHorizontal: space[16],
    backgroundColor: colors.neutral3,
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
  items: {
    paddingTop: space[12],
    gap: space[12],
    paddingHorizontal: space[8],
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    gap: space[12],
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    borderCurve: 'continuous',
  },
  itemRight: {
    flex: 1,
  },
  variations: {
    flexDirection: 'row',
    gap: space[12],
    flexWrap: 'wrap',
  },
  variation: {
    flexDirection: 'row',
    gap: space[2],
    alignItems: 'center',
  },
}));

export { OrderSummary };
export type { OrderSummaryProps };
