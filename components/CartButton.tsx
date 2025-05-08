import { Link } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button, ButtonIcon, ButtonProps } from './ui/Button';
import { Badge, BadgeText } from './ui/Badge';
import { useAuthStore } from '@/stores/authStore';
import { useCartItemsCount } from '@/hooks/api/useCart';
import { useLocalCartItemsCount } from '@/stores/useLocalCartStore';

type CartButtonProps = Omit<ButtonProps, 'as' | 'children'>;

const CartButton = (props: CartButtonProps) => {
  const { styles } = useStyles(stylesheet);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const serverCartCount = useCartItemsCount();

  const localCartCount = useLocalCartItemsCount();

  const count = isAuthenticated ? serverCartCount : localCartCount;

  return (
    <Link href="/cart" asChild>
      <Button color="neutral" variant="soft" iconOnly {...props}>
        {count > 0 && (
          <Badge size="sm" style={styles.badge}>
            <BadgeText>{count}</BadgeText>
          </Badge>
        )}
        <ButtonIcon name="cart" />
      </Button>
    </Link>
  );
};

const stylesheet = createStyleSheet(({ space }) => ({
  badge: {
    position: 'absolute',
    top: -space[4],
    right: -space[4],
    zIndex: 2,
  },
}));

export { CartButton };
export type { CartButtonProps };
