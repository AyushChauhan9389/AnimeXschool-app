import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icon';
import { useOrderEstimateDeliveryDate } from '@/hooks/api/useOrders';
import { Skeleton } from '@/components/ui/Skeleton';

const EstimatedDeliveryDate = ({ orderId }: { orderId: number }) => {
  const { styles } = useStyles(stylesheet);

  const { data, isLoading } = useOrderEstimateDeliveryDate(orderId);

  if (isLoading) {
    return <Skeleton style={{ width: '100%', height: 60 }} />;
  }

  if (!data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Icon name="time" size="2xl" color="green" />
      <Text highContrast>
        You order is arriving in{' '}
        <Text fontFamily="interMedium" inherit>
          {data.data.estimatedDeliveryDays} days
        </Text>
      </Text>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  container: {
    flexDirection: 'row',
    gap: space[12],
    alignItems: 'center',
    paddingHorizontal: space[16],
    paddingVertical: space[16],
    backgroundColor: colors.green3,
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
}));

export { EstimatedDeliveryDate };
