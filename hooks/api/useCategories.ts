import { useQuery } from '@tanstack/react-query';
import {
  getCategories,
  getCategoryFilters,
  getSubCategories,
} from '@/api/categoriesApi';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const useSubCategories = (id: number) => {
  return useQuery({
    queryKey: ['subcategories', id],
    queryFn: () => getSubCategories(id),
  });
};

export const useCategoryFilters = (id: number) => {
  return useQuery({
    queryKey: ['category-filters', id],
    queryFn: () => getCategoryFilters(id),
  });
};
