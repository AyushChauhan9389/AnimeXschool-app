import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import { TextInput } from '@/components/ui/TextInput';
import { Button, ButtonText } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useSendOtpMutation, useVerifyOtpMutation } from '@/hooks/api/useAuth';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/Alert';
import { getErrorTitle, removeCountryCode } from '@/utils/formatters';
import { validateOtp } from '@/utils/validators';

export default function VerifyPhone() {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();
  const params = useLocalSearchParams();
  const returnTo = params.returnTo as Href | undefined;
  const phoneNumber = params.phoneNumber as string;

  const sendOtpMutation = useSendOtpMutation();

  const verifyOtpMutation = useVerifyOtpMutation();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      otp: '',
    },
    onSubmit: ({ value }) => {
      verifyOtpMutation.mutate(
        {
          phoneNumber,
          otp: value.otp,
        },
        {
          onSuccess: () => {
            router.dismissTo(returnTo || '/account');
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
            Verify Phone
          </Text>

          {/* Form */}
          <KeyboardAvoidingView style={styles.form}>
            <Text textAlign="center">
              We have sent a verification code to{' '}
              <Text highContrast>{removeCountryCode(phoneNumber)}</Text>
            </Text>
            <Field
              name="otp"
              validators={{ onChange: ({ value }) => validateOtp(value) }}
            >
              {field => (
                <>
                  <View style={styles.formField}>
                    <TextInput
                      accessibilityLabel="Code"
                      placeholder="Enter the code"
                      inputMode="numeric"
                      keyboardType="number-pad"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      autoFocus
                      autoComplete="one-time-code"
                    />
                    {field.state.meta.isTouched &&
                    field.state.meta.errors.length ? (
                      <Text variant="bodySm" color="red">
                        {field.state.meta.errors.join(', ')}
                      </Text>
                    ) : null}
                  </View>
                  <Button
                    disabled={
                      field.state.value.length !== 6 ||
                      verifyOtpMutation.isPending
                    }
                    onPress={handleSubmit}
                  >
                    {verifyOtpMutation.isPending ? (
                      <Spinner size="sm" colorStep="8" />
                    ) : null}
                    <ButtonText>Verify Code</ButtonText>
                  </Button>
                </>
              )}
            </Field>

            {verifyOtpMutation.isError && (
              <Alert color="red">
                <AlertIcon name="alert-circle" />
                <AlertTitle>
                  {getErrorTitle(verifyOtpMutation.error)}
                </AlertTitle>
                <AlertDescription>
                  {verifyOtpMutation.error.message}
                </AlertDescription>
              </Alert>
            )}

            <View style={styles.rowGroup}>
              <Text>Didn't receive the code?</Text>
              <Button
                variant="plain"
                disabled={sendOtpMutation.isPending}
                onPress={() =>
                  sendOtpMutation.mutate({
                    phoneNumber,
                  })
                }
              >
                {sendOtpMutation.isPending ? (
                  <Spinner size="sm" colorStep="8" />
                ) : null}
                <ButtonText>Resend Code</ButtonText>
              </Button>
            </View>
            {sendOtpMutation.isError && (
              <Alert color="red">
                <AlertIcon name="alert-circle" />
                <AlertTitle>{getErrorTitle(sendOtpMutation.error)}</AlertTitle>
                <AlertDescription>
                  {sendOtpMutation.error.message}
                </AlertDescription>
              </Alert>
            )}
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
