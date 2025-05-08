import { RefreshControl, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link, useLocalSearchParams } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { WishlistButton } from '@/components/WishlistButton';
import Carousel from '@/components/Carousel';
import {
  ProductCategories,
  ProductMainDetails,
} from '@/components/features/product/ProductDetails';
import { useScreenDimensions } from '@/hooks/useScreenDimensions';
import { useProduct } from '@/hooks/api/useProducts';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateImage,
  EmptyStateTitle,
} from '@/components/EmptyState';
import {
  useAddToCartItemMutation,
  useItemExistsInCart,
} from '@/hooks/api/useCart';
import { Spinner } from '@/components/ui/Spinner';
import { BackButton } from '@/components/BackButton';
import { ProductVariations } from '@/components/features/product/ProductVariations';
import { ProductDescription } from '@/components/features/product/ProductDescription';
import { useEffect, useState } from 'react';
import { Product, ProductVariation } from '@/types/product';
import { useAuthStore } from '@/stores/authStore';
import {
  createLocalCartItem,
  useItemExistsInLocalCart,
  useLocalCartStore,
} from '@/stores/useLocalCartStore';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/Alert';
import { Icon } from '@/components/ui/Icon';
import { CartButton } from '@/components/CartButton';
import { ProductEstimateDeliveryDate } from '@/components/features/product/ProductEstimateDeliveryDate';
import { Separator } from '@/components/ui/Separator';
import { ProductRatingBadge } from '@/components/features/product/ProductRatingBadge';
import { ProductPoints } from '@/components/features/product/ProductPoints';

const returnableMetaData: Product['meta_data'][0] = {
  id: 187741,
  key: '_is_returnable',
  value: 'yes',
};

export default function ProductScreen() {
  const { styles } = useStyles(stylesheet);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const { addItem } = useLocalCartStore();

  const { id } = useLocalSearchParams();

  const { data, isLoading, error, refetch, isRefetching } = useProduct(
    Number(id),
  );

  const addToCartMutation = useAddToCartItemMutation();

  const product = data?.product;

  const variations = data?.variations.filter(
    item => item.attributes.length > 0,
  );

  const stockStatus = product?.stock_status;
  const purchasable = product?.purchasable;
  const isReturnable =
    product?.meta_data.find(item => item.key === returnableMetaData.key)
      ?.value === returnableMetaData.value
      ? true
      : false;

  const averageRating = product?.average_rating;
  const ratingCount = product?.rating_count;

  const isVariationProduct = product?.type !== 'simple';

  const defaultVariation = variations?.length ? variations[0] : null;

  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(defaultVariation);

  const images = product?.images;

  const disabledAddToCartButton =
    !purchasable || stockStatus !== 'instock' || addToCartMutation.isPending;

  useEffect(() => {
    setSelectedVariation(defaultVariation);
  }, [defaultVariation]);

  const productId = isVariationProduct ? selectedVariation?.id : product.id;

  const handleAddToCart = () => {
    if (!product || !productId) {
      return;
    }

    if (isAuthenticated) {
      // add to the server cart
      addToCartMutation.mutate({
        products: [
          {
            product_id: String(productId),
            quantity: '1',
          },
        ],
      });
    } else {
      // add to the local cart
      const item = createLocalCartItem(product, selectedVariation);
      addItem(item);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <BackButton />
        </View>

        <View style={styles.row}>
          <Link href="/search" asChild>
            <Button color="neutral" variant="soft" iconOnly>
              <ButtonIcon name="search" />
            </Button>
          </Link>
          <CartButton />
        </View>
      </View>

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        isRetrying={isRefetching}
        LoadingComponent={LoadingComponent}
      >
        {/* Product Details */}
        {product ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          >
            <View>
              <ProductImageCarousel images={images} />
              <WishlistButton
                color="neutral"
                item={product}
                size="md"
                style={styles.wishlistButton}
              />
            </View>

            <View style={styles.detailsContainer}>
              <ProductMainDetails product={product} />

              <ProductRatingBadge
                averageRating={averageRating}
                ratingCount={ratingCount}
              />

              {/* Categories */}
              {product.categories.length > 0 && (
                <ProductCategories product={product} />
              )}

              {/* Variations */}
              {variations && variations?.length > 0 && (
                <View style={styles.group}>
                  <Text variant="labelLg" highContrast>
                    Select Variant
                  </Text>
                  {selectedVariation && (
                    <ProductVariations
                      variations={variations}
                      selectedVariation={selectedVariation}
                      onApply={setSelectedVariation}
                    />
                  )}
                </View>
              )}

              <Separator />

              <View style={styles.group}>
                <Text variant="labelLg" highContrast>
                  Estimated Delivery Date
                </Text>
                <ProductEstimateDeliveryDate />
              </View>

              <Separator />

              <ProductReturnableAlert isReturnable={isReturnable} />

              <ProductPoints product={product} />

              <Separator />

              {/* Product Description */}
              <View style={styles.group}>
                <Text variant="labelLg" highContrast>
                  Description
                </Text>
                {!product.description ? (
                  <Text variant="bodySm">No description available</Text>
                ) : (
                  <ProductDescription html={product.description} />
                )}
              </View>
            </View>
          </ScrollView>
        ) : (
          <EmptyState>
            <EmptyStateImage
              source={require('@/assets/images/animal-pana.png')}
            />
            <EmptyStateTitle>Product not found</EmptyStateTitle>
          </EmptyState>
        )}

        {/* Actions */}
        {product && (
          <View style={styles.actionsContainer}>
            {purchasable && productId ? (
              <AddToCartButton
                productId={productId}
                disabled={disabledAddToCartButton}
                loading={addToCartMutation.isPending}
                onPress={handleAddToCart}
              />
            ) : (
              <View style={styles.row}>
                <Icon name="close-circle" size="2xl" color="red" />
                <Text highContrast>This product is not purchasable.</Text>
              </View>
            )}
          </View>
        )}
      </AsyncBoundary>
    </View>
  );
}

