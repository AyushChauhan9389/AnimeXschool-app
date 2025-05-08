import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/RadioGroup';
import { PaymentMethodType, PaymentMethodsType } from '@/types/user';
import { View } from 'react-native';

type PaymentMethodsProps = {
  data: PaymentMethodsType;
  value: PaymentMethodType;
  onValueChange?: (paymentMethod: PaymentMethodType) => void;
};

const PaymentMethods = ({ data, onValueChange }: PaymentMethodsProps) => {
  const { styles } = useStyles(stylesheet);

  const handleValueChange = (id: string) => {
    const method = data.find(item => item.id === id);
    if (method) {
      onValueChange?.(method);
    }
  };

  return (
    <RadioGroup
      size="lg"
      defaultValue={data[0].id}
      onValueChange={handleValueChange}
      style={styles.group}
    >
      {data.map(({ id, description }) => {
        return (
          <RadioGroupItem key={id} value={id} style={styles.item}>
            <RadioGroupIndicator />
            <View style={styles.itemInner}>
              <Text variant="labelLg" textTransform="uppercase" highContrast>
                {id}
              </Text>
              <Text variant="bodySm">{description}</Text>
            </View>
          </RadioGroupItem>
        );
      })}
    </RadioGroup>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  group: {
    gap: space[12],
  },
  item: {
    flexDirection: 'row',
    gap: space[16],
    alignItems: 'center',
    padding: space[16],
    backgroundColor: colors.neutral3,
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
  itemInner: {
    flex: 1,
    gap: space[4],
  },
}));

export { PaymentMethods };
export type { PaymentMethodsProps };
