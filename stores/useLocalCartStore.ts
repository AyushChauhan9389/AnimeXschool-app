import { createWithEqualityFn as create } from 'zustand/traditional';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from 'sonner-native';

import { uuid } from '@/utils/uuid';
import { Cart, CartItem } from '@/types/cart';
import { Product, ProductVariation } from '@/types/product';

export type LocalCartItem = CartItem & {
  product_id: number;
};

export type LocalCart = Omit<Cart, 'items'> & {
  items: LocalCartItem[];
};

export type LocalCartStore = {
  /**
   * Only these properties are up to date:
   * - `items` - Array of cart items
   * - `item_count` - Number of items in cart
   */
  cart: LocalCart;
  setCart: (cart: LocalCart) => void;
  clearCart: () => void;
  addItem: (item: LocalCartItem) => void;
  removeItem: (itemKey: string) => void;
  updateItemQuantity: (itemKey: string, quantity: number) => void;
};

export const useLocalCartStore = create<LocalCartStore>()(
  persist(
    (set, get) => ({
      cart: createEmptyLocalCart(),
      addItem: (item: LocalCartItem) => {
        try {
          const currentCart = get().cart;

          const existingItem = currentCart.items.find(
            i => i.product_id === item.product_id,
          );
          // if item already exists, update its quantity
          if (existingItem) {
            const newItems = currentCart.items.map(i =>
              i.product_id === item.product_id
                ? {
                    ...i,
                    quantity: {
                      ...i.quantity,
                      value: i.quantity.value + 1,
                    },
                  }
                : i,
            );
            set({
              cart: {
                ...currentCart,
                items: newItems,
                item_count: getItemsCount(newItems),
              },
            });
          } else {
            const newItems = [...currentCart.items, item];
            set({
              cart: {
                ...currentCart,
                items: newItems,
                item_count: getItemsCount(newItems),
              },
            });
          }
          toast.success('Item added to cart');
        } catch (error: any) {
          toast.error('Failed to add item to cart', {
            description: error?.message || 'Something went wrong',
          });
          console.error('Error adding item:', error);
        }
      },
      updateItemQuantity: (itemKey: string, quantity: number) => {
        const currentCart = get().cart;

        const newItems = currentCart.items.map(i =>
          i.item_key === itemKey
            ? {
                ...i,
                quantity: {
                  ...i.quantity,
                  value: quantity,
                },
              }
            : i,
        );
        set({
          cart: {
            ...currentCart,
            items: newItems,
            item_count: getItemsCount(newItems),
          },
        });
      },
      removeItem: (itemKey: string) => {
        const currentCart = get().cart;

        const newItems = currentCart.items.filter(i => i.item_key !== itemKey);
        set({
          cart: {
            ...currentCart,
            items: newItems,
            item_count: getItemsCount(newItems),
          },
        });
      },
      setCart: (cart: LocalCart) => set({ cart }),
      clearCart: () => set({ cart: createEmptyLocalCart() }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const useItemExistsInLocalCart = ({
  productId,
}: {
  productId: number;
}) => {
  const cart = useLocalCartStore(state => state.cart);

  return cart.items.findIndex(i => i.product_id === productId) > -1;
};

export const useLocalCartItemsCount = () => {
  const cart = useLocalCartStore(state => state.cart);

  return getItemsCount(cart.items);
};

function getItemsCount(items: LocalCartItem[]) {
  return items.reduce((acc, i) => acc + i.quantity.value, 0);
}

export function createEmptyLocalCart(): LocalCart {
  return {
    cart_hash: '',
    cart_key: uuid(),
    currency: {
      currency_code: 'INR',
      currency_symbol: '₹',
      currency_symbol_pos: 'currency_prefix',
      currency_minor_unit: 2,
      currency_decimal_separator: '.',
      currency_thousand_separator: ',',
      currency_prefix: '₹',
      currency_suffix: '',
    },
    customer: {
      billing_address: {
        billing_first_name: '',
        billing_last_name: '',
        billing_country: '',
        billing_address_1: '',
        billing_address_2: '',
        billing_city: '',
        billing_state: '',
        billing_postcode: '',
        billing_phone: '',
        billing_email: '',
        thmaf_hidden_field_billing: '',
        thmaf_checkbox_shipping: '',
      },
      shipping_address: {
        shipping_first_name: '',
        shipping_last_name: '',
        shipping_country: '',
        shipping_address_1: '',
        shipping_address_2: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postcode: '',
        thmaf_hidden_field_shipping: '',
      },
    },
    items: [],
    item_count: 0,
    items_weight: '',
    coupons: [],
    needs_payment: false,
    needs_shipping: false,
    shipping: {
      has_calculated_shipping: false,
      show_package_details: false,
      total_packages: 0,
      packages: [],
    },
    fees: [],
    taxes: [],
    totals: {
      discount_tax: '',
      discount_total: '',
      shipping_tax: '',
      shipping_total: '',
      subtotal: '',
      subtotal_tax: '',
      fee_tax: '',
      fee_total: '',
      total: '',
      total_tax: '',
    },
    removed_items: [],
    cross_sells: [],
    notices: [],
  };
}

export function createLocalCartItem(
  product: Product,
  selectedVariation?: ProductVariation | null,
): LocalCartItem {
  const parent_id = product.id;
  const productId = selectedVariation ? selectedVariation.id : product.id;

  // mimic cart item variation object
  const variation: Record<string, string> = {};

  if (selectedVariation) {
    for (const attribute of selectedVariation.attributes) {
      variation[attribute.name] = attribute.option;
    }
  }
  return {
    product_id: productId,
    item_key: uuid(),
    id: product.id,
    name: product.name,
    title: product.name,
    price: `${Number(product.price) * 100}`, // convert price from rupee to paise
    featured_image: product.images[0]?.src,
    quantity: {
      value: 1,
      max_purchase: product?.stock_quantity ?? -1,
      min_purchase: 1,
    },
    backorders: '',
    cart_item_data: [],
    meta: {
      parent_id,
      product_type: product.type,
      dimensions: {
        ...product.dimensions,
        unit: '',
      },
      sku: product.sku,
      variation: selectedVariation ? variation : [],
      weight: product.weight,
    },
    slug: product.slug,
    totals: {
      subtotal: '',
      subtotal_tax: 0,
      total: 0,
      tax: 0,
    },
  };
}
