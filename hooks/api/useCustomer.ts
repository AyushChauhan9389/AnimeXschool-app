import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

import {
  addAddress,
  deleteAddress,
  getAddresses,
  getPaymentMethods,
} from '@/api/customerApi';
import { ADDRESSES_KEY } from '@/constants/queryKeys';
import { Address } from '@/types/user';
import { getErrorTitle } from '@/utils/formatters';

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
  });
};

export const useAddresses = () => {
  return useQuery({
    queryKey: [ADDRESSES_KEY],
    queryFn: getAddresses,
  });
};

export const useAddAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      toast.success('Address added successfully');
    },
    onError: error => {
      console.error('Error adding address', error);
      toast.error(getErrorTitle(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [ADDRESSES_KEY],
      });
    },
  });
};

export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onMutate: async ({ addressId }) => {
      queryClient.cancelQueries({
        queryKey: [ADDRESSES_KEY],
      });
      const previousAddresses = queryClient.getQueryData([ADDRESSES_KEY]) as
        | Address[]
        | undefined;
      if (!previousAddresses) {
        return;
      }
      const newAddresses = previousAddresses.filter(
        address => address.address_id !== addressId,
      );
      queryClient.setQueryData([ADDRESSES_KEY], newAddresses);

      return { previousAddresses };
    },
    onError: (error, _variables, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData([ADDRESSES_KEY], context.previousAddresses);
      }

      toast.error('Failed to delete address', {
        description: error.message,
      });
      console.error('Failed to delete address', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [ADDRESSES_KEY],
      });
    },
  });
};
