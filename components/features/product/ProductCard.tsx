import { Pressable, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { Text } from '../../ui/Text';
import { WishlistButton } from '../../WishlistButton';
import { ProductImage } from './ProductImage';
import { Badge, BadgeText } from '@/components/ui/Badge';
import { formatRupee } from '@/utils/formatters';
import { calculateOffPercentage } from '@/utils/product';
import { RS } from '@/constants/currency';
import { Product } from '@/types/product';
import { ProductRatingBadge } from './ProductRatingBadge';

const PRODUCT_CARD_IMAGE_HEIGHT = 180;
const PRODUCT_CARD_HEIGHT = PRODUCT_CARD_IMAGE_HEIGHT + 100;

type ProductCardProps = {
  product: Product;
  style?: ViewProps['style'];
};

const ProductCard = ({ product, style }: ProductCardProps) => {
  const { id, name, price, images, regular_price } = product;

  const router = useRouter();
  const { styles } = useStyles(stylesheet);

  const thumbnail = images[0] || null;
  const offPercentage = calculateOffPercentage(price, regular_price);

  const isOutOfStock = product.stock_status === 'outofstock';
  const isOnSale = product.on_sale;

  const averageRating = product.average_rating;
  const ratingCount = product.rating_count;

  const handlePress = useCallback(() => {
    router.push(`/product/${id}`);
  }, [id, router]);

  return (
    <Pressable onPress={handlePress} style={[styles.container, style]}>
      <WishlistButton
        color="neutral"
        item={product}
        style={styles.wishlistButton}
      />

      {/* Thumbnail */}
      <ProductImage
        source={{ uri: thumbnail?.src }}
        width={'100%'}
        height={PRODUCT_CARD_IMAGE_HEIGHT}
        containerStyle={styles.imageContainer}
        contentFit="contain"
      />

      {/* Product details */}
      <View style={styles.footer}>
        <Text
          variant="bodySm"
          textBreakStrategy="highQuality"
          lineBreakStrategyIOS="standard"
          ellipsizeMode="tail"
          numberOfLines={2}
          style={styles.name}
          highContrast
        >
          {name}
        </Text>
        <View style={styles.priceContainer}>
          <Text variant="labelMd" fontFamily="interSemiBold" highContrast>
            {RS}
            {formatRupee(price)}
          </Text>
          {offPercentage > 0 && (
            <>
              <Text variant="labelXs" colorStep="9" style={styles.regularPrice}>
                {RS}
                {formatRupee(regular_price)}
              </Text>
              <Text
                variant="labelXs"
                color="green"
                numberOfLines={1}
                lineBreakMode="tail"
                style={styles.offPercentage}
              >
                {offPercentage}% Off
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Badges (onSale, outOfStock) */}
      <View style={styles.badgesContainer}>
        {isOnSale && (
          <Badge>
            <BadgeText>On Sale</BadgeText>
          </Badge>
        )}
        {isOutOfStock && (
          <Badge color="neutral">
            <BadgeText>Out of Stock</BadgeText>
          </Badge>
        )}
      </View>
      <View style={styles.reviewBadgeContainer}>
        <ProductRatingBadge
          averageRating={averageRating}
          ratingCount={ratingCount}
          showRatingCount={false}
          size="md"
        />
      </View>
    </Pressable>
  );
};

const stylesheet = createStyleSheet(({ colors, space }) => ({
  container: {
    flex: 1,
    // maxWidth: PRODUCT_CARD_IMAGE_HEIGHT,
    height: PRODUCT_CARD_HEIGHT,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: colors.neutral2,
    backgroundColor: colors.transparent,
  },
  badgesContainer: {
    position: 'absolute',
    top: space[8],
    left: space[8],
    zIndex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  reviewBadgeContainer: {
    position: 'absolute',
    top: PRODUCT_CARD_IMAGE_HEIGHT - space[8] - 24,
    left: space[8],
    zIndex: 2,
  },
  wishlistButton: {
    position: 'absolute',
    top: PRODUCT_CARD_IMAGE_HEIGHT - space[44],
    right: space[8],
    zIndex: 2,
    boxShadow: `0 2 12 2 ${colors.blackA3}`,
  },
  footer: {
    gap: space[4],
    paddingVertical: space[8],
    paddingHorizontal: space[2],
  },
  name: {
    letterSpacing: -0.5,
  },
  priceContainer: {
    flexDirection: 'row',
    columnGap: space[4],
    rowGap: space[1],
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  regularPrice: {
    textDecorationLine: 'line-through',
    letterSpacing: -0.5,
  },
  offPercentage: {
    // flex: 1,
    letterSpacing: -0.5,
  },
}));

export { ProductCard, PRODUCT_CARD_HEIGHT };
export type { ProductCardProps };
