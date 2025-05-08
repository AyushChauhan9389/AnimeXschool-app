import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { Text } from '../../ui/Text';
import { ProductImage } from '../product/ProductImage';
import { Button, ButtonIcon } from '@/components/ui/Button';
import { formatRupee } from '@/utils/formatters';
import { LocalCartItem, useLocalCartStore } from '@/stores/useLocalCartStore';
import { RS } from '@/constants/currency';

const CART_CARD_IMAGE_HEIGHT = 80;

type LocalCartCardProps = {
  item: LocalCartItem;
};

const LocalCartCard = ({ item }: LocalCartCardProps) => {
  const { id, title, featured_image } = item;
  const parent_id = item.meta?.parent_id;
  const productType = item.meta?.product_type;

  const router = useRouter();

  const { styles } = useStyles(stylesheet);

  const { removeItem, updateItemQuantity } = useLocalCartStore();

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
    updateItemQuantity(item.item_key, item.quantity.value + 1);
  }, [item.item_key, item.quantity.value, updateItemQuantity]);

  const handleDecrementQuantity = useCallback(() => {
    if (item.quantity.value === 1) {
      return;
    }
    updateItemQuantity(item.item_key, item.quantity.value - 1);
  }, [item.item_key, item.quantity.value, updateItemQuantity]);

  const handleRemoveItem = useCallback(() => {
    removeItem(item.item_key);
  }, [item.item_key, removeItem]);

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
            onPress={handleRemoveItem}
          >
            <ButtonIcon name="trash" />
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

export { LocalCartCard };
export type { LocalCartCardProps };
