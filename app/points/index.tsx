import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { BackButton } from '@/components/BackButton';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Text } from '@/components/ui/Text';
import { usePoints } from '@/hooks/api/usePoints';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/Alert';

export default function PointsScreen() {
  const { styles } = useStyles(stylesheet);

  const { data, isLoading, error, refetch, isRefetching } = usePoints();

  const points = data?.points?.points_balance;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text variant="labelLg" highContrast>
          My Points
        </Text>
      </View>

      <View style={styles.slotContainer}>
        <AsyncBoundary
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          isRetrying={isRefetching}
        >
          {points === undefined ? (
            <Text>Sorry, no points found</Text>
          ) : (
            <Text variant="headingSm" highContrast>
              You have{' '}
              <Text color="primary" inherit>
                {points}
              </Text>{' '}
              {points === 1 ? 'point' : 'points'}
            </Text>
          )}
          <PointsUsageInfo />
        </AsyncBoundary>
      </View>
    </View>
  );
}

const PointsUsageInfo = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.pointsUsageInfoContainer}>
      <Alert variant="soft" color="neutral">
        <AlertIcon name="information-circle" color="blue" />
        <AlertTitle>Points Usage</AlertTitle>
        <AlertDescription>
          You can use points to purchase items in your cart.
        </AlertDescription>
        <AlertDescription>
          You can redeem points for discounts on your orders.
        </AlertDescription>
      </Alert>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.insets.top + space[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[4],
  },
  slotContainer: {
    flex: 1,
    paddingTop: space[12],
    paddingHorizontal: space[16],
  },
  pointsUsageInfoContainer: {
    marginTop: space[16],
  },
}));
