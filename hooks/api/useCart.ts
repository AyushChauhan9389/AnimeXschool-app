import { useEffect, useMemo, useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryObserver,
} from '@tanstack/react-query';
import { toast } from 'sonner-native';
import {
  getCart,
  addToCartItem,
  updateCartItemQuantity,
  removeCartItem,
  AddToCartItemParams,
  clearCart,
} from '@/api/cartApi';
import { Cart } from '@/types/cart';
import { useAuthStore } from '@/stores/authStore';
import { useLocalCartStore } from '@/stores/useLocalCartStore';
import {
  CART_KEY,
  REMOVE_CART_ITEM_KEY,
  UPDATE_CART_ITEM_QUANTITY_KEY,
} from '@/constants/queryKeys';

export const useCart = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const {
    data: cartData,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery<Cart>({
    queryKey: [CART_KEY],
    queryFn: getCart,
    enabled: isAuthenticated,
  });

  return {
    cart: cartData,
    refetch,
    isLoading,
    isRefetching,
    error,
  };
};

export const useAddToCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCartItem,
    onSuccess: data => {
      queryClient.setQueryData([CART_KEY], data);
      toast.success('Item added to cart');
    },
    onError: error => {
      toast.error('Failed to add item to cart', {
        description: error.message,
      });
      console.error('Error adding item:', error);
    },
  });
};

export const useUpdateCartItemQuantityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [UPDATE_CART_ITEM_QUANTITY_KEY],
    mutationFn: updateCartItemQuantity,
    onMutate: async variables => {
      const { itemKey, quantity } = variables;
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [CART_KEY] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData([CART_KEY]);

      // if no cart, return
      if (!previousCart) {
        return;
      }
      // Optimistically update to the new value
      queryClient.setQueryData([CART_KEY], (oldCart: Cart) => {
        const newItems = oldCart.items.map(item => {
          if (item.item_key === itemKey) {
            return {
              ...item,
              quantity: {
                ...item.quantity,
                value: Number(quantity),
              },
            };
          }
          return item;
        });
        const newItemCount = getItemCount(newItems);
        const newSubtotal = getSubTotal(newItems);
        return {
          ...oldCart,
          items: newItems,
          item_count: newItemCount,
          totals: {
            ...oldCart.totals,
            subtotal: newSubtotal,
          },
        };
      });

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (error, _variables, context) => {
      // set the previous cart value returned from onMutate
      if (context?.previousCart) {
        queryClient.setQueryData([CART_KEY], context.previousCart);
      }

      toast.error('Failed to update item quantity', {
        description: error.message,
      });
      console.error('Error updating item quantity:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [CART_KEY],
      });
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [REMOVE_CART_ITEM_KEY],
    mutationFn: removeCartItem,
    onMutate: async variables => {
      const { itemKey } = variables;
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [CART_KEY] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData([CART_KEY]);

      // if no cart, return
      if (!previousCart) {
        return;
      }

      // Optimistically update to the new value
      queryClient.setQueryData([CART_KEY], (oldCart: Cart) => {
        const newItems = oldCart.items.filter(
          item => item.item_key !== itemKey,
        );
        const newItemCount = getItemCount(newItems);
        const newSubtotal = getSubTotal(newItems);
        return {
          ...oldCart,
          items: newItems,
          item_count: newItemCount,
          totals: {
            ...oldCart.totals,
            subtotal: newSubtotal,
          },
        };
      });

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (error, _variables, context) => {
      // set the previous cart value returned from onMutate
      if (context?.previousCart) {
        queryClient.setQueryData([CART_KEY], context.previousCart);
      }
      toast.error('Failed to remove item from cart', {
        description: error.message,
      });
      console.error('Error removing item:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [CART_KEY],
      });
    },
  });
};

const clearLocalCart = useLocalCartStore.getState().clearCart;

export const useSyncCartWithServer = () => {
  const queryClient = useQueryClient();

  const [isSyncing, setIsSyncing] = useState(false);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const localCartItems = useLocalCartStore(state => state.cart.items);

  const addToCartItemMutation = useAddToCartItemMutation();

  useEffect(() => {
    if (isAuthenticated && !isSyncing) {
      // check if local cart has any items
      if (localCartItems.length > 0) {
        setIsSyncing(true);
        // prepare payload data
        const data: AddToCartItemParams['products'] = localCartItems.map(
          item => ({
            product_id: String(item.product_id),
            quantity: String(item.quantity.value),
          }),
        );

        addToCartItemMutation.mutate(
          {
            products: data,
          },
          {
            onSuccess: data => {
              clearLocalCart();
              queryClient.invalidateQueries({
                queryKey: [CART_KEY],
              });
              toast.success('Cart synced with server');
            },
            onError: error => {
              toast.error('Failed to sync cart with server', {
                description: error.message,
              });
              console.error('Error syncing cart with server:', error);
            },
            onSettled: () => {
              setIsSyncing(false);
            },
          },
        );
      }
    }
  }, [
    isAuthenticated,
    addToCartItemMutation,
    isSyncing,
    localCartItems,
    queryClient,
  ]);

  return isSyncing;
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [CART_KEY] });

      // Snapshot the previous value
      const previousCart = queryClient.getQueryData([CART_KEY]);

      // if no cart, return
      if (!previousCart) {
        return;
      }
      // Optimistically update to the new value
      queryClient.setQueryData([CART_KEY], (oldCart: Cart) => ({
        ...oldCart,
        items: [],
        item_count: 0,
        totals: {
          subtotal: '',
          subtotal_tax: '',
          fee_total: '',
          fee_tax: '',
          discount_total: '',
          discount_tax: '',
          shipping_total: '',
          shipping_tax: '',
          total: '',
          total_tax: '',
        },
      }));

      // Return a context object with the snapshotted value
      return { previousCart };
    },
    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData([CART_KEY], context?.previousCart);
      }

      console.error('Error clearing cart:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [CART_KEY],
      });
    },
  });
};

/**
 * Check if the given product is in the cart
 * @note Do not use this directly in the big component.
 *       It will cause your component to re-render on
 *       every change in the cart.
 */
export const useItemExistsInCart = ({ productId }: { productId: number }) => {
  const queryClient = useQueryClient();

  const [isInCart, setIsInCart] = useState(false);

  const observer = useMemo(() => {
    return new QueryObserver(queryClient, {
      queryKey: [CART_KEY],
    });
  }, [queryClient]);

  useEffect(() => {
    const unsubscribe = observer.subscribe(result => {
      const cart = result.data as Cart | undefined;
      if (cart && productId) {
        const index = cart.items.findIndex(item => item.id === productId);
        if (index === -1) {
          setIsInCart(false);
        } else {
          setIsInCart(true);
        }
      }
    });

    return unsubscribe;
  }, [observer, productId]);

  return isInCart;
};

export const useCartItemsCount = () => {
  const { cart } = useCart();

  const items = cart?.items || [];

  return getItemCount(items);
};

function getItemCount(itmes: Cart['items']) {
  return itmes.reduce((acc, item) => {
    return acc + item.quantity.value;
  }, 0);
}

/**
 * It is not reliable, but it gives a good approximation
 */
function getSubTotal(itmes: Cart['items']) {
  const total = itmes.reduce((acc, item) => {
    return acc + item.quantity.value * parseFloat(item.price);
  }, 0);

  return total.toFixed(2);
}
