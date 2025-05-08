import { useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import {
  AddressForm,
  AddressFormProps,
} from '@/components/features/user/AddressForm';
import { useAuthStore } from '@/stores/authStore';
import { Button, ButtonText } from '@/components/ui/Button';
import { useAddAddressMutation } from '@/hooks/api/useCustomer';
import { Spinner } from '@/components/ui/Spinner';

export default function Screen() {
  const { styles } = useStyles(stylesheet);

  const searchParams = useLocalSearchParams();
  const returnTo = searchParams?.returnTo as string | undefined;
  const router = useRouter();

  const addAddressMutation = useAddAddressMutation();

  const user = useAuthStore(state => state.user);

  const onSubmit = useCallback<NonNullable<AddressFormProps['onSubmit']>>(
    data => {
      if (!user || !data) {
        return;
      }
      addAddressMutation.mutate(data, {
        onSuccess: () => {
          if (returnTo) {
            router.dismissTo(returnTo as any);
          } else {
            router.back();
          }
        },
      });
    },
    [returnTo, router, addAddressMutation, user],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton disabled={addAddressMutation.isPending} />
        <Text variant="labelLg" highContrast>
          Add Address
        </Text>
      </View>
      <View style={styles.slot}>
        <AddressForm
          onSubmit={onSubmit}
          readOnly={addAddressMutation.isPending}
          children={handleSubmit => (
            <>
              <Button
                disabled={addAddressMutation.isPending}
                onPress={handleSubmit}
              >
                <Spinner loading={addAddressMutation.isPending} colorStep="8" />
                <ButtonText>Add Address</ButtonText>
              </Button>
            </>
          )}
        />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    paddingTop: rt.insets.top + space[8],
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    paddingHorizontal: space[16],
    paddingBottom: space[8],
  },
  slot: {
    flex: 1,
    paddingHorizontal: space[16],
    paddingTop: space[8],
  },
}));
