import { useQuery } from '@tanstack/react-query';

import { getCoupon } from '@/api/couponApi';
import { Coupon } from '@/types/order';

export const useCoupon = ({ code }: { code: Coupon['code'] }) => {
  return useQuery({
    queryKey: ['coupon', code],
    queryFn: () => getCoupon({ code }),
  });
};
