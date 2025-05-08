import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/authStore';

const AuthLayout = () => {
  const { styles } = useStyles(stylesheet);

  const { isAuthenticating, isAuthenticated } = useAuthStore(state => ({
    isAuthenticating: state.isAuthenticating,
    isAuthenticated: state.isAuthenticated,
  }));

  if (isAuthenticating) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Spinner />
          <Text>Just a moment...</Text>
        </View>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Stack screenOptions={{ headerShown: false }} />;
  }

  return <AuthScreen />;
};

const AuthScreen = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.replace({
      pathname: '/(auth)/sign-in',
      params: { returnTo: pathname },
    });
  }, [router, pathname]);

  return null;
};

const stylesheet = createStyleSheet(({ colors, space }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: space[16],
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: space[12],
  },
}));

export { AuthLayout };
