import { useCallback, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Href, useRouter } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import { useAuthStore } from '@/stores/authStore';
import { Button, ButtonText } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { PaymentMethods } from '@/components/features/checkout/PaymentMethods';
import {
  Address,
  PaymentMethodsType,
  PaymentMethodType,
  User,
} from '@/types/user';
import { useCart } from '@/hooks/api/useCart';
import { OrderSummary } from '@/components/features/checkout/OrderSummary';
import { Separator } from '@/components/ui/Separator';
import { Cart, DiscountMethod } from '@/types/cart';
import { PaymentSummary } from '@/components/features/checkout/PaymentSummary';
import { Coupon, ProductLineItem } from '@/types/order';
import { useCreateOrderMutation } from '@/hooks/api/useOrders';
import { Spinner } from '@/components/ui/Spinner';
import { ApplyDiscount } from '@/components/features/checkout/ApplyDiscount';
import { useCheckoutStore } from '@/stores/checkoutStore';
import { toast } from 'sonner-native';
import { useAddresses } from '@/hooks/api/useCustomer';
import { SelectAddress } from '@/components/features/checkout/SelectAddress';

const PAYMENT_METHODS: PaymentMethodType[] = [
  {
    id: 'razorpay',
    enabled: true,
    description: 'Pay with Razorpay',
  },
  {
    id: 'cod',
    enabled: true,
    description: 'Pay with cash upon delivery',
  },
];

export default function PaymentScreen() {
  const { styles } = useStyles(stylesheet);

  const user = useAuthStore(state => state.user);

  const cartQuery = useCart();
  const addressesQuery = useAddresses();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text variant="labelLg" highContrast>
          Payment
        </Text>
      </View>
      <View style={styles.slot}>
        <AsyncBoundary
          isLoading={addressesQuery.isLoading || addressesQuery.isRefetching}
          error={addressesQuery.error}
          onRetry={addressesQuery.refetch}
          isRetrying={addressesQuery.isRefetching}
          LoadingComponent={LoadingComponent}
        >
          <AsyncBoundary
            isLoading={cartQuery.isLoading || cartQuery.isRefetching}
            error={cartQuery.error}
            onRetry={cartQuery.refetch}
            isRetrying={cartQuery.isRefetching}
            LoadingComponent={LoadingComponent}
          >
            {cartQuery.cart && user && addressesQuery.data && (
              <SecurePaymentComponent
                user={user}
                addresses={addressesQuery.data}
                cart={cartQuery.cart}
                // Use local payment methods for now
                paymentMethods={PAYMENT_METHODS}
              />
            )}
          </AsyncBoundary>
        </AsyncBoundary>
      </View>
    </View>
  );
}

const THIS_SCREEN_ROUTE: Href = '/checkout/payment';

const SecurePaymentComponent = ({
  user,
  addresses,
  cart,
  paymentMethods,
}: {
  user: User;
  cart: Cart;
  paymentMethods: PaymentMethodsType;
  addresses: Address[];
}) => {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();

  const { totals } = cart;
  const total = totals.total; // in Paise

  const lineItems: ProductLineItem[] = cart.items.map(item => ({
    product_id: item.id,
    quantity: item.quantity.value,
  }));

  const [selectedAddress, setSelectedAddress] = useState<Address>(
    addresses[addresses.length - 1],
  );

  const [discountedTotal, setDiscountedTotal] = useState(total); // in Paise
  const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);
  const [discountMethod, setDiscountMethod] =
    useState<DiscountMethod>('coupons');
  const [usedPoints, setUsedPoints] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(
    paymentMethods[0],
  );

  const handleAddNewAddress = useCallback(() => {
    router.push({
      pathname: '/user/addresses/add',
      params: {
        returnTo: THIS_SCREEN_ROUTE,
      },
    });
  }, [router]);

  const handleDiscountedTotalChange = useCallback(
    ({
      discountMethod,
      discountedTotal,
      coupons,
      points,
    }: {
      discountMethod: DiscountMethod;
      discountedTotal: string;
      coupons: Coupon[];
      points: number;
    }) => {
      setDiscountMethod(discountMethod);
      setUsedPoints(points);
      setDiscountedTotal(discountedTotal);
      setAppliedCoupons(coupons);
    },
    [],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Order Summary */}
      <View style={styles.group}>
        <Text variant="labelMd" highContrast>
          Order Summary
        </Text>
        <OrderSummary cart={cart} />
      </View>

      <Separator />

      {/* Select Address */}
      <View style={styles.group}>
        <View style={styles.rowBetween}>
          <Text variant="labelMd" highContrast>
            Select Address
          </Text>
          <Pressable onPress={handleAddNewAddress}>
            <Text color="blue">Add new address</Text>
          </Pressable>
        </View>
        <SelectAddress
          data={addresses}
          address={selectedAddress}
          onAddressChange={setSelectedAddress}
        />
      </View>

      <Separator />

      {/* Apply Discount */}
      <ApplyDiscount
        discountMethod={discountMethod}
        total={total}
        discountedTotal={discountedTotal}
        onDiscountedTotalChange={handleDiscountedTotalChange}
      />

      <Separator />

      <PaymentSummary
        discountMethod={discountMethod}
        total={total}
        totalPayable={discountedTotal}
        appliedCoupons={appliedCoupons}
        usedPoints={usedPoints}
      />

      <Separator />

      {/* Payment Method */}
      <View style={styles.group}>
        <Text variant="labelMd" highContrast>
          Payment Method
        </Text>
        <PaymentMethods
          data={paymentMethods}
          value={paymentMethod}
          onValueChange={setPaymentMethod}
        />
      </View>

      <Separator />

      <PlaceOrderComponent
        selectedAddress={selectedAddress}
        lineItems={lineItems}
        paymentMethod={paymentMethod}
        appliedCoupons={appliedCoupons}
      />
    </ScrollView>
  );
};

