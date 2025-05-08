import axios from 'axios';

import { api } from '.';
import { User } from '@/types/user';

type SendOtpResponse = {
  success: boolean;
  message: string;
  user_exists: boolean;
};
/**
 * Send an OTP to the given phone number.
 *
 * `phoneNumber` must include the country code.
 */
export const sendOtp = async ({ phoneNumber }: { phoneNumber: string }) => {
  const { data } = await axios.post(
    'https://lelekart.com/wp-json/mobile-jwt-auth/v1/auth',
    {
      phone_number: phoneNumber,
    },
  );
  return data as SendOtpResponse;
};

type VerifyOtpResponse = {
  success: boolean;
  token: string;
};
/**
 * Verify the given OTP for the given phone number.
 *
 * `phoneNumber` must include the country code.
 *
 * Returns a token if the OTP is valid.
 * Returns an error message if the OTP is invalid.
 */
export const verifyOtp = async ({
  phoneNumber,
  otp,
}: {
  phoneNumber: string;
  otp: string;
}) => {
  const { data } = await axios.post(
    'https://lelekart.com/wp-json/mobile-jwt-auth/v1/verify',
    {
      phone_number: phoneNumber,
      otp,
    },
  );
  return data as VerifyOtpResponse;
};

type RegisterUserParams = {
  username: string;
  email: string;
  password: string;
};
export const registerUser = async (params: RegisterUserParams) => {
  const { data } = await api.post('/auth/register', params);
  return data as {
    message: string;
  };
};

export const verifyEmail = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const { data } = await api.post('/auth/verify-email', {
    email,
    otp,
  });
  return data;
};

export const sendEmailVerificationOtp = async ({
  email,
}: {
  email: string;
}) => {
  const { data } = await api.post('/auth/resend-verification', {
    email,
  });
  return data;
};

export const loginWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data } = await api.post('/auth/login', {
    username: email,
    password,
  });
  return data as {
    token: string;
    user_email: string;
  };
};

export const forgotPassword = async ({ email }: { email: string }) => {
  const { data } = await api.post('/auth/forgot-password', {
    email,
  });
  return data;
};

export const resetPassword = async ({
  email,
  otp,
  newPassword,
}: {
  email: string;
  otp: string;
  newPassword: string;
}) => {
  const { data } = await api.post('/auth/forgot-password/verify-otp', {
    email,
    otp,
    newPassword,
  });
  return data;
};

export const getUser = async () => {
  const { data } = await api.get('/auth/me');
  return data as User;
};

export const deleteAccount = async () => {
  const { data } = await api.delete('/auth/account');
  return data;
};
