import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import { useRefundRequests } from '@/hooks/api/useOrders';
import { RefundRequestList } from '@/components/features/order/RefundRequestList';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { Skeleton } from '@/components/ui/Skeleton';

export default function RefundRequestsScreen() {
  const { styles } = useStyles(stylesheet);

  const { data, isLoading, error, refetch, isRefetching } = useRefundRequests();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text variant="labelLg" highContrast>
          Refund Requests
        </Text>
      </View>
      <View style={styles.slotContainer}>
        <AsyncBoundary
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          isRetrying={isRefetching}
          LoadingComponent={LoadingComponent}
        >
          <RefundRequestList
            data={data || []}
            onRefresh={refetch}
            refreshing={isRefetching}
          />
        </AsyncBoundary>
      </View>
    </View>
  );
}

const LoadingComponent = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.group}>
      <Skeleton style={{ height: 110 }} />
      <Skeleton style={{ height: 110 }} />
      <Skeleton style={{ height: 110 }} />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.statusBar.height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[12],
  },
  slotContainer: {
    paddingTop: space[8],
    paddingHorizontal: space[16],
    gap: space[24],
  },
  group: {
    gap: space[16],
  },
}));
