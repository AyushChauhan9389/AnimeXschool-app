import React, { useState } from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import {
  TextInput,
  TextInputAdornment,
  TextInputProps,
} from '@/components/ui/TextInput';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { useResetPasswordMutation } from '@/hooks/api/useAuth';
import { Spinner } from '@/components/ui/Spinner';

const formSchema = z
  .object({
    otp: z
      .string()
      .min(6, 'Invalid code. Must be 6 digits.')
      .max(6, 'Invalid code. Must be 6 digits.'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function ResetPassword() {
  const { styles } = useStyles(stylesheet);

  const params = useLocalSearchParams();
  const router = useRouter();

  const email = params.email as string;

  const resetPasswordMutation = useResetPasswordMutation();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      resetPasswordMutation.mutate(
        {
          otp: value.otp,
          email: email,
          newPassword: value.password,
        },
        {
          onSuccess: () => {
            router.dismissTo({
              pathname: '/sign-in',
              params: {
                returnTo: '/account',
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
              Reset Password
            </Text>

            <Text variant="bodySm" textAlign="center">
              Create a new password for{' '}
              <Text variant="bodySm" highContrast>
                {email}
              </Text>
            </Text>
          </View>
          <KeyboardAvoidingView style={styles.form}>
            <Field
              name="otp"
              children={field => (
                <View style={styles.field}>
                  <TextInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    accessibilityLabel="Code"
                    placeholder="Enter the code"
                    inputMode="numeric"
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
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
                </View>
              )}
            />
            <Field
              name="password"
              children={field => (
                <View style={styles.field}>
                  <PasswordInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    accessibilityLabel="New Password"
                    placeholder="New Password"
                    keyboardType="default"
                    autoCapitalize="none"
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <Text variant="bodySm" color="red">
                      {field.state.meta.errors
                        .map(err => err?.message)
                        .join(', ')}
                    </Text>
                  ) : null}
                </View>
              )}
            />
            <Field
              name="confirmPassword"
              children={field => (
                <View style={styles.field}>
                  <PasswordInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    accessibilityLabel="Confirm Password"
                    placeholder="Confirm Password"
                    keyboardType="default"
                    autoCapitalize="none"
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <Text variant="bodySm" color="red">
                      {field.state.meta.errors
                        .map(err =>
                          typeof err === 'string' ? err : err?.message,
                        )
                        .join(', ')}
                    </Text>
                  ) : null}
                </View>
              )}
            />
            <Button
              disabled={resetPasswordMutation.isPending}
              onPress={handleSubmit}
            >
              <Spinner
                loading={resetPasswordMutation.isPending}
                colorStep="8"
              />
              <ButtonText>Reset Password</ButtonText>
            </Button>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}

const PasswordInput = (props: Omit<TextInputProps, 'as'>) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <TextInput
      {...props}
      secureTextEntry={secureTextEntry}
      endAdornment={
        <TextInputAdornment type="action">
          <Button
            color="neutral"
            size="sm"
            variant="ghost"
            iconOnly
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <ButtonIcon name={secureTextEntry ? 'eye-off' : 'eye'} />
          </Button>
        </TextInputAdornment>
      }
      textInputStyle={{ flex: 1 }}
    />
  );
};

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
  field: {
    gap: space[8],
  },
  group: {
    width: '100%',
    gap: space[12],
  },
  rowGroup: {
    flexDirection: 'row',
    gap: space[4],
    alignItems: 'center',
  },
}));
