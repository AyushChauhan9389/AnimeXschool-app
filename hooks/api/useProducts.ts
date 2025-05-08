import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import {
  getBanners,
  getExploreProducts,
  getProduct,
  getProductEstimateDeliveryDate,
  getProducts,
  GetProductsParams,
} from '@/api/productsApi';

export type UseProductsParams = Omit<GetProductsParams, 'pageParam'>;

export const useProducts = (params?: UseProductsParams) => {
  return useInfiniteQuery({
    queryKey: ['products', params],
    queryFn: ({ pageParam }) => getProducts({ pageParam, ...params }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.currentPage >= lastPage.total_pages
        ? null
        : lastPage.currentPage + 1,
  });
};

export const useSearchProducts = (params?: UseProductsParams) => {
  return useInfiniteQuery({
    queryKey: ['search-products', params],
    queryFn: ({ pageParam }) => getProducts({ pageParam, ...params }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.currentPage >= lastPage.total_pages
        ? null
        : lastPage.currentPage + 1,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useExploreProducts = (params?: UseProductsParams) => {
  return useInfiniteQuery({
    queryKey: ['products-explore', params],
    queryFn: ({ pageParam }) => getExploreProducts({ pageParam, ...params }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.currentPage >= lastPage.total_pages
        ? null
        : lastPage.currentPage + 1,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  });
};

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: getBanners,
  });
};

export const useProductEstimateDeliveryDateMutation = () => {
  return useMutation({
    mutationFn: getProductEstimateDeliveryDate,
  });
};
