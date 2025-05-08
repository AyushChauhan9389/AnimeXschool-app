import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { Text } from '../../ui/Text';
import { ProductImage } from '../product/ProductImage';
import { formatRupee } from '@/utils/formatters';
import { Button, ButtonIcon } from '@/components/ui/Button';
import {
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from '@/hooks/api/useCart';
import { RS } from '@/constants/currency';
import { CartItem } from '@/types/cart';
import { Spinner } from '@/components/ui/Spinner';

const ACTIONS_HEIGHT = 44;
const CART_CARD_IMAGE_HEIGHT = 80;
// This is not the accurate height (Don't use this in `getItemLayout`)
const CART_CARD_HEIGHT = ACTIONS_HEIGHT + CART_CARD_IMAGE_HEIGHT + 16;

type CartCardProps = {
  item: CartItem;
};

const CartCard = ({ item }: CartCardProps) => {
  const { id, title, featured_image } = item;
  const parent_id = item.meta?.parent_id;
  const productType = item.meta?.product_type;

  const router = useRouter();
  const { styles } = useStyles(stylesheet);

  const updateItemQuantityMutation = useUpdateCartItemQuantityMutation();

  const removeItemMutation = useRemoveCartItemMutation();

  const decrementQuantityButtonDisabled = item.quantity.value === 1;
  const incrementQuantityButtonDisabled =
    item.quantity.max_purchase === -1
      ? false
      : item.quantity.value >= item.quantity.max_purchase;

  // In cart item price is in paise not rupees
  const price = Number(item.price) / 100;

  const meta = item.meta;

  const variations =
    !Array.isArray(meta.variation) &&
    Object.entries(meta.variation).map(([key, value]) => ({
      label: key,
      value,
    }));

  const handlePress = useCallback(() => {
    if (productType === 'simple') {
      router.push(`/product/${id}`);
    } else {
      router.push(`/product/${parent_id ?? id}`);
    }
  }, [id, parent_id, productType, router]);

  const handleIncrementQuantity = useCallback(() => {
    updateItemQuantityMutation.mutate({
      itemKey: item.item_key,
      quantity: `${item.quantity.value + 1}`,
    });
  }, [item.item_key, item.quantity.value, updateItemQuantityMutation]);

  const handleDecrementQuantity = useCallback(() => {
    if (item.quantity.value === 1) {
      return;
    }
    updateItemQuantityMutation.mutate({
      itemKey: item.item_key,
      quantity: `${item.quantity.value - 1}`,
    });
  }, [item.item_key, item.quantity.value, updateItemQuantityMutation]);

  const handleRemoveItem = useCallback(() => {
    removeItemMutation.mutate({ itemKey: item.item_key });
  }, [item.item_key, removeItemMutation]);

  return (
    <>
      <View style={styles.container}>
        <Pressable onPress={handlePress} style={styles.top}>
          {/* Thumbnail */}
          <ProductImage
            source={{ uri: featured_image }}
            width={CART_CARD_IMAGE_HEIGHT}
            height={CART_CARD_IMAGE_HEIGHT}
          />

          {/* Details */}
          <View style={styles.topRight}>
            <Text
              variant="bodyMd"
              textBreakStrategy="highQuality"
              lineBreakStrategyIOS="standard"
              ellipsizeMode="tail"
              numberOfLines={2}
              style={styles.name}
              highContrast
            >
              {title}
            </Text>

            {/* Variation */}
            {variations && (
              <View style={styles.variations}>
                {variations.map(({ label, value }, i) => {
                  return (
                    <View key={i} style={styles.variation}>
                      <Text variant="labelXs" textTransform="capitalize">
                        {label}:
                      </Text>
                      <Text variant="labelXs" highContrast>
                        {value}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text variant="labelMd" fontFamily="interSemiBold" highContrast>
                {RS}
                {formatRupee(`${price * item.quantity.value}`)}
              </Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.actionsContainer}>
          <Button
            size="sm"
            color="red"
            variant="soft"
            iconOnly
            disabled={removeItemMutation.isPending}
            onPress={handleRemoveItem}
          >
            {removeItemMutation.isPending ? (
              <Spinner size="sm" colorStep="8" />
            ) : (
              <ButtonIcon name="trash" />
            )}
          </Button>
          {/* Quantity manager */}
          <View style={styles.quantityContainer}>
            <Button
              color="neutral"
              variant="soft"
              size="sm"
              iconOnly
              disabled={decrementQuantityButtonDisabled}
              onPress={handleDecrementQuantity}
            >
              <ButtonIcon name="remove" />
            </Button>
            <Text variant="labelMd" fontFamily="interSemiBold" highContrast>
              {item.quantity.value}
            </Text>
            <Button
              color="neutral"
              variant="soft"
              size="sm"
              iconOnly
              disabled={incrementQuantityButtonDisabled}
              onPress={handleIncrementQuantity}
            >
              <ButtonIcon name="add" />
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};

const stylesheet = createStyleSheet(({ space, colors, radius }) => ({
  container: {
    flex: 1,
    gap: space[12],
    borderWidth: 1,
    borderColor: colors.neutral6,
    borderRadius: radius.xl,
    borderCurve: 'continuous',
    padding: space[16],
  },
  top: {
    flexDirection: 'row',
    gap: space[16],
  },
  topRight: {
    flex: 1,
    gap: space[8],
  },
  name: {
    letterSpacing: -0.5,
  },
  priceContainer: {
    flexDirection: 'row',
    gap: space[4],
    alignItems: 'center',
  },
  regularPrice: {
    textDecorationLine: 'line-through',
  },
  offPercentage: {
    letterSpacing: -0.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: space[4],
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    gap: space[12],
    alignItems: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space[8],
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

export { CartCard, CART_CARD_HEIGHT };
export type { CartCardProps };
