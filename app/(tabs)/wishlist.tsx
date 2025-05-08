import { View } from 'react-native';
import { Link } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useWishlistStore } from '@/stores/wishlistStore';
import { WishlistCard } from '@/components/WishlistCard';
import { Button, ButtonText } from '@/components/ui/Button';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateImage,
  EmptyStateTitle,
} from '@/components/EmptyState';

export default function WishlistScreen() {
  const { styles } = useStyles(stylesheet);

  const items = useWishlistStore(state => state.items);
  const clearWishlist = useWishlistStore(state => state.clearWishlist);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headingMd" highContrast>
          Wishlist
        </Text>
        {items.length > 0 && (
          <Button
            color="neutral"
            variant="soft"
            size="sm"
            onPress={clearWishlist}
          >
            <ButtonText>Clear All</ButtonText>
          </Button>
        )}
      </View>

      <View style={styles.slotContainer}>
        <Animated.FlatList
          data={items}
          keyExtractor={item => item.slug}
          renderItem={({ item }) => <WishlistCard product={item} />}
          itemLayoutAnimation={LinearTransition}
          numColumns={1}
          contentContainerStyle={{
            paddingBottom: 16,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState>
              <EmptyStateImage
                source={require('@/assets/images/animal-pana.png')}
              />
              <EmptyStateTitle>Your wishlist is empty</EmptyStateTitle>
              <EmptyStateDescription>
                Add items to your wishlist to view them here
              </EmptyStateDescription>
              <EmptyStateActions>
                <Link href={'/'} asChild>
                  <Button>
                    <ButtonText>Browse products</ButtonText>
                  </Button>
                </Link>
              </EmptyStateActions>
            </EmptyState>
          }
        />
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
    justifyContent: 'space-between',
    gap: space[12],
    paddingHorizontal: space[16],
  },
  slotContainer: {
    flex: 1,
    paddingTop: space[12],
    paddingHorizontal: space[16],
  },
}));
