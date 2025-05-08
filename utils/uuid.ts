import { randomUUID } from 'expo-crypto';

/**
 * Returns a random UUID (Universally Unique Identifier).
 * The UUID is generated using the `expo-crypto` library.
 * @return A string containing a newly generated UUIDv4 identifier
 */
export function uuid() {
  return randomUUID();
}
