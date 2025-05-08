import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { Text } from '@/components/ui/Text';
import { useProductEstimateDeliveryDateMutation } from '@/hooks/api/useProducts';
import { TextInput } from '@/components/ui/TextInput';
import { Button, ButtonText } from '@/components/ui/Button';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Skeleton } from '@/components/ui/Skeleton';
import { getErrorTitle } from '@/utils/formatters';
import { useAuthStore } from '@/stores/authStore';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/Spinner';

const formSchema = z.object({
  pincode: z.string().min(6, 'Invalid pincode').max(6, 'Invalid pincode'),
});

const ProductEstimateDeliveryDate = () => {
  const { styles } = useStyles(stylesheet);

  const user = useAuthStore(state => state.user);

  const defaultPincode = user?.customerData.shipping.postcode || '';

  const mutation = useProductEstimateDeliveryDateMutation();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      pincode: defaultPincode,
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      mutation.mutate({ pincode: value.pincode });
    },
  });

  useEffect(() => {
    if (defaultPincode && mutation.isIdle) {
      mutation.mutate({ pincode: defaultPincode });
    }
  }, [defaultPincode, mutation]);

  const data = mutation.data;
  let date;

  if (data?.estimatedDeliveryDate) {
    date = data.estimatedDeliveryDate;
  } else if (data?.normalDate) {
    // normalDate format is '2025-03-28'
    date = new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
    }).format(new Date(data.normalDate));
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Field
          name="pincode"
          children={field => (
            <View style={styles.formField}>
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                accessibilityLabel="Pincode"
                placeholder="Enter pincode"
                inputMode="numeric"
                keyboardType="number-pad"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <Text variant="bodySm" color="red">
                  {field.state.meta.errors.map(e => e?.message).join(', ')}
                </Text>
              ) : null}
            </View>
          )}
        />
        <Button
          variant="soft"
          disabled={mutation.isPending}
          onPress={handleSubmit}
        >
          <Spinner loading={mutation.isPending} colorStep="8" />
          <ButtonText>Check</ButtonText>
        </Button>
      </View>
      <AsyncBoundary
        isLoading={mutation.isPending}
        error={mutation.error}
        ErrorComponent={() => (
          <Text color="red">{getErrorTitle(mutation.error)}</Text>
        )}
        LoadingComponent={() => <Skeleton style={{ height: 24 }} />}
      >
        {date && (
          <Text highContrast>
            Delivery by{' '}
            <Text fontFamily="interMedium" inherit>
              {date}
            </Text>
          </Text>
        )}
      </AsyncBoundary>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  container: {
    gap: space[12],
  },
  form: {
    flex: 1,
    flexDirection: 'row',
    gap: space[12],
  },
  formField: {
    flex: 1,
    gap: space[8],
  },
}));

export { ProductEstimateDeliveryDate };
