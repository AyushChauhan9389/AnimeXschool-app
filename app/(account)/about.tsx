import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';

export default function AboutScreen() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text variant="labelLg" highContrast>
          About Us
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.slotContainer}>
        <Text>
          Lelekart, under the adept guidance of Kaushal Ranjeet Private Limited,
          is an Indian e-commerce pioneer committed to transforming fashion
          retail. We bleand style, quality, and affordability, offering an array
          of clothing that speaks to your individuality.
        </Text>
        <View />
        <Text variant="headingSm" highContrast>
          Why Shop With Us?
        </Text>
        <Text>
          <Text fontFamily="interBold" highContrast>
            Diverse Collection:{' '}
          </Text>
          Explore a world of fashion with our handpicked selections, from
          everyday essentials to statement pieces.
        </Text>
        <Text>
          <Text fontFamily="interBold" highContrast>
            Uncompromised Quality:{' '}
          </Text>
          Every product is a testament to superior quality, ensuring
          satisfaction and durability.
        </Text>
        <Text>
          <Text fontFamily="interBold" highContrast>
            Affordable Elegance:{' '}
          </Text>
          Fashion is for everyone. Our competitive prices makes style accessible
          to all.
        </Text>
        <Text>
          <Text fontFamily="interBold" highContrast>
            Seamless Shopping:{' '}
          </Text>
          Our intuitive website makes shopping a breeze, offering a streamlined
          browsing and purchasing process.
        </Text>
        <Text>
          <Text fontFamily="interBold" highContrast>
            Customer-first Approach:{' '}
          </Text>
          Your happiness is our mission. Our customer service team is always
          ready to assist with any queries or feedback.
        </Text>
        <Text>
          <Text fontFamily="interBold" highContrast>
            Prompt Delivery:{' '}
          </Text>
          Count on us for swift and dependable delivery throughout India.
        </Text>
      </ScrollView>
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
    alignItems: 'center',
    gap: space[12],
    paddingHorizontal: space[16],
    paddingVertical: space[4],
  },
  slotContainer: {
    paddingTop: space[12],
    paddingHorizontal: space[16],
    paddingBottom: rt.insets.bottom + space[24],
    gap: space[12],
  },
}));
