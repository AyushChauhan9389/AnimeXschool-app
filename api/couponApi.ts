import { api } from '.';
import { Coupon } from '@/types/order';

export const getCoupon = async ({ code }: { code: Coupon['code'] }) => {
  const { data } = await api.get(`/coupons/${code}`);
  return data as Coupon;
};
