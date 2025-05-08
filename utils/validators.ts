import { indiaTerritories } from '@/constants/india';

export function validateOtp(value: string) {
  const regex = /^\d{6}$/;
  return regex.test(value) ? undefined : 'Invalid OTP. Must be 6 digits.';
}

/**
 * Validation rules:
 * - first 3 digits must match the prefix of the state
 * - must be 6 digits
 * - returns an error message if the postcode is invalid
 */
export function validatePostcode(value?: string, state?: string) {
  if (!value) {
    return 'Required';
  }

  const findState = indiaTerritories.find(item => item.state === state);
  if (!findState) {
    return 'Invalid state or postcode';
  }
  if (
    !(findState.prefixes as unknown as string[]).includes(value.substring(0, 3))
  ) {
    return 'Invalid postcode';
  }
  const regex = /^\d{6}$/;
  return regex.test(value) ? undefined : 'Invalid postcode. Must be 6 digits.';
}