const PlaceOrderComponent = ({
  selectedAddress,
  lineItems,
  paymentMethod,
  appliedCoupons,
}: {
  selectedAddress: Address;
  lineItems: ProductLineItem[];
  paymentMethod: PaymentMethodType;
  appliedCoupons: Coupon[];
}) => {
  const router = useRouter();

  const createOrderMutation = useCreateOrderMutation();

  const checkoutStore = useCheckoutStore();

  const couponLines = appliedCoupons.map(coupon => coupon.code);

  const redirectToSuccess = useCallback(
    (orderId: number) => {
      router.replace({
        pathname: '/checkout/success',
        params: {
          orderId,
        },
      });
    },
    [router],
  );

  const handleCODOrder = useCallback(() => {
    const paymentMethodId = 'cod';
    createOrderMutation.mutate(
      {
        address_id: selectedAddress.address_id,
        line_items: lineItems,
        payment_method: paymentMethodId,
        coupon_lines: couponLines,
      },
      {
        onSuccess: data => {
          redirectToSuccess(data.wooCommerceOrder.id);
        },
      },
    );
  }, [
    couponLines,
    createOrderMutation,
    lineItems,
    redirectToSuccess,
    selectedAddress.address_id,
  ]);

  const handleRazorpayOrder = useCallback(() => {
    createOrderMutation.mutate(
      {
        address_id: selectedAddress.address_id,
        line_items: lineItems,
        payment_method: 'razorpay',
        coupon_lines: couponLines,
      },
      {
        onSuccess: data => {
          checkoutStore.setOrder(data.wooCommerceOrder);
          if (data?.razorpayOrder?.id) {
            checkoutStore.setRazorpayOrder(data.razorpayOrder);
            router.replace('/checkout/razorpay-payment');
          } else {
            toast('We are having an issue with processing your payment');
            redirectToSuccess(data.wooCommerceOrder.id);
          }
        },
      },
    );
  }, [
    createOrderMutation,
    selectedAddress.address_id,
    lineItems,
    couponLines,
    checkoutStore,
    router,
    redirectToSuccess,
  ]);

  const handlePlaceOrder = useCallback(() => {
    const paymentMethodId = paymentMethod.id;

    if (paymentMethodId === 'cod') {
      handleCODOrder();
    } else if (paymentMethodId === 'razorpay') {
      handleRazorpayOrder();
    }
  }, [paymentMethod.id, handleCODOrder, handleRazorpayOrder]);

  return (
    <>
      <Text variant="bodySm">
        Your personal data will be used to process your order, support your
        experience throughout this app, and for other purposes described in our
        privacy policy.
      </Text>
      <Button
        size="lg"
        disabled={createOrderMutation.isPending}
        onPress={handlePlaceOrder}
      >
        <Spinner loading={createOrderMutation.isPending} colorStep="8" />
        <ButtonText>Place Order</ButtonText>
      </Button>
    </>
  );
};

const LoadingComponent = () => {
  return (
    <View style={{ gap: 16 }}>
      <Skeleton
        style={{
          width: '100%',
          height: 100,
        }}
      />
      <Skeleton
        style={{
          width: '100%',
          height: 200,
        }}
      />
      <Skeleton
        style={{
          width: '100%',
          height: 100,
        }}
      />
      <Skeleton
        style={{
          width: '100%',
          height: 200,
        }}
      />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }, rt) => ({
  container: {
    flex: 1,
    paddingTop: rt.insets.top + space[8],
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    paddingHorizontal: space[16],
    paddingBottom: space[8],
  },
  slot: {
    flex: 1,
    paddingHorizontal: space[16],
    paddingTop: space[8],
  },
  scrollContainer: {
    gap: space[24],
    paddingTop: space[8],
    paddingBottom: rt.insets.bottom + space[44],
  },
  group: {
    gap: space[12],
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[8],
  },
}));
