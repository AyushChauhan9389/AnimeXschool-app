import { ProductFilter } from '@/types/product';
import { api } from '.';
import { Category } from '@/types/category';

export const getCategories = async () => {
  const { data } = await api.get('/categories');
  return data as Category[];
};

export const getSubCategories = async (id: number) => {
  const { data } = await api.get(`/categories/${id}/subcategories`);
  return data as {
    data: Category[];
    timestamp: number;
    totalSubcategories: number;
  };
};

export const getCategoryFilters = async (id: number) => {
  const { data } = await api.get(`/categories/${id}/filters`);
  return data as {
    filter: ProductFilter[];
  };
};
