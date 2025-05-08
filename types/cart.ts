import { ProductType } from './product';

export type DiscountMethod = 'points' | 'coupons';

// NOTE: Update `any` type if you got to know the structure from the API response
export type Cart = {
  cart_hash: string;
  cart_key: string;
  currency: Currency;
  customer: Customer;
  items: CartItem[];
  item_count: number;
  items_weight: string;
  coupons: any[];
  needs_payment: boolean;
  needs_shipping: boolean;
  shipping: Shipping;
  fees: any[];
  taxes: any[];
  totals: Totals;
  removed_items: any[];
  cross_sells: any[];
  notices: any[];
};

export type Currency = {
  currency_code: string;
  currency_symbol: string;
  currency_symbol_pos: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
};

export type Customer = {
  billing_address: BillingAddress;
  shipping_address: ShippingAddress;
};

export type BillingAddress = {
  billing_first_name: string;
  billing_last_name: string;
  billing_country: string;
  billing_address_1: string;
  billing_address_2: string;
  billing_city: string;
  billing_state: string;
  billing_postcode: string;
  billing_phone: string;
  billing_email: string;
  thmaf_hidden_field_billing: string;
  thmaf_checkbox_shipping: string;
};

export type ShippingAddress = {
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_country: string;
  shipping_address_1: string;
  shipping_address_2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postcode: string;
  thmaf_hidden_field_shipping: string;
};

export type Shipping = {
  total_packages: number;
  show_package_details: boolean;
  has_calculated_shipping: boolean;
  packages: any[];
};

export type Totals = {
  subtotal: string;
  subtotal_tax: string;
  fee_total: string;
  fee_tax: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  total: string;
  total_tax: string;
};

export type CartItem = {
  item_key: string;
  id: number;
  name: string;
  title: string;
  price: string;
  quantity: {
    value: number;
    min_purchase: number;
    max_purchase: number;
  };
  totals: {
    subtotal: string;
    subtotal_tax: number;
    total: number;
    tax: number;
  };
  slug: string;
  meta: {
    product_type: ProductType;
    sku: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
      unit: string;
    };
    weight: string;
    variation: any[] | Record<string, string>;
    parent_id: number;
  };
  backorders: string;
  cart_item_data: any[];
  featured_image: string;
};
