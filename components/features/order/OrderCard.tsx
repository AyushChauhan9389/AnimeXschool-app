import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { Order } from '@/types/order';
import { Badge, BadgeText } from '@/components/ui/Badge';
import { RS } from '@/constants/currency';
import { getOrderStatusBadgeColor } from '@/utils/order';
import { formatRupee } from '@/utils/formatters';

type OrderCardProps = {
  item: Order;
};

const OrderCard = ({ item }: OrderCardProps) => {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();

  const orderNumber = item.number;

  const placedOnDate = new Date(item.date_created);

  const status = item.status;

  const placedOn = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'short',
  }).format(placedOnDate);

  const lineItems = item.line_items;

  const handlePress = () => {
    router.push(`/orders/${item.id}`);
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text variant="labelLg" highContrast>
            Order #{orderNumber}
          </Text>
          <Badge size="md" color={getOrderStatusBadgeColor(status)}>
            <BadgeText textTransform="capitalize">{status}</BadgeText>
          </Badge>
        </View>
        <Text variant="bodySm">Placed on {placedOn}</Text>
      </View>

      {/* Line Items */}
      <View style={styles.group}>
        {lineItems.map((lineItem, i) => {
          return (
            <View key={i} style={styles.lineItem}>
              <Text
                variant="bodySm"
                numberOfLines={1}
                lineBreakMode="tail"
                highContrast
                style={{ flex: 1 }}
              >
                {lineItem.name}
              </Text>
              <Text>&times; {lineItem.quantity}</Text>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.lineItem}>
        <Text variant="labelMd" highContrast>
          Total
        </Text>
        <Text variant="labelMd" highContrast>
          {RS}
          {formatRupee(item.total)}
        </Text>
      </View>
    </Pressable>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
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
  group: {
    gap: space[4],
  },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space[16],
  },
  rowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
  },
}));

export { OrderCard };
export type { OrderCardProps };
