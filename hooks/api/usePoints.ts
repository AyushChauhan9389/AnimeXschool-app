import { useQuery } from '@tanstack/react-query';

import {
  getPoints,
  getPointsHistory,
  getPointsSettings,
} from '@/api/pointsApi';

export const usePoints = () => {
  return useQuery({
    queryKey: ['points'],
    queryFn: getPoints,
  });
};

export const usePointsHistory = () => {
  return useQuery({
    queryKey: ['points-history'],
    queryFn: getPointsHistory,
  });
};

export const usePointsSettings = () => {
  return useQuery({
    queryKey: ['points-settings'],
    queryFn: getPointsSettings,
  });
};
