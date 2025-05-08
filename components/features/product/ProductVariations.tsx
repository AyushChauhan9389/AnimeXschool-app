import { Fragment, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@/components/ui/Text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { ProductVariation } from '@/types/product';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';

type ProductAttribute = {
  id: number;
  name: string;
  options: string[];
};

type ProductVariationsProps = {
  variations: ProductVariation[];
  selectedVariation: ProductVariation;
  onApply: (variation: ProductVariation) => void;
};

const ProductVariations = ({
  variations,
  selectedVariation,
  onApply,
}: ProductVariationsProps) => {
  const { styles } = useStyles(stylesheet);

  const attributes = useMemo(() => {
    const attributesMap = new Map<number, ProductAttribute>();
    for (const variation of variations) {
      for (const attribute of variation.attributes) {
        const key = attribute.id;
        const mapItem = attributesMap.get(key);
        const options = mapItem?.options;

        if (!options) {
          attributesMap.set(key, {
            id: key,
            name: attribute.name,
            options: [attribute.option],
          });
          continue;
        }

        if (options.includes(attribute.option)) continue;

        attributesMap.set(key, {
          id: key,
          name: attribute.name,
          options: [...options, attribute.option],
        });
      }
    }
    return Array.from(attributesMap.values());
  }, [variations]);

  return (
    <Dialog>
      <DialogTrigger style={state => [styles.trigger(state.pressed)]}>
        {selectedVariation.attributes.map(({ id, name, option }, index) => {
          const options =
            attributes.find(item => item.id === id)?.options || [];
          const optionsLength = options.length;

          return (
            <Fragment key={id}>
              <View style={styles.triggerInner}>
                <View style={{ gap: 2 }}>
                  <Text textTransform="capitalize">{name}</Text>
                  <Text variant="labelMd" highContrast>
                    {option}
                  </Text>
                </View>
                {optionsLength - 1 > 0 && (
                  <Text color="primary">{optionsLength - 1} more</Text>
                )}
              </View>
              {selectedVariation.attributes.length - 1 !== index && (
                <Separator />
              )}
            </Fragment>
          );
        })}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          {/*
            Q. Why use different Content component?
            Ans. Because we don't want to keep state in this component.
                 By keeping state inside <DialogContent />, we will always
                 get fresh state when the dialog is opened.
          */}
          <ProductVariationsContent
            variations={variations}
            attributes={attributes}
            selectedVariation={selectedVariation}
            onApply={onApply}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

const ProductVariationsContent = ({
  variations,
  attributes,
  selectedVariation: selectedVariationProp,
  onApply,
}: {
  variations: ProductVariation[];
  attributes: ProductAttribute[];
  selectedVariation: ProductVariation;
  onApply: (variation: ProductVariation) => void;
}) => {
  const { styles } = useStyles(stylesheet);

  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(selectedVariationProp);

  const [selectedAttributes, setSelectedAttributes] = useState<
    {
      id: number;
      option: string;
    }[]
  >(selectedVariationProp.attributes);

  const updateSelectedVariation = useCallback(
    (selectedAttributes: { id: number; option: string }[]) => {
      let selectedVariation: ProductVariation | null = null;
      for (const variation of variations) {
        const variationAttributeOptions = variation.attributes.map(
          attr => attr.option,
        );
        const selectedAttributeOptions = selectedAttributes.map(
          attr => attr.option,
        );

        if (
          selectedAttributeOptions.length === 0 ||
          variationAttributeOptions.length === 0
        ) {
          continue;
        }

        if (
          variationAttributeOptions.every(option =>
            selectedAttributeOptions.includes(option),
          )
        ) {
          selectedVariation = variation;
          break;
        }
      }
      setSelectedVariation(selectedVariation);
    },
    [variations],
  );

  const handleSelectAttribute = useCallback(
    (id: number) => {
      return (option: string) => {
        const exists = selectedAttributes.find(item => item.id === id);
        if (exists) {
          const newAttributes = selectedAttributes.map(item =>
            item.id === id ? { id, option } : item,
          );

          setSelectedAttributes(newAttributes);

          updateSelectedVariation(newAttributes);
        } else {
          const newAttributes = [...selectedAttributes, { id, option }];
          setSelectedAttributes(newAttributes);

          updateSelectedVariation(newAttributes);
        }
      };
    },
    [updateSelectedVariation, selectedAttributes],
  );

  const handleApply = useCallback(() => {
    if (selectedVariation) {
      onApply(selectedVariation);
    }
  }, [selectedVariation, onApply]);

  return (
    <>
      <View style={styles.dialogHeader}>
        <DialogTitle>Select Variant</DialogTitle>
        <DialogClose
          as={Button}
          size="sm"
          variant="soft"
          color="neutral"
          iconOnly
        >
          <ButtonIcon name="close" />
        </DialogClose>
      </View>

      <View style={styles.attriubtesContainer}>
        {attributes.map(({ id, name, options }) => {
          const selectedValue = selectedAttributes?.find(
            item => item.id === id,
          );
          return (
            <View key={id} style={styles.attribute}>
              <Text variant="labelLg" textTransform="capitalize" highContrast>
                {name}
              </Text>

              {/* Options */}
              <RadioGroup
                value={selectedValue?.option}
                onValueChange={handleSelectAttribute(id)}
                style={styles.optionsContainer}
              >
                {options.map(option => {
                  const checked = selectedValue?.option === option;
                  return (
                    <RadioGroupItem
                      key={option}
                      value={option}
                      style={styles.option(checked)}
                    >
                      <Text
                        variant="labelSm"
                        color={checked ? 'primary' : 'neutral'}
                      >
                        {option.trim()}
                      </Text>
                    </RadioGroupItem>
                  );
                })}
              </RadioGroup>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {!selectedVariation && (
          <Text color="red" variant="bodySm">
            This combination doesn't exist. Choose another variant.
          </Text>
        )}
        <View style={styles.buttonGroup}>
          <DialogClose as={Button} color="neutral" variant="soft" fill>
            <ButtonText>Cancel</ButtonText>
          </DialogClose>
          <DialogClose
            as={Button}
            fill
            accessibilityLabel="Apply variant"
            disabled={!selectedVariation}
            onPress={handleApply}
          >
            <ButtonText>Apply</ButtonText>
          </DialogClose>
        </View>
      </View>
    </>
  );
};

const stylesheet = createStyleSheet(({ colors, radius, space }) => ({
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trigger: (pressed: boolean) => ({
    backgroundColor: pressed ? colors.neutral4 : colors.neutral3,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
  }),
  triggerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[12],
    padding: space[16],
    paddingHorizontal: space[20],
  },
  footer: {
    gap: space[12],
    marginTop: space[24],
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
    gap: space[16],
  },
  attriubtesContainer: {
    gap: space[24],
  },
  attribute: {
    gap: space[12],
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[12],
  },
  option: (checked: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space[10],
    paddingHorizontal: space[16],
    borderRadius: radius.md,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: checked ? colors.primary8 : colors.neutral7,
    backgroundColor: checked ? colors.transparent : colors.neutralA1,
  }),
}));

export { ProductVariations };
export type { ProductVariationsProps };
