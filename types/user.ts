export type Address = {
  address_id: string;
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
};

export type AddressWithoutId = Omit<Address, 'address_id'>;

export type BillingAddress = {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
};

export type ShippingAddress = {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
};

export type CustomerData = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  username: string;
  avatar_url: string;
  billing: BillingAddress;
  shipping: ShippingAddress;
  is_paying_customer: boolean;
};

export type User = {
  id: number;
  name: string;
  description: string;
  slug: string;
  avatar_urls: {
    24: string;
    48: string;
    96: string;
  };
  customerData: CustomerData;
};

// these are the payment methods type, which comes from the backend
export type PaymentMethodType = {
  id: string;
  description: string;
  enabled: boolean;
};

export type PaymentMethodsType = PaymentMethodType[];
