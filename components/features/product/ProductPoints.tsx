import { useMemo } from 'react';

import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Text } from '@/components/ui/Text';
import { usePointsSettings } from '@/hooks/api/usePoints';
import { Skeleton } from '@/components/ui/Skeleton';
import { Product } from '@/types/product';
import { Alert, AlertTitle } from '@/components/ui/Alert';

const POINTS_EARNED_KEY = '_wc_points_earned';

const ProductPoints = ({ product }: { product: Product }) => {
  const { data, isLoading, error } = usePointsSettings();

  const pointsMetaData = product.meta_data.find(
    item => item.key === POINTS_EARNED_KEY,
  );
  const price = Number(product.price); // rupee

  const points = useMemo(() => {
    if (data) {
      if (pointsMetaData && pointsMetaData?.value !== '') {
        // check if its fixed value or percentage
        const isPercentage = pointsMetaData.value.includes('%');
        if (isPercentage) {
          const percentage = Number(pointsMetaData.value.replace('%', ''));
          const earnRate = data.points.earn_rate;
          const points = earnRate.points;
          return ((price * percentage) / 100) * points;
        } else {
          // if fixed value, just return the value
          return Number(pointsMetaData.value);
        }
      } else {
        const earnRate = data.points.earn_rate;
        const points = earnRate.points;
        return price * points;
      }
    }
    return 0;
  }, [data, price, pointsMetaData]);

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      ErrorComponent={() => null}
      LoadingComponent={() => <Skeleton style={{ height: 24 }} />}
    >
      {points > 0 ? (
        <Alert color="purple" size="sm">
          <AlertTitle>
            Purchase this product now and earn{' '}
            <Text fontFamily="interBold" inherit>
              {points}
            </Text>{' '}
            {points > 1 ? 'Points' : 'Point'}!
          </AlertTitle>
        </Alert>
      ) : null}
    </AsyncBoundary>
  );
};

export { ProductPoints };
