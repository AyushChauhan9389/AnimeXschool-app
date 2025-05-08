import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { CartButton } from '@/components/CartButton';
import { HomeSlot } from '@/components/features/home/HomeSlot';

export default function Tab() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text
          fontSize={32}
          fontFamily="interDisplayExtraBold"
          color="neutral"
          inherit
          highContrast
        >
          L
          <Text color="primary" colorStep="9" inherit>
            K
          </Text>
        </Text>
        <Link href="/search" asChild>
          <Button
            style={{ justifyContent: 'flex-start' }}
            color="neutral"
            variant="soft"
            fill
          >
            <ButtonIcon name="search" />
            <ButtonText>Search for anything</ButtonText>
          </Button>
        </Link>
        <CartButton />
      </View>

      <View style={styles.slotContainer}>
        <HomeSlot />
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
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
  },
  slotContainer: {
    paddingTop: space[12],
    paddingHorizontal: space[16],
  },
}));
