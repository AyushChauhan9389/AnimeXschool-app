import { api } from '.';
import {
  Banner,
  Product,
  ProductFilter,
  ProductSortFilter,
  ProductVariation,
} from '@/types/product';

export type GetProductsParams = {
  pageParam?: number; // `pageParam` is passed by react-query, see @hooks/api/useProducts.ts
  search?: string;
  category?: number;
  /**
   * Query string used to filter the products.
   *
   * @example `attributeId=1&attributeId=2&attributeTerm=red&attributeTerm=blue`
   */
  filterQuery?: string;
  order?: ProductSortFilter['order'];
  orderby?: ProductSortFilter['orderby'];
};
export type ProductsResponse = {
  currentPage: number;
  data: Product[];
  per_page: number;
  total_pages: number;
  totalOriginalProducts: number;
  totalProducts: number;
  filter: ProductFilter[];
};
export const getProducts = async (params: GetProductsParams) => {
  let queryString = buildProductsQuery(params);

  const { data } = await api.get(`/products?${queryString}`);
  return data as ProductsResponse;
};

export const getExploreProducts = async (params: GetProductsParams) => {
  let queryString = buildProductsQuery(params);

  const { data } = await api.get(`/products/explore?${queryString}`);
  return data as ProductsResponse;
};

export type ProductResponse = {
  product: Product;
  variations: ProductVariation[];
};
export const getProduct = async (id: number) => {
  const { data } = await api.get(`/products/${id}`);
  return data as ProductResponse;
};

export const getBanners = async () => {
  const { data } = await api.get('/banners');
  return data as Banner[];
};

export const getProductEstimateDeliveryDate = async ({
  pincode,
}: {
  pincode: string;
}) => {
  const { data } = await api.get(`/customers/shipping/estimate/${pincode}`);
  return data as {
    pincode: string;
    estimatedDeliveryDate: string;
    normalDate: string;
  };
};

function buildProductsQuery(params: GetProductsParams): string {
  const urlParams = new URLSearchParams();

  if (params.pageParam !== undefined) {
    urlParams.append('page', params.pageParam.toString());
  }
  if (params.search) {
    urlParams.append('search', params.search);
  }
  if (params.category !== undefined) {
    urlParams.append('category', params.category.toString());
  }
  urlParams.append('orderby', params.orderby ?? 'date');
  urlParams.append('order', params.order ?? 'desc');

  // Append filterQuery (assumed to be pre-formatted) if provided
  return params.filterQuery
    ? `${urlParams.toString()}&${params.filterQuery}`
    : urlParams.toString();
}
