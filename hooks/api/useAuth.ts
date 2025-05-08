import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner-native';

import {
  deleteAccount,
  forgotPassword,
  loginWithEmailAndPassword,
  registerUser,
  resetPassword,
  sendEmailVerificationOtp,
  sendOtp,
  verifyEmail,
  verifyOtp,
} from '@/api/authApi';
import { storeAuthToken } from '@/api/tokensApi';
import { useAuthStore } from '@/stores/authStore';
import { getErrorTitle } from '@/utils/formatters';
import { useRouter } from 'expo-router';

export const useSendOtpMutation = () => {
  return useMutation({
    mutationFn: sendOtp,
    onError: error => {
      toast.error(getErrorTitle(error), {
        description: error.message,
      });
    },
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: async ({ token }) => {
      // store token
      await storeAuthToken(token);
      // refresh auth state
      await useAuthStore.getState().initializeAuth();
    },
    onError: error => {
      toast.error(getErrorTitle(error), {
        description: error.message,
      });
    },
  });
};

export const useRegisterUserMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data, variables) => {
      // redirect to verify email screen
      router.push({
        pathname: '/verify-email',
        params: {
          email: variables.email,
          returnTo: '/account',
        },
      });
    },
    onError: error => {
      toast.error(getErrorTitle(error), {
        description: error.message,
      });
    },
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully');
    },
    onError: error => {
      toast.error(getErrorTitle(error), {
        description: error.message,
      });
    },
  });
};

export const useSendEmailVerificationOtpMutation = () => {
  return useMutation({
    mutationFn: sendEmailVerificationOtp,
    onError: error => {
      toast.error(getErrorTitle(error), {
        description: error.message,
      });
    },
  });
};

export const useLoginWithEmailAndPasswordMutation = (
  returnTo: string = '/account',
) => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginWithEmailAndPassword,
    onSuccess: async data => {
      // store token
      await storeAuthToken(data.token);
      // refresh auth state
      await useAuthStore.getState().initializeAuth();
    },
    onError: (error, variables) => {
      console.error('login error: ', error);
      // check if its email verification error
      // if its an email verification error, resendOtp will be present in the error response
      // it will be true if the user has not verified their email
      const isEmailVerificationError =
        (error as any)?.response?.data?.resendOtp === true;
      if (isEmailVerificationError) {
        // navigate to verify-account screen
        router.push({
          pathname: '/verify-account',
          params: {
            email: variables.email,
            returnTo,
          },
        });
      } else {
        toast.error(getErrorTitle(error), {
          description: error.message,
        });
      }
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onError: error => {
      toast.error(getErrorTitle(error), {
        description: error.message,
      });
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: error => {
      console.error('Error response: ', (error as any)?.response);
      toast.error(getErrorTitle(error), {
        description: error.message,
      });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      toast.success('Account deleted successfully');
      toast.promise(logout(), {
        loading: 'Logging out...',
        success: () => 'Logged out successfully',
        error: 'Error logging out',
      });
    },
    onError: error => {
      toast.error(getErrorTitle(error), {
        description: error.message,
      });
    },
  });
};
