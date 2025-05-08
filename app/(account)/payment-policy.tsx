import React from 'react';
import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import RenderHTML from 'react-native-render-html';

import { Text } from '@/components/ui/Text';
import { BackButton } from '@/components/BackButton';
import { PAYMENT_POLICY_HTML } from '@/constants/policiesHtml';

export default function PaymentPolicyScreen() {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text variant="labelLg" highContrast>
          Payment Policy
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.slotContainer}>
        <RenderHTML
          source={{ html: PAYMENT_POLICY_HTML }}
          tagsStyles={{
            body: {
              color: theme.colors.neutral12,
            },
          }}
        />
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
    paddingVertical: space[8],
  },
  slotContainer: {
    paddingTop: space[12],
    paddingHorizontal: space[16],
    paddingBottom: rt.insets.bottom + space[24],
    gap: space[24],
  },
}));
