import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

import {
  cancelOrder,
  createOrder,
  createRefundRequest,
  getOrder,
  getOrderEstimateDeliveryDate,
  getOrders,
  getRefundRequest,
  getRefundRequests,
} from '@/api/orderApi';
import { useClearCartMutation } from './useCart';
import { ORDERS_KEY, REFUND_REQUESTS_KEY } from '@/constants/queryKeys';

export const useOrders = () => {
  return useQuery({
    queryKey: [ORDERS_KEY],
    queryFn: getOrders,
  });
};

export const useOrder = (orderId: number) => {
  return useQuery({
    queryKey: [ORDERS_KEY, `${orderId}`],
    queryFn: () => getOrder({ orderId }),
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  const clearCartMutation = useClearCartMutation();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // clear cart
      clearCartMutation.mutate();

      toast.success('Order created successfully');
    },
    onError: error => {
      toast.error('Failed to create order', {
        description: error.message,
      });
      console.error('Failed to create order', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [ORDERS_KEY],
      });
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: updatedOrder => {
      // update order
      queryClient.setQueryData([ORDERS_KEY, updatedOrder.id], updatedOrder);
      toast.success('Order cancelled successfully');
    },
    onError: error => {
      toast.error('Failed to cancel order', {
        description: error.message,
      });
      console.error('Failed to cancel order', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [ORDERS_KEY],
      });
    },
  });
};

export const useOrderEstimateDeliveryDate = (orderId: number) => {
  return useQuery({
    queryKey: ['order-estimate-delivery-date', orderId],
    queryFn: () => getOrderEstimateDeliveryDate({ orderId }),
    enabled: !!orderId,
  });
};

export const useCreateRefundRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRefundRequest,
    onSuccess: () => {
      toast.success('Refund request created successfully');
    },
    onError: error => {
      toast.error('Failed to create refund request', {
        description: error.message,
      });
      console.error(
        'Failed to create refund request',
        (error as any)?.response,
      );
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [ORDERS_KEY, variables.orderId],
      });
      queryClient.invalidateQueries({
        queryKey: [ORDERS_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [REFUND_REQUESTS_KEY],
      });
    },
  });
};

export const useRefundRequests = () => {
  return useQuery({
    queryKey: [REFUND_REQUESTS_KEY],
    queryFn: getRefundRequests,
  });
};

export const useRefundRequest = (refundId: number) => {
  return useQuery({
    queryKey: ['refund-request', refundId],
    queryFn: () => getRefundRequest({ refundId }),
  });
};
