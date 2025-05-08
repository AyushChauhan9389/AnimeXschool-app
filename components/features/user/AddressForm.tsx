import { ScrollViewProps, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { AnyFieldApi, formOptions, useForm } from '@tanstack/react-form';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { TextInput, TextInputAdornment } from '@/components/ui/TextInput';
import { SelectState } from '@/components/SelectState';
import { AddressWithoutId } from '@/types/user';
import { removeCountryCode } from '@/utils/formatters';
import { validatePostcode } from '@/utils/validators';

const formOpts = formOptions({
  defaultValues: {
    first_name: '',
    last_name: '',
    company: '',
    country: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    email: '',
  } as AddressWithoutId,
});

type AddressFormProps = Omit<ScrollViewProps, 'children'> & {
  defaultValues?: AddressWithoutId;
  /**
   * Make all fields readOnly (e.g. when submitting request)
   */
  readOnly?: boolean;
  onSubmit?: (data: AddressWithoutId) => void;
  children?:
    | React.ReactNode
    | ((handleSubmit: {
        (): Promise<void>;
        (submitMeta: unknown): Promise<void>;
      }) => React.ReactNode);
};

const AddressForm = ({
  children,
  defaultValues: defaultValuesProp,
  readOnly,
  onSubmit,
  contentContainerStyle,
  ...restProps
}: AddressFormProps) => {
  const { styles } = useStyles(stylesheet);

  const defaultValues = defaultValuesProp
    ? formatDefaultValues(defaultValuesProp)
    : {};

  const { Field, Subscribe, handleSubmit, ...form } = useForm({
    defaultValues: {
      ...formOpts,
      ...defaultValues,
      country: 'India',
    },
    onSubmit: async ({ value }) => {
      if (value) {
        onSubmit?.(value as AddressWithoutId);
      }
    },
  });

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.form, contentContainerStyle]}
      {...restProps}
    >
      <Field
        name="first_name"
        validators={{
          onChange: ({ value }) => requiredStringField(value),
        }}
        children={field => {
          return (
            <View style={styles.field}>
              <FieldLabel label="First Name" nativeId={field.name} />
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                accessibilityLabelledBy={field.name}
                readOnly={readOnly}
              />
              <FieldError field={field} />
            </View>
          );
        }}
      />

      <Field
        name="last_name"
        validators={{
          onChange: ({ value }) => requiredStringField(value),
        }}
        children={field => {
          return (
            <View style={styles.field}>
              <FieldLabel label="Last Name" nativeId={field.name} />
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                accessibilityLabelledBy={field.name}
                readOnly={readOnly}
              />
              <FieldError field={field} />
            </View>
          );
        }}
      />

      <Field
        name="country"
        validators={{
          onChange: ({ value }) => requiredStringField(value),
        }}
        children={field => {
          return (
            <View style={styles.field}>
              <FieldLabel label="Country" nativeId={field.name} />
              <TextInput
                value={field.state.value}
                accessibilityLabelledBy={field.name}
                readOnly={true}
              />
              <FieldError field={field} />
            </View>
          );
        }}
      />

      <Field
        name="address_1"
        validators={{
          onChange: ({ value }) => requiredStringField(value),
        }}
        children={field => {
          return (
            <View style={styles.field}>
              <FieldLabel label="Street Address 1" nativeId={field.name} />
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                accessibilityLabelledBy={field.name}
                readOnly={readOnly}
                autoComplete="street-address"
              />
              <FieldError field={field} />
            </View>
          );
        }}
      />

      <Field
        name="address_2"
        children={field => {
          return (
            <View style={styles.field}>
              <FieldLabel label="Street Address 2" nativeId={field.name} />
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                accessibilityLabelledBy={field.name}
                readOnly={readOnly}
                autoComplete="street-address"
              />
              <FieldError field={field} />
            </View>
          );
        }}
      />

      <Field
        name="city"
        validators={{
          onChange: ({ value }) => requiredStringField(value),
        }}
        children={field => {
          return (
            <View style={styles.field}>
              <FieldLabel label="City / Town" nativeId={field.name} />
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                accessibilityLabelledBy={field.name}
                readOnly={readOnly}
              />
              <FieldError field={field} />
            </View>
          );
        }}
      />

      <Field
        name="state"
        validators={{
          onChange: ({ value }) => {
            return requiredStringField(value);
          },
        }}
        children={field => {
          return (
            <View style={styles.field}>
              <FieldLabel label="State" nativeId={field.name} />
              <SelectState
                value={field.state.value}
                onValueChange={value => {
                  field.handleChange(value);
                  form.validateField('postcode', 'server');
                }}
                disabled={readOnly}
                onBlur={field.handleBlur}
              />
              <FieldError field={field} />
            </View>
          );
        }}
      />

      <Subscribe
        selector={state => state.values.state}
        children={state => {
          return (
            <Field
              name="postcode"
              validators={{
                onChange: ({ value }) => {
                  return validatePostcode(value, state);
                },
              }}
              children={field => {
                return (
                  <View style={styles.field}>
                    <FieldLabel label="Postcode / ZIP" nativeId={field.name} />
                    <TextInput
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      accessibilityLabelledBy={field.name}
                      readOnly={readOnly}
                      inputMode="numeric"
                      keyboardType="number-pad"
                      autoComplete="postal-code"
                    />
                    <FieldError field={field} />
                  </View>
                );
              }}
            />
          );
        }}
      />

      <Field
        name="phone"
        validators={{
          onChange: ({ value }) => validatePhone(value),
        }}
        children={field => {
          return (
            <View style={styles.field}>
              <FieldLabel label="Phone" nativeId={field.name} />
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                accessibilityLabelledBy={field.name}
                readOnly={readOnly}
                inputMode="numeric"
                keyboardType="number-pad"
                startAdornment={
                  <TextInputAdornment>
                    <Text highContrast>+91</Text>
                  </TextInputAdornment>
                }
              />
              <FieldError field={field} />
            </View>
          );
        }}
      />

      <Field
        name="email"
        validators={{
          onChange: ({ value }) => validateEmail(value),
        }}
        children={field => {
          return (
            <View style={styles.field}>
              <FieldLabel label="Email" nativeId={field.name} />
              <TextInput
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                accessibilityLabelledBy={field.name}
                readOnly={readOnly}
                inputMode="email"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <FieldError field={field} />
            </View>
          );
        }}
      />
      {typeof children === 'function' ? children(handleSubmit) : children}
    </KeyboardAwareScrollView>
  );
};

