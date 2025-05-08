import { api } from '.';
import { Cart } from '@/types/cart';

export type AddToCartItemParams = {
  products: {
    product_id: string;
    quantity: string;
  }[];
};
export const addToCartItem = async ({ products }: AddToCartItemParams) => {
  const response = await api.post('/customers/cart/add-item', products);

  const data = response.data as [
    | {
        status: 'success';
        data: Cart;
      }
    | {
        status: 'error';
        message: {
          code: string;
          message: string;
        };
      },
  ];

  // return the last updated cart
  const cart = data.findLast(item => item.status === 'success')?.data;

  if (!cart) {
    throw new Error(
      data.findLast(item => item.status === 'error')?.message.message,
    );
  }
  return cart;
};

export const updateCartItemQuantity = async ({
  itemKey,
  quantity,
}: {
  itemKey: string;
  quantity: string;
}) => {
  const { data } = await api.post(`/customers/cart/item/${itemKey}`, {
    quantity,
  });
  return data as Cart;
};

export const removeCartItem = async ({ itemKey }: { itemKey: string }) => {
  const { data } = await api.delete(`/customers/cart/remove/${itemKey}`);
  return data;
};

export const getCart = async () => {
  const { data } = await api.get('/customers/cart');
  return data as Cart;
};

export const clearCart = async () => {
  const { data } = await api.post('/customers/cart/clear');
  return data as Cart;
};
