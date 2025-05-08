import React, { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link, useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { toast } from 'sonner-native';

import { BackButton } from '@/components/BackButton';
import { Text } from '@/components/ui/Text';
import { Order, OrderStatus } from '@/types/order';
import { Badge, BadgeText } from '@/components/ui/Badge';
import {
  generateOrderInvoiceHtml,
  getOrderStatusBadgeColor,
} from '@/utils/order';
import { Separator } from '@/components/ui/Separator';
import { ProductImage } from '@/components/features/product/ProductImage';
import { RS } from '@/constants/currency';
import { formatRupee } from '@/utils/formatters';
import { useCancelOrderMutation, useOrder } from '@/hooks/api/useOrders';
import { EmptyState, EmptyStateImage } from '@/components/EmptyState';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { EstimatedDeliveryDate } from '@/components/features/order/EstimatedDeliveryDate';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Address } from '@/types/user';

export default function OrderScreen() {
  const { styles } = useStyles(stylesheet);

  const params = useLocalSearchParams();
  const orderId = Number(params.id);

  const {
    data: order,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useOrder(orderId);

  const orderNumber = order?.number;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text variant="labelLg" highContrast>
          Order details
        </Text>
      </View>

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        isRetrying={isRefetching}
      >
        {order ? (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.slotContainer}
          >
            <View style={styles.rowBetween}>
              <View style={styles.miniGroup}>
                <Text variant="headingMd" highContrast>
                  Order #{orderNumber}
                </Text>
                <Text variant="bodySm">
                  Placed on {getOrderPlacedOnDate(order.date_created)} at{' '}
                  {getOrderPlacedOnTime(order.date_created)}
                </Text>
              </View>
              <Badge
                size="lg"
                color={getOrderStatusBadgeColor(order.status)}
                style={styles.selfCenter}
              >
                <BadgeText textTransform="capitalize">{order.status}</BadgeText>
              </Badge>
            </View>

            <EstimatedDeliveryDate orderId={orderId} />

            <Separator />

            <View style={styles.group}>
              <Text variant="labelLg" highContrast>
                Address
              </Text>
              <AddressView item={order.billing} />
            </View>

            <Separator />

            {/* Payment */}
            <View style={styles.group}>
              <Text variant="labelLg" highContrast>
                Payment
              </Text>
              <Payment order={order} />
            </View>

            <Separator />

            <View style={styles.group}>
              <Text variant="labelLg" highContrast>
                Products
              </Text>
              <LineItems items={order.line_items} />
            </View>

            <OrderCustomerNote note={order.customer_note} />

            <View style={styles.group}>
              <CancelOrderAction order={order} />
              <InvoiceAction order={order} />
              <RefundRequestAction order={order} />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.slotContainer}>
            <EmptyState>
              <EmptyStateImage
                source={require('@/assets/images/animal-pana.png')}
              />
              <Text variant="headingMd" highContrast>
                Order not found
              </Text>
              <Text variant="bodySm">
                The order you are looking for does not exist.
              </Text>
            </EmptyState>
          </View>
        )}
      </AsyncBoundary>
    </View>
  );
}

const OrderCustomerNote = ({ note }: { note?: string }) => {
  if (!note) {
    return null;
  }
  return (
    <Alert color="neutral">
      <AlertTitle>Customer Note</AlertTitle>
      <AlertDescription>{note}</AlertDescription>
    </Alert>
  );
};

const Payment = ({ order }: { order: Order }) => {
  const { styles } = useStyles(stylesheet);

  // NOTE: Amount comes in Rupee
  const discount = formatRupee(order.discount_total);
  const shipping = formatRupee(order.shipping_total);
  const total = formatRupee(order.total);
  const taxLines = order.tax_lines;

  return (
    <>
      <View style={styles.rowGroup}>
        <Text>Discount</Text>
        <Text highContrast>
          {RS}
          {discount}
        </Text>
      </View>
      <View style={styles.rowGroup}>
        <Text>Shipping</Text>
        <Text highContrast>
          {RS}
          {shipping}
        </Text>
      </View>
      {taxLines.length > 0 &&
        taxLines.map((item, i) => {
          return (
            <View key={i} style={styles.rowGroup}>
              <Text>{item.label}</Text>
              <Text highContrast>
                {RS}
                {formatRupee(item.tax_total)}
              </Text>
            </View>
          );
        })}
      <View style={styles.rowGroup}>
        <Text variant="labelMd" highContrast>
          Total
        </Text>
        <Text variant="labelMd" highContrast>
          {RS}
          {total}
        </Text>
      </View>
    </>
  );
};

