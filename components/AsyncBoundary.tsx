import React from 'react';
import { View } from 'react-native';

import { Button, ButtonText } from './ui/Button';
import { Spinner } from './ui/Spinner';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateImage,
  EmptyStateTitle,
} from './EmptyState';
import { getErrorTitle } from '@/utils/formatters';

type ErrorComponentProps = {
  error: Error;
  onRetry?: () => void;
  isRetrying?: boolean;
};

type AsyncBoundaryProps = {
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
  isRetrying?: boolean;
  children: React.ReactNode;
  LoadingComponent?: React.FC;
  ErrorComponent?: React.FC<ErrorComponentProps>;
};

const AsyncBoundary = ({
  isLoading,
  error,
  onRetry,
  isRetrying,
  children,
  LoadingComponent = DefaultLoadingComponent,
  ErrorComponent = DefaultErrorComponent,
}: AsyncBoundaryProps) => {
  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return (
      <ErrorComponent error={error} onRetry={onRetry} isRetrying={isRetrying} />
    );
  }

  return <>{children}</>;
};

const DefaultLoadingComponent = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <Spinner size="lg" />
    </View>
  );
};

const DefaultErrorComponent = ({
  error,
  onRetry,
  isRetrying,
}: ErrorComponentProps) => (
  <EmptyState>
    <EmptyStateImage source={require('@/assets/images/animal-pana.png')} />
    <EmptyStateTitle>{getErrorTitle(error)}</EmptyStateTitle>
    <EmptyStateDescription>{error.message}</EmptyStateDescription>
    {onRetry && (
      <EmptyStateActions>
        <Button disabled={isRetrying} onPress={onRetry}>
          <Spinner loading={isRetrying ?? false} colorStep="8" />
          <ButtonText>Retry</ButtonText>
        </Button>
      </EmptyStateActions>
    )}
  </EmptyState>
);

export { AsyncBoundary };
export type { AsyncBoundaryProps };
