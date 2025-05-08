import { api } from '.';
import {
  ProductLineItem,
  Order,
  RazorpayOrder,
  OrderRefund,
} from '@/types/order';

export const getOrderEstimateDeliveryDate = async ({
  orderId,
}: {
  orderId: number;
}) => {
  const { data } = await api.get(`/shipping/shipestimate/${orderId}`);
  return data as {
    success: boolean;
    data: {
      orderId: string;
      estimatedDeliveryDays: number;
      estimatedDeliveryDate: string;
      courierName: string;
    };
    message: string;
  };
};

type CreateOrderParams = {
  address_id: string;
  line_items: ProductLineItem[];
  payment_method: string;
  /**
   * Array of coupon codes
   */
  coupon_lines: string[];
};
export const createOrder = async ({
  address_id,
  line_items,
  payment_method,
  coupon_lines,
}: CreateOrderParams) => {
  const { data } = await api.post('/payment/orders/create', {
    address_id,
    line_items,
    payment_method,
    coupon_lines,
  });
  return data as {
    wooCommerceOrder: Order;
    // TODO: Find other way to handle this
    razorpayOrder?: RazorpayOrder;
  };
};

export const getOrders = async () => {
  const { data } = await api.get('/customers/orders');
  return data as Order[];
};

export const getOrder = async ({ orderId }: { orderId: number }) => {
  const { data } = await api.get(`/customers/orders/${orderId}`);
  return data as Order;
};

export const cancelOrder = async ({ orderId }: { orderId: number }) => {
  const { data } = await api.put(`/customers/orders/${orderId}/cancel`);
  return data as Order;
};

export const createRefundRequest = async ({
  orderId,
  reason,
}: {
  orderId: string;
  reason: string;
}) => {
  const { data } = await api.post(`/refunds`, {
    orderId,
    reason,
  });
  return data as OrderRefund;
};

export const getRefundRequests = async () => {
  const { data } = await api.get('/refunds');
  return data as OrderRefund[];
};

export const getRefundRequest = async ({ refundId }: { refundId: number }) => {
  const { data } = await api.get(`/refunds/${refundId}`);
  return data as OrderRefund;
};
