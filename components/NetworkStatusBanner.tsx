import { useEffect, useRef } from 'react';
import { useNetworkState } from 'expo-network';
import { toast } from 'sonner-native';

const NetworkStatusBanner = () => {
  const { isInternetReachable } = useNetworkState();

  const timeoutRef = useRef<NodeJS.Timeout>();
  const toastIdRef = useRef<string | number>();

  useEffect(() => {
    if (isInternetReachable) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    } else {
      timeoutRef.current = setTimeout(() => {
        toastIdRef.current = toast.error('No internet connection', {
          description: 'Please check your internet connection',
          duration: Infinity,
        });
      }, 5000); // Show after 5 seconds of no internet
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [isInternetReachable]);

  return null;
};

export { NetworkStatusBanner };