const LineItems = ({ items }: { items: Order['line_items'] }) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={{ gap: 16 }}>
      {items.map((item, i) => {
        return (
          <View key={i} style={styles.lineItem}>
            <View style={[styles.lineItemInner, styles.flex]}>
              <ProductImage
                source={item?.image?.src ?? ''}
                fallbackSize={40}
                containerStyle={styles.lineItemImage}
              />
              <View style={[styles.flex, { gap: 2 }]}>
                <Text variant="bodySm" highContrast>
                  {item.name} Lorem ipsum dolor sit amet
                </Text>
                <View style={styles.variations}>
                  {item.meta_data.length > 0 &&
                    item.meta_data.map(({ display_key, display_value }, i) => {
                      return (
                        <View key={i} style={styles.variation}>
                          <Text variant="bodySm" textTransform="capitalize">
                            {display_key}:
                          </Text>
                          <Text variant="bodySm" highContrast>
                            {display_value}
                          </Text>
                        </View>
                      );
                    })}
                </View>
                <View style={styles.variation}>
                  <Text variant="bodySm" textTransform="capitalize">
                    Qty:
                  </Text>
                  <Text variant="bodySm" highContrast>
                    {item.quantity}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Text highContrast>
                {RS}
                {formatRupee(parseFloat(item.price).toFixed(2))}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const InvoiceAction = ({ order }: { order: Order }) => {
  const [isSharing, setIsSharing] = useState(false);

  const shareableStatuses: OrderStatus[] = ['completed', 'processing'];

  const handleShareInvoice = async () => {
    try {
      setIsSharing(true);
      const html = generateOrderInvoiceHtml({ order });

      // Generate temp pdf file
      const { uri: tempUri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const tempDir = tempUri.slice(0, tempUri.lastIndexOf('/'));

      // Create new filename
      const newFilename = `Invoice_${order.number}.pdf`;

      // Create new uri
      const directory = `${tempDir}/invoices/`;
      const newUri = `${directory}${newFilename}`;

      // Ensure directory exists
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

      // Move the file
      await FileSystem.moveAsync({
        from: tempUri,
        to: newUri,
      });

      // share the pdf file
      await Sharing.shareAsync(newUri, {
        dialogTitle: `Invoice #${order.number}`,
        mimeType: 'application/pdf',
        UTI: '.pdf',
      });
    } catch (error) {
      toast.error((error as any)?.message ?? 'Oops!, Something went wrong');
      console.error('Error sharing invoice', error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!shareableStatuses.includes(order.status)) {
    return null;
  }

  return (
    <Button
      color="blue"
      variant="soft"
      onPress={handleShareInvoice}
      disabled={isSharing}
    >
      <Spinner loading={isSharing} colorStep="8" />
      {!isSharing && <ButtonIcon name="share-outline" />}
      <ButtonText>Share Invoice</ButtonText>
    </Button>
  );
};

const CancelOrderAction = ({ order }: { order: Order }) => {
  const orderStatus = order.status;

  const isPrepaid = order.payment_method !== 'cod';

  const cancelableStatuses: OrderStatus[] = ['processing', 'completed'];

  const isCancelableStatus = cancelableStatuses.includes(orderStatus);

  const twoDaysElapsed =
    new Date().getTime() - new Date(order.date_created).getTime() >
    2 * 24 * 60 * 60 * 1000;

  const canRender = isCancelableStatus && twoDaysElapsed;

  const cancelOrderMutation = useCancelOrderMutation();

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate({
      orderId: order.id,
    });
  };

  if (!canRender) {
    return null;
  }

  return (
    <Button
      color="red"
      variant="outline"
      disabled={cancelOrderMutation.isPending}
      onPress={handleCancelOrder}
    >
      <Spinner loading={cancelOrderMutation.isPending} colorStep="8" />
      <ButtonText>
        {isPrepaid ? 'Cancel and Refund' : 'Cancel Order'}
      </ButtonText>
    </Button>
  );
};

const RefundRequestAction = ({ order }: { order: Order }) => {
  if (order.status !== 'completed' || order.refunds.length > 0) {
    return null;
  }
  return (
    <Link href={`/orders/${order.id}/refund-request`} asChild>
      <Button variant="soft">
        <ButtonText>Refund Request</ButtonText>
      </Button>
    </Link>
  );
};

const AddressView = ({ item }: { item: Omit<Address, 'address_id'> }) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.miniGroup}>
      <View style={styles.itemGroup}>
        <Text variant="labelSm" highContrast>
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
  );
};

function getOrderPlacedOnDate(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'short',
  }).format(new Date(date));
}

function getOrderPlacedOnTime(date: string) {
  return new Intl.DateTimeFormat('en-IN', {
    timeStyle: 'short',
  }).format(new Date(date));
}

const stylesheet = createStyleSheet(({ colors, space, radius }, rt) => ({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.statusBar.height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[12],
  },
  slotContainer: {
    paddingTop: space[24],
    paddingVertical: space[64],
    paddingHorizontal: space[20],
    gap: space[24],
  },
  miniGroup: {
    gap: space[4],
  },
  group: {
    gap: space[12],
  },
  itemGroup: {
    gap: space[1],
  },
  selfCenter: {
    alignSelf: 'center',
  },
  rowGroup: {
    flexDirection: 'row',
    gap: space[12],
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[16],
  },
  lineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space[16],
  },
  lineItemInner: {
    flexDirection: 'row',
    gap: space[16],
  },
  lineItemImage: {
    width: 60,
    height: 60,
    borderRadius: radius.sm,
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
  field: {
    gap: space[8],
  },
  dialogContent: {
    gap: space[16],
  },
}));
