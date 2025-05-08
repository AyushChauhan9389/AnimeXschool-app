import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Address } from '@/types/user';
import { useAddresses } from '@/hooks/api/useCustomer';
import { Spinner } from '@/components/ui/Spinner';

// TIP: use `Href` type from expo-router lib to get it correct
const THIS_SCREEN_ROUTE = '/checkout';

export default function CheckoutScreen() {
  const { styles } = useStyles(stylesheet);

  const user = useAuthStore(state => state.user);

  const { data: addresses, isLoading, isRefetching } = useAddresses();

  if (!user) {
    return (
      <Redirect
        href={{
          pathname: '/login-with-otp',
          params: {
            returnTo: THIS_SCREEN_ROUTE,
          },
        }}
      />
    );
  }

  if (isLoading || isRefetching) {
    return (
      <View style={styles.container}>
        <Spinner />
      </View>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <Redirect
        href={{
          pathname: '/user/addresses/add',
          params: {
            returnTo: THIS_SCREEN_ROUTE,
          },
        }}
      />
    );
  }

  const defaultAddress = addresses[addresses.length - 1];

  if (!hasCompleteAddress(defaultAddress)) {
    return (
      <Redirect
        href={{
          pathname: '/user/addresses/add',
          params: {
            returnTo: THIS_SCREEN_ROUTE,
          },
        }}
      />
    );
  }

  return <Redirect href={'/checkout/payment'} />;
}

function hasCompleteAddress(address: Address) {
  // check if all field is filled in the address object, except for optional
  const optionalKeys: (keyof Address)[] = ['company', 'address_2'];
  let result = true;
  for (const k in address) {
    const key = k as keyof Address;
    if (optionalKeys.includes(key)) {
      continue;
    }
    let value = address[key];
    if (!value) {
      result = false;
      break;
    } else {
      result = true;
    }
  }
  return result;
}

const stylesheet = createStyleSheet(({ colors }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
}));
