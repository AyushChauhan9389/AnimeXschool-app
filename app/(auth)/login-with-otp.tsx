import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from '@tanstack/react-form';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import { TextInput, TextInputAdornment } from '@/components/ui/TextInput';
import { Button, ButtonText } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useSendOtpMutation } from '@/hooks/api/useAuth';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/Alert';

export default function LoginWithOtp() {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();
  const params = useLocalSearchParams();

  const returnTo = params.returnTo as string | undefined;

  const mutation = useSendOtpMutation();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      phoneNumber: '',
    },
    onSubmit: ({ value }) => {
      mutation.mutate(
        {
          phoneNumber: `91${value.phoneNumber}`,
        },
        {
          onSuccess: () => {
            router.push({
              pathname: '/verify-phone',
              params: {
                phoneNumber: `91${value.phoneNumber}`,
                returnTo: returnTo || '/account',
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
          <Text variant="headingMd" highContrast>
            Login with OTP
          </Text>

          {/* Form */}
          <KeyboardAvoidingView style={styles.form}>
            <Field
              name="phoneNumber"
              validators={{
                onChange: ({ value }) => validatePhoneNumber(value),
              }}
            >
              {field => (
                <>
                  <View style={styles.formField}>
                    <TextInput
                      accessibilityLabel="Phone number"
                      placeholder="Enter your phone number"
                      inputMode="numeric"
                      keyboardType="number-pad"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      readOnly={mutation.isPending}
                      autoFocus
                      startAdornment={
                        <TextInputAdornment>
                          <Text highContrast>+91</Text>
                        </TextInputAdornment>
                      }
                    />
                    {field.state.meta.isTouched &&
                    field.state.meta.errors.length ? (
                      <Text variant="bodySm" color="red">
                        {field.state.meta.errors.join(', ')}
                      </Text>
                    ) : null}
                  </View>
                  <Button
                    disabled={mutation.isPending || !field.state.value}
                    onPress={handleSubmit}
                  >
                    {mutation.isPending && <Spinner size="sm" colorStep="8" />}
                    <ButtonText>Send Code</ButtonText>
                  </Button>
                </>
              )}
            </Field>

            {mutation.isError && (
              <Alert color="red">
                <AlertIcon name="alert-circle" />
                <AlertTitle>{mutation.error.name}</AlertTitle>
                <AlertDescription>{mutation.error.message}</AlertDescription>
              </Alert>
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}

const validatePhoneNumber = (value: string) => {
  const regex = /^\d{10}$/;
  return regex.test(value)
    ? undefined
    : 'Invalid phone number. Must be 10 digits.';
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
    gap: space[20],
    paddingHorizontal: space[24],
  },
  form: {
    maxWidth: 400,
    width: '100%',
    marginTop: space[24],
    gap: space[16],
  },
  formField: {
    // flexGrow: 1,
    gap: space[8],
  },
  rowGroup: {
    flexDirection: 'row',
    gap: space[4],
    alignItems: 'center',
  },
}));
