import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import { TextInput } from '@/components/ui/TextInput';
import { Button, ButtonText } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useSendEmailVerificationOtpMutation } from '@/hooks/api/useAuth';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/Alert';

const formSchema = z.object({
  email: z.string().email('Invalid email'),
});

export default function VerifyAccount() {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();
  const params = useLocalSearchParams();
  const returnTo = params?.returnTo as Href | undefined;
  const defaultEmail = (params?.email as string) || '';

  const sendOtpMutation = useSendEmailVerificationOtpMutation();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: defaultEmail,
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      sendOtpMutation.mutate(
        {
          email: value.email,
        },
        {
          onSuccess: () => {
            router.push({
              pathname: '/verify-email',
              params: {
                email: value.email,
                returnTo: returnTo as any,
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
            <Text variant="headingMd" textAlign="center" highContrast>
              Verify Email
            </Text>
          </View>

          {/* Form */}
          <KeyboardAvoidingView style={styles.form}>
            <Field name="email">
              {field => (
                <>
                  <View style={styles.formField}>
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
                        {field.state.meta.errors.join(', ')}
                      </Text>
                    ) : null}
                  </View>
                  <Button
                    disabled={sendOtpMutation.isPending}
                    onPress={handleSubmit}
                  >
                    {sendOtpMutation.isPending ? (
                      <Spinner size="sm" colorStep="8" />
                    ) : null}
                    <ButtonText>Send Code</ButtonText>
                  </Button>
                </>
              )}
            </Field>

            {sendOtpMutation.isError && (
              <Alert color="red">
                <AlertIcon name="alert-circle" />
                <AlertTitle>{sendOtpMutation.error.name}</AlertTitle>
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
  group: {
    width: '100%',
    gap: space[12],
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
