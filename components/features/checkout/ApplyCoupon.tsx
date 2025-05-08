import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { toast } from 'sonner-native';
import { AnyFieldApi, useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { Text } from '@/components/ui/Text';
import { Button, ButtonText } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { getCoupon } from '@/api/couponApi';
import { Coupon } from '@/types/order';
import { Spinner } from '@/components/ui/Spinner';
import { Badge, BadgeIcon, BadgeText } from '@/components/ui/Badge';

const formSchema = z.object({
  couponCode: z.string().min(1, 'Enter valid coupon code').max(255, 'Too long'),
});

type ApplyCouponProps = {
  total: string;
  onDiscountedTotalChange: (total: string, coupons: Coupon[]) => void;
};

const ApplyCoupon = ({ total, onDiscountedTotalChange }: ApplyCouponProps) => {
  const { styles } = useStyles(stylesheet);

  const { Field, handleSubmit, reset } = useForm({
    defaultValues: {
      couponCode: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value: { couponCode } }) => {
      await handleApplyCoupon(couponCode);
    },
  });

  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);

  const handleApplyCoupon = useCallback(
    async (code: string) => {
      setCouponLoading(true);

      try {
        // check if coupon is already applied
        const appliedCoupon = appliedCoupons.find(c => c.code === code);
        if (appliedCoupon) {
          toast.error('Coupon already applied');
          return;
        }

        const coupon = await getCoupon({ code });

        // check coupon expiry
        if (isCouponExpired(coupon)) {
          toast.error('Coupon expired');
          return;
        }

        const newCoupons = [...appliedCoupons, coupon];
        const discountedTotal = calculateDiscountedTotal(total, newCoupons);

        onDiscountedTotalChange(discountedTotal, newCoupons);

        setAppliedCoupons(newCoupons);

        // reset form
        reset();

        toast.success('Coupon applied');
      } catch (error) {
        if (error instanceof Error) {
          toast.error('Coupon not found', {
            description: error.message,
          });
        } else {
          toast.error('Coupon not found');
        }

        console.log('Error while applying coupon', error);
      } finally {
        setCouponLoading(false);
      }
    },
    [appliedCoupons, onDiscountedTotalChange, reset, total],
  );

  const handleRemoveCoupon = useCallback(
    (coupon: Coupon) => {
      const newCoupons = appliedCoupons.filter(c => c.id !== coupon.id);
      const discountedTotal = calculateDiscountedTotal(total, newCoupons);

      onDiscountedTotalChange(discountedTotal, newCoupons);

      setAppliedCoupons(newCoupons);
    },
    [appliedCoupons, onDiscountedTotalChange, total],
  );

  return (
    <View style={styles.container}>
      <Text variant="labelMd" highContrast>
        Have a coupon?
      </Text>
      <View style={styles.form}>
        <Field
          name="couponCode"
          children={field => (
            <View style={styles.field}>
              <TextInput
                accessibilityLabel="Coupon Code"
                placeholder="Enter coupon code"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                inputMode="text"
                readOnly={couponLoading}
              />
              <FieldError field={field} />
            </View>
          )}
        />

        <Button
          variant="outline"
          disabled={couponLoading}
          onPress={handleSubmit}
        >
          <Spinner loading={couponLoading} colorStep="8" />
          <ButtonText>Apply</ButtonText>
        </Button>
      </View>

      {/* Applied coupons */}
      {appliedCoupons.length > 0 && (
        <View style={styles.coupons}>
          {appliedCoupons.map(coupon => {
            return (
              <Badge key={coupon.id} size="lg" color="green" variant="soft">
                <BadgeText>{coupon.code}</BadgeText>
                <Pressable
                  hitSlop={8}
                  onPress={() => handleRemoveCoupon(coupon)}
                >
                  <BadgeIcon name="close" size="lg" />
                </Pressable>
              </Badge>
            );
          })}
        </View>
      )}
    </View>
  );
};

const FieldError = ({ field }: { field: AnyFieldApi }) => {
  return field.state.meta.isTouched && field.state.meta.errors.length ? (
    <Text variant="bodySm" color="red">
      {field.state.meta.errors.map(err => err.message).join(', ')}
    </Text>
  ) : null;
};

function isCouponExpired(coupon: Coupon): boolean {
  // Use date_expires_gmt if available; otherwise, fall back to date_expires.
  const expirationStr = coupon.date_expires_gmt || coupon.date_expires;

  // If there's no expiration date defined, we assume the coupon isn't expired.
  if (!expirationStr) return false;

  const expirationDate = new Date(expirationStr);
  const now = new Date();

  // Check if the parsed expiration date is a valid date.
  if (isNaN(expirationDate.getTime())) {
    console.error('Invalid expiration date format.');
    return false;
  }

  return now > expirationDate;
}

function calculateDiscountedTotal(totalString: string, coupons: Coupon[]) {
  if (coupons.length === 0) {
    return totalString;
  }

  const total = parseFloat(totalString);

  let discountedTotal = total;

  for (const coupon of coupons) {
    const { amount: amountString, discount_type } = coupon;
    const amount = parseFloat(amountString);

    if (discount_type === 'percent') {
      const discount = total * (amount / 100);
      discountedTotal -= discount;
    } else {
      // fixed amount
      const discount = amount;
      discountedTotal -= discount;
    }
  }
  return discountedTotal.toFixed(2);
}

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  container: {
    gap: space[12],
  },
  form: {
    flexDirection: 'row',
    gap: space[8],
  },
  field: {
    flex: 1,
    gap: space[8],
  },
  coupons: {
    flexDirection: 'row',
    gap: space[8],
    flexWrap: 'wrap',
  },
}));

export { ApplyCoupon };
export type { ApplyCouponProps };
