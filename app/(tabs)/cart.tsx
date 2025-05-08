import { useEffect } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { Button, ButtonText } from '@/components/ui/Button';
import { CartListSkeleton } from '@/components/features/cart/CartListSkeleton';
import { useCart, useSyncCartWithServer } from '@/hooks/api/useCart';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { CartList } from '@/components/features/cart/CartList';
import { useAuthStore } from '@/stores/authStore';
import { useLocalCartStore } from '@/stores/useLocalCartStore';
import { LocalCartList } from '@/components/features/cart/LocalCartList';
import { Spinner } from '@/components/ui/Spinner';
import { RS } from '@/constants/currency';
import { formatRupee } from '@/utils/formatters';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { useIsMutating } from '@tanstack/react-query';
import {
  REMOVE_CART_ITEM_KEY,
  UPDATE_CART_ITEM_QUANTITY_KEY,
} from '@/constants/queryKeys';

export default function Tab() {
  const { styles } = useStyles(stylesheet);

  const { isAuthenticated, isAuthenticating } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isAuthenticating: state.isAuthenticating,
  }));

  const isSyncing = useSyncCartWithServer();

  useEffect(() => {
    // clear checkout store (if any)
    useCheckoutStore.getState().clear();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headingMd" highContrast>
          Cart
        </Text>
      </View>

      {isSyncing && (
        <View style={styles.syncingConainer}>
          <Spinner />
          <Text>Syncing cart with server...</Text>
        </View>
      )}

      {isAuthenticating ? (
        <View style={styles.slotContainer}>
          <CartListSkeleton />
        </View>
      ) : isSyncing ? null : isAuthenticated ? (
        <ServerCart />
      ) : (
        <LocalCart />
      )}
    </View>
  );
}

const LocalCart = () => {
  const { styles } = useStyles(stylesheet);

  const cart = useLocalCartStore(state => state.cart);

  return (
    <View style={styles.slotContainer}>
      <LocalCartList data={cart.items} />
      {cart.items.length ? (
        <View style={styles.totalContainer}>
          <Link
            href={{
              pathname: '/login-with-otp',
              params: {
                returnTo: '/cart',
              },
            }}
            asChild
          >
            <Button fill>
              <ButtonText>Sign in to Checkout</ButtonText>
            </Button>
          </Link>
        </View>
      ) : null}
    </View>
  );
};

const ServerCart = () => {
  const { styles } = useStyles(stylesheet);

  const { cart, refetch, isRefetching, isLoading, error } = useCart();

  const isCartItemUpdating = useIsMutating({
    mutationKey: [UPDATE_CART_ITEM_QUANTITY_KEY],
  });
  const isCartItemRemoving = useIsMutating({
    mutationKey: [REMOVE_CART_ITEM_KEY],
  });

  const isCartUpdating =
    isCartItemUpdating || isCartItemRemoving || isRefetching;

  const total = parseFloat(cart?.totals.total || '') / 100; // convert from paise to rupee

  return (
    <View style={styles.slotContainer}>
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        LoadingComponent={CartListSkeleton}
        onRetry={refetch}
      >
        <CartList
          data={cart?.items || []}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      </AsyncBoundary>
      {cart?.items.length ? (
        <View style={styles.totalContainer}>
          <View>
            <Text variant="bodySm">Total</Text>
            <View style={styles.rowAlignCenter}>
              {isCartUpdating ? (
                <Skeleton style={{ width: 100, height: 22 }} />
              ) : (
                <Text variant="labelMd" highContrast>
                  {RS}
                  {formatRupee(total.toFixed(2))}
                </Text>
              )}
            </View>
          </View>
          <Link href={'/checkout'} asChild>
            <Button fill>
              <ButtonText>Checkout</ButtonText>
            </Button>
          </Link>
        </View>
      ) : null}
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.insets.top + space[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space[12],
    paddingHorizontal: space[16],
  },
  slotContainer: {
    flex: 1,
    paddingTop: space[12],
    paddingHorizontal: space[16],
  },
  syncingConainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: space[16],
  },
  totalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    boxShadow: `0 -2 12 2 ${colors.neutralA3}`,
    paddingHorizontal: space[16],
    paddingVertical: space[12],
    backgroundColor: colors.background,
    flexDirection: 'row',
    gap: space[16],
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
}));
