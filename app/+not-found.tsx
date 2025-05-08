import { Link, Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { Button, ButtonText } from '@/components/ui/Button';

export default function NotFoundScreen() {
  const { styles } = useStyles(stylesheet);
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text variant="headingSm">This screen doesn't exist.</Text>
        <Button variant="plain" onPress={router.back}>
          <ButtonText>Go Back</ButtonText>
        </Button>
        <Link href="/" asChild>
          <Button variant="plain">
            <ButtonText>Go to Home screen!</ButtonText>
          </Button>
        </Link>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet(({ colors, space }) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space[20],
    backgroundColor: colors.background,
  },
}));
