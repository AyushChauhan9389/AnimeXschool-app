import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

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
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/RadioGroup';
import { Text } from '@/components/ui/Text';
import { ProductSortFilter } from '@/types/product';

// Value follows this syntax: `orderby:order`
// e.g. filter = { order: 'desc', orderby: 'price' }, value = 'price:desc'
const sortFilters: { label: string; value: string }[] = [
  {
    label: 'Newest',
    value: 'date:desc',
  },
  {
    label: 'Popularity',
    value: 'popularity:desc',
  },
  {
    label: 'Price: Low to High',
    value: 'price:asc',
  },
  {
    label: 'Price: High to Low',
    value: 'price:desc',
  },
];

type ProductSortProps = {
  sortFilter: ProductSortFilter;
  onSortFilterChange: (sortFilter: ProductSortFilter) => void;
};

const ProductSort = ({ sortFilter, onSortFilterChange }: ProductSortProps) => {
  const { styles } = useStyles(stylesheet);

  const [open, setOpen] = useState(false);

  const selectedValue = getValueFromSortFilter(sortFilter);

  const handleValueChange = useCallback(
    (value: string) => {
      onSortFilterChange?.(getSortFilterFromValue(value));
      setOpen(false);
    },
    [onSortFilterChange],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger as={Button} size="sm" color="neutral" variant="soft">
        <ButtonText>Sort By</ButtonText>
        <ButtonIcon name="chevron-down" />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent minWidth={300}>
          <View style={styles.dialogHeader}>
            <DialogTitle>Filters</DialogTitle>
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

          {/* Filters */}
          <RadioGroup value={selectedValue} onValueChange={handleValueChange}>
            {sortFilters.map(filter => (
              <RadioGroupItem
                key={filter.value}
                value={filter.value}
                style={state => [
                  styles.radioGroupItem(
                    state.pressed,
                    filter.value === selectedValue,
                  ),
                ]}
              >
                <RadioGroupIndicator />
                <Text variant="labelMd" highContrast>
                  {filter.label}
                </Text>
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioGroupItem: (pressed: boolean, selected: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    padding: space[16],
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: pressed || selected ? colors.neutral3 : colors.transparent,
  }),
}));

function getValueFromSortFilter(filter: ProductSortFilter) {
  return `${filter.orderby}:${filter.order}`;
}
function getSortFilterFromValue(value: string): ProductSortFilter {
  const [orderby, order] = value.split(':') as [
    ProductSortFilter['orderby'],
    ProductSortFilter['order'],
  ];
  return {
    order,
    orderby,
  };
}

export { ProductSort };
export type { ProductSortProps };
