import { View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import he from 'he';

import { Text } from '@/components/ui/Text';
import { Button, ButtonText } from '@/components/ui/Button';
import { capitalize, formatRupee } from '@/utils/formatters';
import { calculateOffPercentage } from '@/utils/product';
import { RS } from '@/constants/currency';
import type { Product } from '@/types/product';

type ProductMainDetailsProps = ViewProps & {
  product: Product;
};

const ProductMainDetails = ({
  product,
  style,
  ...restProps
}: ProductMainDetailsProps) => {
  const { styles } = useStyles(stylesheet);

  const stockStatus = product.stock_status;

  const offPercentage = calculateOffPercentage(
    product.price,
    product.regular_price,
  );

  return (
    <View style={[styles.mainDetailsContainer, style]} {...restProps}>
      <Text>{product.name}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={styles.priceContainer}>
          <Text variant="headingSm" fontFamily="interSemiBold" highContrast>
            {RS}
            {formatRupee(product.price)}
          </Text>
          {offPercentage > 0 && (
            <>
              <Text
                variant="labelMd"
                colorStep="10"
                style={styles.regularPrice}
              >
                {RS}
                {formatRupee(product.regular_price)}
              </Text>
              <Text
                variant="labelMd"
                color="green"
                style={styles.offPercentage}
              >
                {offPercentage}% Off
              </Text>
            </>
          )}
        </View>
        {stockStatus === 'instock' ? (
          <Text color="green" variant="labelSm">
            Available in stock
          </Text>
        ) : stockStatus === 'outofstock' ? (
          <Text color="red" variant="labelSm">
            Out of stock
          </Text>
        ) : null}
      </View>
    </View>
  );
};

type ProductCategoriesProps = ViewProps & {
  product: Product;
};

const ProductCategories = ({
  product,
  style,
  ...restProps
}: ProductCategoriesProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={[styles.rowContainer, style]} {...restProps}>
      {product.categories.map(category => (
        <Button key={category.id} color="neutralA" variant="soft" size="xs">
          <ButtonText>{capitalize(he.decode(category.name))}</ButtonText>
        </Button>
      ))}
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  mainDetailsContainer: {
    gap: space[8],
  },
  priceContainer: {
    flexDirection: 'row',
    gap: space[6],
    alignItems: 'baseline',
  },
  regularPrice: {
    textDecorationLine: 'line-through',
  },
  offPercentage: {
    letterSpacing: -0.5,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: space[8],
    flexWrap: 'wrap',
  },
}));

export { ProductMainDetails, ProductCategories };
export type { ProductMainDetailsProps, ProductCategoriesProps };
