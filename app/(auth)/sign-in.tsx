import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { AnyFieldApi, useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import {
  TextInput,
  TextInputAdornment,
  TextInputProps,
} from '@/components/ui/TextInput';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { useLoginWithEmailAndPasswordMutation } from '@/hooks/api/useAuth';
import { toast } from 'sonner-native';
import { Spinner } from '@/components/ui/Spinner';

export default function SignIn() {
  const { styles } = useStyles(stylesheet);

  const params = useLocalSearchParams();
  const returnToParam = params?.returnTo;
  const returnTo =
    typeof returnToParam === 'string' && returnToParam !== ''
      ? returnToParam
      : '/account';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
      </View>

      <View style={styles.slotContainer}>
        <View style={styles.slotContainerInner}>
          <View style={styles.group}>
            <Text variant="headingMd" textAlign="center" highContrast>
              Sign In
            </Text>
            <Text textAlign="center">
              Sign in with your email and password.
            </Text>
          </View>

          <SignInForm returnTo={returnTo} />

          <Text>Or</Text>

          <Link
            href={{
              pathname: '/login-with-otp',
              params: {
                returnTo,
              },
            }}
            asChild
          >
            <Button variant="soft" color="neutral" fill>
              <ButtonText>Login with OTP</ButtonText>
            </Button>
          </Link>

          <View style={styles.flexRow}>
            <Text>Don't have an account?</Text>
            <Link
              href={{
                pathname: '/register',
                params: {
                  returnTo,
                },
              }}
              asChild
            >
              <Pressable>
                <Text variant="labelMd" color="primary">
                  Register
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

const formSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required').max(255, 'Too long'),
});

const SignInForm = ({ returnTo }: { returnTo: string }) => {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();

  const loginMutation = useLoginWithEmailAndPasswordMutation(returnTo);

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value) {
        return;
      }
      loginMutation.mutate(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: data => {
            router.dismissTo(returnTo as any);
            toast.success('Login successful');
          },
        },
      );
    },
  });

  return (
    <KeyboardAvoidingView style={styles.form}>
      <Field
        name="email"
        children={field => (
          <View style={styles.field}>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              accessibilityLabel="Email"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FieldError field={field} />
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
              accessibilityLabel="Password"
              placeholder="Password"
              autoCapitalize="none"
            />
            <FieldError field={field} />
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Link href="/forgot-password" asChild>
          <Pressable>
            <Text color="primary" variant="labelSm">
              Forgot password?
            </Text>
          </Pressable>
        </Link>
      </View>
      <Button disabled={loginMutation.isPending} onPress={handleSubmit}>
        <Spinner loading={loginMutation.isPending} colorStep="8" />
        <ButtonText>Sign In</ButtonText>
      </Button>
    </KeyboardAvoidingView>
  );
};

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

const FieldError = ({ field }: { field: AnyFieldApi }) => {
  return field.state.meta.isTouched && field.state.meta.errors.length ? (
    <Text variant="bodySm" color="red">
      {field.state.meta.errors
        .map(err => (typeof err === 'string' ? err : err?.message))
        .join(', ')}
    </Text>
  ) : null;
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
  group: {
    width: '100%',
    gap: space[12],
  },
  slotContainer: {
    marginTop: -80,
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
    marginTop: space[24],
    gap: space[16],
  },
  field: {
    gap: space[8],
  },
  flexRow: {
    flexDirection: 'row',
    gap: space[8],
    alignItems: 'center',
  },
}));
