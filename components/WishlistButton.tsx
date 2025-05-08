import { useCallback } from 'react';
import { GestureResponderEvent } from 'react-native';

import { Button, ButtonIcon, ButtonProps } from './ui/Button';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Product } from '@/types/product';

type WishlistButtonProps = ButtonProps & {
  item: Product;
};

const WishlistButton = ({
  item,
  onPress: onPressProp,
  ...restProps
}: WishlistButtonProps) => {
  const isAddedToWishlist = useWishlistStore(state =>
    state.items.some(i => i.id === item.id),
  );

  const addToWishlist = useWishlistStore(state => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    state => state.removeFromWishlist,
  );

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      if (isAddedToWishlist) {
        removeFromWishlist(item.id);
      } else {
        addToWishlist(item);
      }

      onPressProp?.(e);
    },
    [addToWishlist, isAddedToWishlist, item, removeFromWishlist, onPressProp],
  );

  return (
    <Button
      color="neutralA"
      variant="soft"
      size="sm"
      iconOnly={true}
      onPress={handlePress}
      {...restProps}
    >
      <ButtonIcon
        name={isAddedToWishlist ? 'heart' : 'heart-outline'}
        color={isAddedToWishlist ? 'primary' : 'neutral'}
      />
    </Button>
  );
};

export { WishlistButton };
export type { WishlistButtonProps };
