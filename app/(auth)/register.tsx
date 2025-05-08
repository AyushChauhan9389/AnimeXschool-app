import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link, useLocalSearchParams } from 'expo-router';
import { AnyFieldApi, useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toast } from 'sonner-native';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import {
  TextInput,
  TextInputAdornment,
  TextInputProps,
} from '@/components/ui/TextInput';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { useRegisterUserMutation } from '@/hooks/api/useAuth';
import { Spinner } from '@/components/ui/Spinner';

export default function Register() {
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
              Create Account
            </Text>
            <Text textAlign="center">
              Create an account with your email and password.
            </Text>
          </View>

          <CreateAccountForm />

          <View />

          <View style={styles.flexRow}>
            <Text>Already have an account?</Text>
            <Link
              href={{
                pathname: '/sign-in',
                params: {
                  returnTo,
                },
              }}
              dismissTo
              asChild
            >
              <Pressable>
                <Text variant="labelMd" color="primary">
                  Login
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

const registerFormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(255, 'Too long'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const CreateAccountForm = () => {
  const { styles } = useStyles(stylesheet);

  const registerUserMutation = useRegisterUserMutation();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: registerFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (!value) {
        return;
      }
      registerUserMutation.mutate(
        {
          username: value.username,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success('Account created successfully');
            formApi.reset();
          },
        },
      );
    },
  });

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.form}>
      <Field
        name="username"
        children={field => (
          <View style={styles.field}>
            <TextInput
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              accessibilityLabel="Username"
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FieldError field={field} />
          </View>
        )}
      />
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
              autoCapitalize="none"
            />
            <FieldError field={field} />
          </View>
        )}
      />
      <Button disabled={registerUserMutation.isPending} onPress={handleSubmit}>
        <Spinner loading={registerUserMutation.isPending} colorStep="8" />
        <ButtonText>Register</ButtonText>
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
