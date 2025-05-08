import React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import { TextInput } from '@/components/ui/TextInput';
import { Button, ButtonText } from '@/components/ui/Button';
import { useForgotPasswordMutation } from '@/hooks/api/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { useRouter } from 'expo-router';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPassword() {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();

  const forgotPasswordMutation = useForgotPasswordMutation();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      forgotPasswordMutation.mutate(
        {
          email: value.email,
        },
        {
          onSuccess: () => {
            router.push({
              pathname: '/reset-password',
              params: {
                email: value.email,
              },
            });
          },
        },
      );
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.slotContainer}>
        <View style={styles.slotContainerInner}>
          <View style={styles.group}>
            <Text variant="headingSm" textAlign="center" highContrast>
              Forgot Password?
            </Text>
            <Text textAlign="center">
              We'll send you a code to verify your email address.
            </Text>
          </View>

          <KeyboardAvoidingView style={styles.form}>
            <Field
              name="email"
              children={field => (
                <>
                  <TextInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    accessibilityLabel="Email"
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <Text variant="bodySm" color="red">
                      {field.state.meta.errors
                        .map(err => err?.message)
                        .join(', ')}
                    </Text>
                  ) : null}
                </>
              )}
            />

            <Button
              disabled={forgotPasswordMutation.isPending}
              onPress={handleSubmit}
            >
              <Spinner
                loading={forgotPasswordMutation.isPending}
                colorStep="8"
              />
              <ButtonText>Send Code</ButtonText>
            </Button>
          </KeyboardAvoidingView>
        </View>
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
    marginTop: -120,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotContainerInner: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: space[24],
    paddingHorizontal: space[24],
  },
  form: {
    maxWidth: 400,
    width: '100%',
    gap: space[16],
  },
  rowGroup: {
    flexDirection: 'row',
    gap: space[4],
    alignItems: 'center',
  },
  group: {
    width: '100%',
    gap: space[12],
  },
}));
