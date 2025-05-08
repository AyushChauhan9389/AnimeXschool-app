import { OrderRefund } from '@/types/order';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { Badge, BadgeText } from '@/components/ui/Badge';
import { Color } from '@/styles/tokens';

type RefundRequestCardProps = {
  item: OrderRefund;
};

const RefundRequestCard = ({ item }: RefundRequestCardProps) => {
  const { styles } = useStyles(stylesheet);

  const requestedOn = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'short',
  }).format(new Date(item.createdAt));

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text variant="labelLg" highContrast>
            Order #{item.orderId}
          </Text>
          <Badge size="md" color={getBadgeColor(item.status)}>
            <BadgeText textTransform="capitalize">{item.status}</BadgeText>
          </Badge>
        </View>
        <Text variant="bodySm">Requested on {requestedOn}</Text>
      </View>
      <Text>
        <Text highContrast>Reason:</Text> {item.reason}
      </Text>
    </View>
  );
};

function getBadgeColor(status: OrderRefund['status']): Color {
  switch (status) {
    case 'PENDING':
      return 'blue';
    case 'COMPLETED':
      return 'green';
    case 'REJECTED':
      return 'red';
  }
}

const stylesheet = createStyleSheet(({ space, colors, radius }) => ({
  container: {
    gap: space[12],
    backgroundColor: colors.neutral3,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    padding: space[16],
    paddingHorizontal: space[20],
  },
  header: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[12],
  },
}));

export { RefundRequestCard };
export type { RefundRequestCardProps };
