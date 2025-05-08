import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { Coupon } from '@/types/order';
import { RS } from '@/constants/currency';
import { formatRupee } from '@/utils/formatters';
import { DiscountMethod } from '@/types/cart';

type PaymentSummaryProps = {
  discountMethod: DiscountMethod;
  total: string;
  totalPayable: string;
  appliedCoupons: Coupon[];
  usedPoints: number;
};

const PaymentSummary = ({
  discountMethod,
  total,
  totalPayable,
  appliedCoupons,
  usedPoints,
}: PaymentSummaryProps) => {
  const { styles } = useStyles(stylesheet);

  const totalRuppee = formatRupee(convertToRupee(total));

  const totalPayableRuppee = formatRupee(convertToRupee(totalPayable));

  const discountedTotalRuppee = formatRupee(
    convertToRupee((parseFloat(total) - parseFloat(totalPayable)).toFixed(2)),
  );

  return (
    <View style={styles.container}>
      <Text variant="labelMd" highContrast>
        Payment Summary
      </Text>
      {/* Total */}
      <View style={styles.rowGroup}>
        <Text variant="bodySm">Total</Text>
        <Text variant="labelMd" highContrast>
          {RS}
          {totalRuppee}
        </Text>
      </View>

      {/* Coupon Applied */}
      {discountMethod === 'points' ? (
        <View style={styles.rowGroup}>
          <Text variant="bodySm">
            Points Discount ({formatRupee(`${usedPoints}`)})
          </Text>
          <Text variant="labelMd" color="red">
            - {RS}
            {discountedTotalRuppee}
          </Text>
        </View>
      ) : (
        appliedCoupons.length > 0 && (
          <View style={styles.rowGroup}>
            <View>
              <Text variant="bodySm">
                {appliedCoupons.length > 1 ? 'Coupons' : 'Coupon'} Applied
              </Text>
              <View style={styles.couponRow}>
                <Text variant="bodySm" color="green">
                  {appliedCoupons.map(coupon => coupon.code).join(', ')}
                </Text>
              </View>
            </View>
            <Text variant="labelMd" color="red">
              - {RS}
              {discountedTotalRuppee}
            </Text>
          </View>
        )
      )}

      {/* Total Payable */}
      <View style={styles.rowGroup}>
        <Text variant="bodySm">Total Payable</Text>
        <Text variant="labelMd" highContrast>
          {RS}
          {totalPayableRuppee}
        </Text>
      </View>
    </View>
  );
};

// Convert amount from paise to rupee
function convertToRupee(amount: string) {
  return (parseFloat(amount) / 100).toFixed(2);
}

const stylesheet = createStyleSheet(({ space }) => ({
  container: {
    gap: space[12],
  },
  couponRow: {
    flexDirection: 'row',
    gap: space[8],
    flexWrap: 'wrap',
  },
  rowGroup: {
    flexDirection: 'row',
    gap: space[12],
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export { PaymentSummary };
export type { PaymentSummaryProps };
