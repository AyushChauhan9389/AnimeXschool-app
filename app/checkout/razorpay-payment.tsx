import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { Redirect, useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useCheckoutStore } from '@/stores/checkoutStore';
import { generateRazorpayOptions } from '@/utils/order';
import { useAuthStore } from '@/stores/authStore';
import { Spinner } from '@/components/ui/Spinner';
import { Text } from '@/components/ui/Text';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/Alert';
import { Button, ButtonText } from '@/components/ui/Button';

export default function RazorpayPaymentScreen() {
  const router = useRouter();

  const { styles } = useStyles(stylesheet);

  const { user } = useAuthStore();
  const { order, razorpayOrder, clear } = useCheckoutStore();

  // store a copy of the orderId, which will be used to redirect to the order page
  const orderId = order?.id;

  const [status, setStatus] = useState<{ loading: boolean; error: any }>({
    loading: false,
    error: null,
  });

  const razorpayOptions = useMemo(() => {
    if (!razorpayOrder || !user || !order) return null;
    return generateRazorpayOptions({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      billing: order.billing,
      items: order.line_items,
    });
  }, [order, razorpayOrder, user]);

  const handleRazorpayCheckout = useCallback(async () => {
    if (!razorpayOptions) {
      setStatus({
        loading: false,
        error: new Error('Razorpay options not found'),
      });
      return;
    }

    try {
      setStatus(prev => ({ ...prev, loading: true }));
      await RazorpayCheckout.open(razorpayOptions);
      // Payment success!
      clear(); // clear checkout store
      if (orderId) {
        router.replace({
          pathname: '/checkout/success',
          params: {
            orderId: `${orderId}`,
          },
        });
      } else {
        toast.success('Payment successful', {
          description: 'Your order has been placed successfully',
        });
        router.replace('/orders');
      }
    } catch (error) {
      console.error('Razorpay error', error);
      setStatus(prev => ({ ...prev, error: (error as any)?.error }));
      toast.error('We are having an issue with processing your payment');
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  }, [razorpayOptions, router, clear, orderId]);

  const handleViewOrder = useCallback(() => {
    clear(); // clear checkout store
    if (orderId) {
      router.replace({
        pathname: '/orders/[id]',
        params: {
          id: `${orderId}`,
        },
      });
    } else {
      router.replace('/orders');
    }
  }, [clear, router, orderId]);

  useEffect(() => {
    // initialize razorpay checkout
    handleRazorpayCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!order) {
    return <Redirect href={'/checkout/payment'} />;
  }

  return (
    <View style={styles.container}>
      <Text variant="headingSm" highContrast>
        Order #{order.number}
      </Text>
      {status.loading && (
        <View style={styles.loadingContainer}>
          <Spinner />
          <Text>Please wait, processing payment...</Text>
        </View>
      )}
      {!status.loading && status.error && (
        <>
          <Alert color="red">
            <View style={styles.alert}>
              <AlertIcon name="sad-outline" />
              <AlertTitle style={{ flex: 1 }}>
                {status.error?.description === 'undefined' ||
                !status.error?.description
                  ? 'We are having an issue with processing your payment'
                  : status.error.description}
              </AlertTitle>
            </View>
            <Button disabled={status.loading} onPress={handleRazorpayCheckout}>
              <ButtonText>Try Payment Again</ButtonText>
            </Button>
          </Alert>
        </>
      )}
      {!status.loading && (
        <Button variant="outline" onPress={handleViewOrder}>
          <ButtonText>View Order</ButtonText>
        </Button>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: rt.insets.top,
    paddingBottom: rt.insets.bottom,
    paddingHorizontal: space[16],
    gap: space[24],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[16],
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
}));
