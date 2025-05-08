import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link, useLocalSearchParams } from 'expo-router';

import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateTitle,
} from '@/components/EmptyState';
import { Button, ButtonText } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

export default function SuccessScreen() {
  const { styles } = useStyles(stylesheet);

  const { orderId } = useLocalSearchParams<{ orderId: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.slot}>
        {/* Success */}
        <EmptyState>
          <Icon name="bag-check" color="green" style={{ fontSize: 100 }} />
          <EmptyStateTitle>Order #{orderId}</EmptyStateTitle>
          <EmptyStateTitle>Thank you for ordering!</EmptyStateTitle>
          <EmptyStateDescription>
            Your order will be delivered soon. Thank you for choosing our app!
          </EmptyStateDescription>
          <EmptyStateActions>
            <Link href={`/orders/${orderId}`} replace asChild>
              <Button>
                <ButtonText>View Order</ButtonText>
              </Button>
            </Link>
          </EmptyStateActions>
        </EmptyState>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slot: {
    flex: 1,
    paddingHorizontal: space[16],
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
