import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { Text } from './ui/Text';
import { WishlistButton } from './WishlistButton';
import { formatRupee } from '@/utils/formatters';
import { calculateOffPercentage } from '@/utils/product';
import { RS } from '@/constants/currency';
import { Product } from '@/types/product';
import { ProductImage } from './features/product/ProductImage';

const WISHLIST_CARD_HEIGHT = 100;
const WISHLIST_CARD_IMAGE_HEIGHT = 100;

type WishlistCardProps = {
  product: Product;
};

const WishlistCard = ({ product }: WishlistCardProps) => {
  const { id, name, price, images, regular_price } = product;

  const router = useRouter();
  const { styles } = useStyles(stylesheet);

  const thumbnail = images.length ? images[0] : null;
  const offPercentage = calculateOffPercentage(price, regular_price);

  const handlePress = useCallback(() => {
    router.push(`/product/${id}`);
  }, [id, router]);

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      {/* Thumbnail */}

      <ProductImage
        source={{ uri: thumbnail?.src }}
        width={WISHLIST_CARD_IMAGE_HEIGHT}
        height={WISHLIST_CARD_IMAGE_HEIGHT}
      />

      {/* Details */}
      <View style={styles.right}>
        <Text
          variant="bodySm"
          textBreakStrategy="highQuality"
          lineBreakStrategyIOS="standard"
          ellipsizeMode="tail"
          numberOfLines={2}
          style={styles.name}
        >
          {name}
        </Text>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text variant="labelMd" fontFamily="interSemiBold" highContrast>
            {RS}
            {formatRupee(price)}
          </Text>
          {offPercentage > 0 && (
            <>
              <Text
                variant="labelSm"
                colorStep="10"
                style={styles.regularPrice}
              >
                {RS}
                {formatRupee(regular_price)}
              </Text>
              <Text
                variant="labelSm"
                color="green"
                style={styles.offPercentage}
              >
                {offPercentage}% Off
              </Text>
            </>
          )}
        </View>
      </View>
      <WishlistButton item={product} size="sm" style={styles.wishlistBtn} />
    </Pressable>
  );
};

const stylesheet = createStyleSheet(({ colors, radius, space }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    height: WISHLIST_CARD_HEIGHT,
  },
  wishlistBtn: {
    position: 'absolute',
    bottom: space[8],
    right: space[0],
    zIndex: 2,
    boxShadow: `0 0 2 0 ${colors.neutralA3}`,
  },
  right: {
    flex: 1,
    gap: space[4],
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
}));

export { WishlistCard };
export type { WishlistCardProps };
