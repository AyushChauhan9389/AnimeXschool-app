import { BillingAddress, ShippingAddress } from './user';

/**
 * Product line item for create order
 */
export type ProductLineItem = {
  product_id: number;
  quantity: number;
};

type MetaData = {
  id: number;
  key: string;
  value: string;
};

export type Coupon = {
  id: number;
  code: string;
  amount: string;
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product';
  description: string;
  date_created: string;
  date_created_gmt: string;
  date_expires: string;
  date_expires_gmt: string;
  usage_count: number;
  individual_use: boolean;
  product_ids: number[];
  excluded_product_ids: number[];
  usage_limit: number;
  usage_limit_per_user: number;
  limit_usage_to_x_items: number;
  free_shipping: boolean;
  product_categories: string[];
  excluded_product_categories: string[];
  exclude_sale_items: boolean;
  minimum_amount: string;
  maximum_amount: string;
  email_restrictions: string[];
  used_by: string[];
  meta_data: MetaData[];
};

export type OrderTaxLine = {
  id: number;
  rate_code: string;
  label: string;
  compound: boolean;
  tax_total: string;
  shipping_tax_total: string;
  meta_data: any[];
};

export type OrderShippingLine = {
  id: number;
  method_title: string;
  method_id: string;
  total: string;
  total_tax: string;
  taxes: OrderTaxLine[];
  meta_data: MetaData[];
};

export type OrderFeeLine = {
  id: number;
  name: string;
  tax_class: string;
  tax_status: 'taxable' | 'none';
  total: string;
  total_tax: string;
  taxes: OrderTaxLine[];
  meta_data: MetaData[];
};

export type OrderLineItem = {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: number;
  taxes: OrderTaxLine[];
  meta_data: {
    id: number;
    key: string;
    value: string;
    display_key: string;
    display_value: string;
  }[];
  sku: string;
  price: string;
  image?: {
    id: number;
    src: string;
  };
};

export type OrderCouponLine = {
  id: number;
  code: string;
  discount: string;
  discount_tax: string;
  meta_data: MetaData[];
};

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed'
  | 'trash';

export type Order = {
  id: number;
  parent_id: number;
  number: number; // order number
  order_key: string;
  created_via: string;
  version: string;
  status: OrderStatus;
  currency: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
  customer_note: string;
  billing: BillingAddress;
  shipping: ShippingAddress;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_paid: string;
  date_paid_gmt: string;
  date_completed: string;
  date_completed_gmt: string;
  cart_hash: string;
  meta_data: any[];
  line_items: OrderLineItem[];
  tax_lines: OrderTaxLine[];
  shipping_lines: OrderShippingLine[];
  fee_lines: OrderFeeLine[];
  coupon_lines: OrderCouponLine[];
  refunds: {
    id: number;
    reason: string;
    total: string;
  }[];
  currency_symbol: string;
  currency_code: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
};

export type RazorpayOrder = {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  amount_paid: number;
  amount_due: number;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: [];
  created_at: number;
};

export type OrderRefund = {
  id: string;
  orderId: string;
  reason: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
};