const FieldLabel = ({
  label,
  nativeId,
}: {
  label: string;
  nativeId?: string;
}) => {
  return (
    <Text nativeID={nativeId} variant="labelMd" highContrast>
      {label}
    </Text>
  );
};

const FieldError = ({ field }: { field: AnyFieldApi }) => {
  return field.state.meta.isTouched && field.state.meta.errors.length ? (
    <Text variant="bodySm" color="red">
      {field.state.meta.errors.join(', ')}
    </Text>
  ) : null;
};

function formatDefaultValues(data: AddressWithoutId) {
  const result: Partial<AddressWithoutId> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value) {
      if (key === 'phone') {
        // remove the country code, if present
        result[key] = removeCountryCode(value);
      } else {
        // @ts-expect-error
        result[key] = value;
      }
    }
  }
  return result;
}

function requiredStringField(value?: string) {
  if (!value) {
    return 'Required';
  } else if (value.length > 255) {
    return 'Too long';
  } else {
    return undefined;
  }
}

function validatePhone(value?: string) {
  if (!value) {
    return 'Required';
  }
  const regex = /^[1-9]\d{9}$/;
  return regex.test(value) ? undefined : 'Invalid phone number';
}

function validateEmail(value?: string) {
  if (!value) {
    return 'Required';
  }
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(value) ? undefined : 'Invalid email';
}

const stylesheet = createStyleSheet(({ space }, rt) => ({
  form: {
    gap: space[16],
    paddingBottom: rt.insets.bottom + space[16],
  },
  field: {
    gap: space[8],
  },
}));

export { AddressForm };
export type { AddressFormProps };
