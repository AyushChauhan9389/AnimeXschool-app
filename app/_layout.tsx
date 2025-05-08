import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SystemBars } from 'react-native-edge-to-edge';
import * as Network from 'expo-network';
import { UnistylesProvider } from 'react-native-unistyles';
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Toaster } from 'sonner-native';
import 'react-native-reanimated';
import '@/styles/unistyles';
import { useWishlistStore } from '@/stores/wishlistStore';
import { PortalProvider } from '@/components/ui/Portal';
import { useAuthStore } from '@/stores/authStore';
import { useLocalCartStore } from '@/stores/useLocalCartStore';
import { useRefetchOnAppFocus } from '@/hooks/useRefetchOnAppFocus';
import { NetworkStatusBanner } from '@/components/NetworkStatusBanner';

onlineManager.setEventListener(setOnline => {
  const eventSubscription = Network.addNetworkStateListener(state => {
    setOnline(!!state.isInternetReachable);
  });
  return eventSubscription.remove;
});

const queryClient = new QueryClient();

const hydrateLocalCartStore = useLocalCartStore.persist.rehydrate;
const hydrateWishlistStore = useWishlistStore.persist.rehydrate;
const initializeAuth = useAuthStore.getState().initializeAuth;

export default function RootLayout() {
  useRefetchOnAppFocus();

  useEffect(() => {
    initializeAuth();
    hydrateLocalCartStore();
    hydrateWishlistStore();
  }, []);

  return (
    <UnistylesProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <KeyboardProvider>
            <PortalProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <SystemBars style="auto" />
              <NetworkStatusBanner />
            </PortalProvider>
            <Toaster duration={1500} closeButton />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </UnistylesProvider>
  );
}
