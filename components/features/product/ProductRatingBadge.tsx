import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Badge, BadgeIcon, BadgeProps, BadgeText } from '@/components/ui/Badge';
import { Text } from '@/components/ui/Text';

type ProductRatingBadgeProps = BadgeProps & {
  averageRating?: string;
  ratingCount?: number;
  showRatingCount?: boolean;
};

const ProductRatingBadge = ({
  averageRating,
  ratingCount,
  showRatingCount = true,
  ...badgeProps
}: ProductRatingBadgeProps) => {
  const { styles } = useStyles(stylesheet);

  const isAverageRatingAboveZero = averageRating
    ? parseFloat(averageRating) > 0
    : false;

  if (!averageRating || !isAverageRatingAboveZero || !ratingCount) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Badge color="yellow" size="lg" variant="surface" {...badgeProps}>
        <BadgeIcon name="star" />
        <BadgeText fontFamily="interSemiBold">
          {parseFloat(averageRating).toFixed(1)}
        </BadgeText>
      </Badge>
      {showRatingCount && (
        <Text>
          {ratingCount} {ratingCount > 1 ? 'reviews' : 'review'}
        </Text>
      )}
    </View>
  );
};

const stylesheet = createStyleSheet(({ space }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
}));

export { ProductRatingBadge };
export type { ProductRatingBadgeProps };
