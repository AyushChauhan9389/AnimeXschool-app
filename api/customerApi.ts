import { api } from '.';
import { Address, PaymentMethodsType } from '@/types/user';

export const getAddresses = async () => {
  const { data } = await api.get('/addresses');
  return data as Address[];
};

export const addAddress = async (address: Omit<Address, 'address_id'>) => {
  const { data } = await api.post('/addresses', address);
  return data;
};

export const deleteAddress = async ({ addressId }: { addressId: string }) => {
  const { data } = await api.delete(`/addresses/${addressId}`);
  return data;
};

export const getPaymentMethods = async () => {
  const { data } = await api.get(`/customers/payment-methods`);

  return data as PaymentMethodsType;
};

type UpdatePhoneNumberParams = {
  phoneNumber: string;
};
export const updatePhoneNumber = async ({
  phoneNumber,
}: UpdatePhoneNumberParams) => {
  const { data } = await api.post('/customers/updatePhone', {
    phone_number: phoneNumber,
  });

  return data;
};
