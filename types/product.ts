type ProductDimensions = {
  length: string;
  width: string;
  height: string;
};

type ProductImage = {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  src: string;
  name: string;
  alt: string;
};

type ProductMetaData = {
  id: number;
  key: string;
  value: string;
};

type ProductLink = {
  href: string;
  targetHints?: {
    allow: string[];
  };
};

type ProductLinks = {
  self: ProductLink[];
  collection: ProductLink[];
  up: ProductLink[];
};

export type ProductType = 'simple' | 'variable' | 'grouped' | 'external';

export type ProductStockStatus = 'instock' | 'outofstock' | 'onbackorder';

export type Product = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: ProductType;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[];
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: ProductDimensions;
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
  images: ProductImage[];
  attributes: {
    id: number;
    name: string;
    slug: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }[];
  default_attributes: any[];
  variations: number[];
  grouped_products: any[];
  menu_order: number;
  price_html: string;
  related_ids: number[];
  meta_data: ProductMetaData[];
  stock_status: ProductStockStatus;
  has_options: boolean;
  post_password: string;
  global_unique_id: string;
  yoast_head: string;
  yoast_head_json: {
    title: string;
    description: string;
    robots: {
      index: string;
      follow: string;
      'max-snippet': string;
      'max-image-preview': string;
      'max-video-preview': string;
    };
    canonical: string;
    og_locale: string;
    og_type: string;
    og_title: string;
    og_description: string;
    og_url: string;
    og_site_name: string;
    article_publisher: string;
    article_modified_time: string;
    og_image: {
      width: number;
      height: number;
      url: string;
      type: string;
    }[];
    twitter_card: string;
    twitter_misc: {
      [key: string]: string;
    };
    schema: {
      '@context': string;
      '@graph': any[];
    };
  };
  brands: any[];
  _links: ProductLinks;
};

export type ProductVariation = {
  id: number;
  type: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  description: string;
  permalink: string;
  sku: string;
  global_unique_id: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  status: string;
  purchasable: boolean;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[]; // adjust type if you have a specific download structure
  download_limit: number;
  download_expiry: number;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: string;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  weight: string;
  dimensions: ProductDimensions;
  shipping_class: string;
  shipping_class_id: number;
  image: ProductImage;
  attributes: {
    id: number;
    name: string;
    slug: string;
    option: string;
  }[];
  menu_order: number;
  meta_data: ProductMetaData[];
  name: string;
  parent_id: number;
  _links: ProductLinks;
};

export type ProductFilter = {
  id: number;
  name: string;
  terms: {
    id: number;
    name: string;
  }[];
};

export type ProductSortFilter = {
  order: 'asc' | 'desc';
  orderby: 'date' | 'price' | 'popularity' | 'rating' | 'title';
};

export type Banner = {
  id: string;
  bannerType: string;
  productId: string | null;
  title: string;
  content: string;
  desktopUrl: string;
  mobileUrl: string;
  tabletUrl: string;
  productUrl: string | null;
  isActive: boolean;
};
