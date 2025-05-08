import * as SecureStore from 'expo-secure-store';

import { AUTH_TOKEN_KEY } from '@/constants/auth';

export async function storeAuthToken(token: string) {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

export async function getAuthToken() {
  return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export async function removeAuthToken() {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}
