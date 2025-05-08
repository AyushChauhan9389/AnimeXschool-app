import { useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/RadioGroup';
import { Text } from '@/components/ui/Text';
import { Coupon } from '@/types/order';
import { usePoints, usePointsSettings } from '@/hooks/api/usePoints';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatRupee } from '@/utils/formatters';
import { RS } from '@/constants/currency';
import { Separator } from '@/components/ui/Separator';
import { DiscountMethod } from '@/types/cart';
import { ApplyCoupon } from './ApplyCoupon';

const DISCOUNT_METHODS: Record<DiscountMethod, DiscountMethod> = {
  points: 'points',
  coupons: 'coupons',
};

type ApplyDiscountProps = {
  discountMethod: DiscountMethod;
  total: string;
  discountedTotal: string;
  onDiscountedTotalChange: (value: {
    discountMethod: DiscountMethod;
    discountedTotal: string;
    coupons: Coupon[];
    points: number;
  }) => void;
};

const ApplyDiscount = ({
  discountMethod,
  total,
  discountedTotal,
  onDiscountedTotalChange,
}: ApplyDiscountProps) => {
  const { styles } = useStyles(stylesheet);

  const pointsSettingsQuery = usePointsSettings();
  const pointsQuery = usePoints();

  const pointsBalance = pointsQuery.data?.points.points_balance; // How many points user has

  const maxDiscountPercentage =
    pointsSettingsQuery.data?.points?.maximum_points_discount;

  /**
   * Max discount is calculated as a percentage of total in Rupee
   */
  const maxDiscount = useMemo(() => {
    if (maxDiscountPercentage) {
      const percentage = parseFloat(maxDiscountPercentage);
      return (parseFloat(total) * (percentage / 100)) / 100;
    }
  }, [maxDiscountPercentage, total]);

  /**
   * @returns How many points user can use for discount based on max discount percentage
   */
  const getUsablePointsData = () => {
    if (!pointsBalance || !pointsSettingsQuery.data || !maxDiscount) {
      return;
    }
    const redemptionRate = pointsSettingsQuery.data.points.redemption_rate;
    const redemptionPoints = redemptionRate.points;
    const monetaryValue = redemptionRate.monetary_value;
    const pointsPerMonetaryValue = redemptionPoints / monetaryValue;

    // NOTE: 1 monetaryValue = X redemptionPoints = 1 Rupee

    const maxUsablePoints = maxDiscount * pointsPerMonetaryValue;

    const usablePoints = Math.min(pointsBalance, maxUsablePoints);

    // convert usable points to Rupee
    const usablePointsRupee = usablePoints / pointsPerMonetaryValue;

    return {
      points: usablePoints,
      rupee: usablePointsRupee,
    };
  };

  const usablePointsAndRupee = getUsablePointsData();

  const showPointsDiscountMethod =
    pointsBalance && pointsBalance > 0 ? true : false;

  const handleDiscountMethodChange = (method: string) => {
    if (method === DISCOUNT_METHODS.points) {
      if (!usablePointsAndRupee) {
        return;
      }
      const newDiscountedTotal =
        parseFloat(total) - usablePointsAndRupee.rupee * 100;
      // convert usable rupees to paise
      onDiscountedTotalChange({
        discountMethod: 'points',
        discountedTotal: newDiscountedTotal.toFixed(2),
        coupons: [],
        points: usablePointsAndRupee.points,
      });
    } else {
      // coupons
      if (discountMethod === 'coupons') {
        return;
      }
      onDiscountedTotalChange({
        discountMethod: 'coupons',
        discountedTotal: total,
        coupons: [],
        points: 0,
      });
    }
  };

  return (
    <AsyncBoundary
      isLoading={pointsSettingsQuery.isLoading || pointsQuery.isLoading}
      error={null}
      LoadingComponent={() => (
        <Skeleton style={{ width: '100%', height: 200 }} />
      )}
    >
      <View style={styles.container}>
        <Text variant="labelMd" highContrast>
          Choose a discount method
        </Text>
        <RadioGroup
          value={discountMethod}
          onValueChange={handleDiscountMethodChange}
          style={styles.radioGroup}
        >
          {showPointsDiscountMethod && (
            <>
              <RadioGroupItem
                value={DISCOUNT_METHODS.points}
                style={styles.radioItem}
              >
                <RadioGroupIndicator />
                <View style={styles.radioItemInner}>
                  <Text variant="labelLg" highContrast>
                    Points
                  </Text>
                  <Text variant="bodySm">
                    Use{' '}
                    <Text fontFamily="interBold" inherit>
                      {formatRupee(`${usablePointsAndRupee?.points}`)}
                    </Text>{' '}
                    Points for{' '}
                    <Text fontFamily="interBold" inherit>
                      {RS}
                      {formatRupee(
                        usablePointsAndRupee?.rupee.toFixed(2) ?? '',
                      )}
                    </Text>{' '}
                    discount on this order!
                  </Text>
                </View>
              </RadioGroupItem>
              <Separator />
            </>
          )}
          <RadioGroupItem
            value={DISCOUNT_METHODS.coupons}
            style={styles.radioItem}
          >
            <RadioGroupIndicator />
            <View style={styles.radioItemInner}>
              <Text variant="labelLg" highContrast>
                Coupons
              </Text>
              <Text variant="bodySm">
                Use a coupon to get a discount on this order!
              </Text>
            </View>
          </RadioGroupItem>
        </RadioGroup>
        {discountMethod === 'coupons' && (
          <ApplyCoupon
            total={total}
            onDiscountedTotalChange={(total, coupons) => {
              onDiscountedTotalChange({
                discountMethod: 'coupons',
                discountedTotal: total,
                coupons,
                points: 0,
              });
            }}
          />
        )}
      </View>
    </AsyncBoundary>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  container: {
    gap: space[12],
  },
  form: {
    flexDirection: 'row',
    gap: space[8],
  },
  radioGroup: {
    backgroundColor: colors.neutral3,
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
  radioItem: {
    flexDirection: 'row',
    gap: space[16],
    alignItems: 'center',
    padding: space[16],
  },
  radioItemInner: {
    flex: 1,
    gap: space[4],
  },
}));

export { ApplyDiscount };
export type { ApplyDiscountProps };