const ProductImageCarousel = ({ images }: { images?: Product['images'] }) => {
  const { height: screenHeight } = useScreenDimensions();

  const { styles } = useStyles(stylesheet);

  if (!images || images.length === 0) {
    return (
      <EmptyState style={[styles.carousel, { height: screenHeight * 0.5 }]}>
        <Icon
          name="image"
          style={{ fontSize: screenHeight * 0.25 }}
          colorStep="8"
        />
        <EmptyStateDescription>No images available</EmptyStateDescription>
      </EmptyState>
    );
  }
  return (
    <Carousel
      data={images.map(item => ({
        url: item.src,
        alt: item.alt,
      }))}
      imageHeight={screenHeight * 0.5}
      contentFit="contain"
      containerStyle={styles.carousel}
    />
  );
};

const ProductReturnableAlert = ({
  isReturnable,
}: {
  isReturnable: boolean;
}) => {
  const { styles } = useStyles(stylesheet);

  if (isReturnable) {
    return (
      <Alert size="md" variant="soft" color="neutral" style={styles.row}>
        <AlertIcon name="checkmark-circle" color="green" colorStep="9" />
        <AlertTitle>This product is returnable.</AlertTitle>
      </Alert>
    );
  }
  return (
    <Alert size="md" variant="soft" color="neutral" style={styles.row}>
      <AlertIcon name="close-circle" color="red" colorStep="9" />
      <AlertTitle>This product is not returnable.</AlertTitle>
    </Alert>
  );
};

const AddToCartButton = ({
  productId,
  loading,
  disabled,
  onPress,
}: {
  productId: number;
  disabled?: boolean;
  loading: boolean;
  onPress: () => void;
}) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  // server cart
  const isInCart = useItemExistsInCart({
    productId,
  });

  // local cart
  const isInLocalCart = useItemExistsInLocalCart({
    productId,
  });

  if ((isAuthenticated && isInCart) || (!isAuthenticated && isInLocalCart)) {
    return (
      <Link href="/cart" asChild>
        <Button fill>
          <ButtonText>View in Cart</ButtonText>
        </Button>
      </Link>
    );
  }

  return (
    <Button onPress={onPress} disabled={disabled || loading} fill>
      <Spinner colorStep="8" loading={loading} />
      {!loading && <ButtonIcon name="cart" />}
      <ButtonText>Add to Cart</ButtonText>
    </Button>
  );
};

const LoadingComponent = () => {
  const { theme } = useStyles();

  const { height: screenHeight } = useScreenDimensions();

  return (
    <View
      style={{
        flex: 1,
        gap: theme.space[16],
        paddingHorizontal: theme.space[16],
        marginTop: theme.space[8],
      }}
    >
      {/* Thumbnail */}
      <Skeleton
        style={{
          flexShrink: 1,
          height: screenHeight * 0.5,
          borderRadius: theme.radius.md,
        }}
      />
      {/* Title */}
      <Skeleton
        style={{ flexShrink: 1, height: 20, borderRadius: theme.radius.md }}
      />
      <Skeleton
        style={{ flexShrink: 1, height: 20, borderRadius: theme.radius.md }}
      />
      {/* Price */}
      <Skeleton
        style={{ width: 100, height: 40, borderRadius: theme.radius.md }}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, radius, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.insets.top + space[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[8],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  scrollContainer: {
    paddingBottom: rt.insets.bottom + 80,
  },
  carousel: {
    flex: 1,
    marginTop: space[8],
    marginHorizontal: space[16],
    backgroundColor: colors.transparent,
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
  wishlistButton: {
    position: 'absolute',
    bottom: space[12],
    right: space[28],
    boxShadow: `0 0 2 0 ${colors.neutralA3}`,
  },
  detailsContainer: {
    paddingTop: space[16],
    paddingHorizontal: space[16],
    gap: space[24],
  },
  group: {
    gap: space[12],
  },
  categoriesContainer: {
    gap: space[10],
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: space[12],
    padding: space[12],
    paddingBottom: rt.insets.bottom,
    backgroundColor: colors.background,
    boxShadow: `0 2 8 0 ${colors.neutralA3}`,
  },
  descriptionContainer: {
    gap: space[8],
  },
}));
