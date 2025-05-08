import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { BackButton } from '@/components/BackButton';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Text } from '@/components/ui/Text';
import { useOrders } from '@/hooks/api/useOrders';
import { CartListSkeleton } from '@/components/features/cart/CartListSkeleton';
import { OrderList } from '@/components/features/order/OrderList';

export default function OrdersScreen() {
  const { styles } = useStyles(stylesheet);

  const { data, isLoading, error, refetch, isRefetching } = useOrders();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text variant="labelLg" highContrast>
          My Orders
        </Text>
      </View>

      <View style={styles.slotContainer}>
        <AsyncBoundary
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          isRetrying={isRefetching}
          LoadingComponent={CartListSkeleton}
        >
          <OrderList
            data={data || []}
            onRefresh={refetch}
            refreshing={isRefetching}
          />
        </AsyncBoundary>
      </View>
    </View>
  );
}

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
}));
