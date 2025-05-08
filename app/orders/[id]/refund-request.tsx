import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { Text } from '@/components/ui/Text';
import { Button, ButtonText } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { BackButton } from '@/components/BackButton';
import { useCreateRefundRequestMutation } from '@/hooks/api/useOrders';
import { Spinner } from '@/components/ui/Spinner';

const formSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
});

export default function RefundRequestScreen() {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();
  const { id: orderId } = useLocalSearchParams<{ id: string }>();

  const createRefundRequestMutation = useCreateRefundRequestMutation();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      reason: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      createRefundRequestMutation.mutate(
        {
          orderId: orderId,
          reason: value.reason,
        },
        {
          onSuccess: () => {
            router.back();
          },
        },
      );
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text variant="labelLg" highContrast>
          Refund Request
        </Text>
      </View>
      <View style={styles.slotContainer}>
        <Text variant="labelLg" highContrast>
          Initiate a refund request for the order #{orderId}
        </Text>
        <Field
          name="reason"
          children={field => (
            <View style={styles.group}>
              <Text variant="labelMd" highContrast>
                Reason
              </Text>
              <TextArea
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter reason"
                accessibilityLabel="Refund reason"
                size="lg"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <Text variant="bodySm" color="red">
                  {field.state.meta.errors
                    .map(err => err && err.message)
                    .join(', ')}
                </Text>
              ) : null}
            </View>
          )}
        />
        <Button
          disabled={createRefundRequestMutation.isPending}
          onPress={handleSubmit}
        >
          <Spinner
            loading={createRefundRequestMutation.isPending}
            colorStep="8"
          />
          <ButtonText>Request Refund</ButtonText>
        </Button>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.insets.top + space[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[4],
  },
  slotContainer: {
    flex: 1,
    paddingHorizontal: space[16],
    paddingTop: space[12],
    paddingBottom: rt.insets.bottom + space[44],
    gap: space[16],
  },
  group: {
    gap: space[12],
  },
}));
