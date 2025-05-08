import React, { useCallback, useRef } from 'react';
import { ScrollView, View, ViewProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import {
  Button,
  ButtonIcon,
  ButtonProps,
  ButtonText,
} from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from '@/components/ui/Checkbox';
import { ProductFilter } from '@/types/product';
import { GetProductsParams } from '@/api/productsApi';

type ProductFiltersProps = ViewProps & {
  filters: ProductFilter[];
  selectedFilters: ProductFilter[];
  onApply?: (
    selectedFilters: ProductFilter[],
    filterQuery: NonNullable<GetProductsParams['filterQuery']>,
  ) => void;
  onClearAll?: () => void;
  triggerProps?: ButtonProps;
};

/**
 * Component for managing and applying product filters.
 *
 * This component provides a dialog-based interface for users to select and apply filters to a
 * product list. It maintains a reference state for selected filters to optimize performance and
 * avoid unnecessary re-renders. The component allows users to add or remove filter terms and
 * apply the selected filters, triggering a callback with the updated filter query.
 *
 * Props:
 * - filters: List of available product filters.
 * - selectedFilters: List of currently selected filters.
 * - onApply: Callback function invoked when filters are applied, providing the selected filters
 *   and the generated filter query.
 *
 * Usage:
 * - This component is used within a product listing page to allow users to filter products based
 *   on various attributes. It displays a dialog with checkboxes for each filter term, and users
 *   can select or deselect terms to modify the filter criteria.
 */
const ProductFilters = ({
  filters,
  selectedFilters,
  onApply,
  onClearAll,
  triggerProps,
  ...restProps
}: ProductFiltersProps) => {
  const { styles } = useStyles(stylesheet);

  // NOTE: Be careful with this ref state. It is used to avoid re-rendering and performance issues.
  // When modifying this ref state, be aware of potential memory leaks and ensure that the state
  // remains in sync with the parent state.
  const selectedFiltersRef = useRef<ProductFilter[]>(selectedFilters);

  const handleAddFilter = useCallback(
    (filter: ProductFilter, term: ProductFilter['terms'][0]) => {
      const existingFilter = selectedFiltersRef.current.find(
        item => item.id === filter.id,
      );

      if (existingFilter) {
        selectedFiltersRef.current = selectedFiltersRef.current.map(item => {
          if (item.id === filter.id) {
            return { ...item, terms: [...item.terms, term] };
          }
          return item;
        });
      } else {
        selectedFiltersRef.current = [
          ...selectedFiltersRef.current,
          { ...filter, terms: [term] },
        ];
      }
    },
    [],
  );

  const handleRemoveFilter = useCallback(
    (filter: ProductFilter, term: ProductFilter['terms'][0]) => {
      const existingFilter = selectedFiltersRef.current.find(
        item => item.id === filter.id,
      );
      // if it was the last term, remove the entire filter
      if (existingFilter?.terms.length === 1) {
        selectedFiltersRef.current = selectedFiltersRef.current.filter(
          item => item.id !== filter.id,
        );
      }
      selectedFiltersRef.current = selectedFiltersRef.current.map(item =>
        item.id === filter.id
          ? { ...item, terms: item.terms.filter(t => t.id !== term.id) }
          : item,
      );
    },
    [],
  );

  const handleApply = useCallback(() => {
    const selectedFilters = selectedFiltersRef.current;
    const filterQuery = generateFilterQuery(selectedFilters);

    onApply?.(selectedFilters, filterQuery);
  }, [onApply]);

  const handleClearAll = useCallback(() => {
    selectedFiltersRef.current = [];
    onClearAll?.();
  }, [onClearAll]);

  return (
    <View {...restProps}>
      <Dialog>
        <DialogTrigger
          as={Button}
          size="sm"
          variant="soft"
          color="neutral"
          {...triggerProps}
        >
          <ButtonIcon name="filter" />
          <ButtonText>Filters</ButtonText>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
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
            <ScrollView contentContainerStyle={styles.filtersScrollContainer}>
              {filters.map((filter, i) => (
                <View key={filter.id} style={styles.filter}>
                  <Text
                    variant="labelMd"
                    textTransform="capitalize"
                    highContrast
                  >
                    {filter.name}
                  </Text>
                  <View style={styles.terms}>
                    {filter.terms.map((term, i) => {
                      const selectedFilter = selectedFiltersRef.current.find(
                        item => item.id === filter.id,
                      );

                      const defaultChecked =
                        selectedFilter?.terms.some(
                          item => item.id === term.id,
                        ) || false;

                      return (
                        <Checkbox
                          key={term.id}
                          defaultChecked={defaultChecked}
                          size="md"
                          onCheckedChange={checked => {
                            if (checked) {
                              handleAddFilter(filter, term);
                            } else {
                              handleRemoveFilter(filter, term);
                            }
                          }}
                          style={styles.term}
                        >
                          <CheckboxIndicator style={{ width: 18, height: 18 }}>
                            <CheckboxIcon name="checkmark-sharp" size="sm" />
                          </CheckboxIndicator>
                          <Text variant="labelSm" textTransform="capitalize">
                            {term.name}
                          </Text>
                        </Checkbox>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Button Group */}
            <View style={styles.buttonGroup}>
              <DialogClose
                as={Button}
                color="neutral"
                variant="soft"
                fill
                accessibilityLabel="Clear all filters"
                onPress={handleClearAll}
              >
                <ButtonText>Clear All</ButtonText>
              </DialogClose>
              <DialogClose
                as={Button}
                fill
                accessibilityLabel="Apply filters"
                onPress={handleApply}
              >
                <ButtonText>Apply</ButtonText>
              </DialogClose>
            </View>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space, radius }) => ({
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogDescription: {
    marginBottom: space[20],
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
    gap: space[16],
  },
  filtersScrollContainer: {
    gap: space[24],
  },
  filter: {
    gap: space[12],
  },
  terms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[10],
  },
  term: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[8],
    padding: space[8],
    paddingHorizontal: space[10],
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: colors.neutral3,
  },
}));

// Hover on the filterQuery to get to know the format
function generateFilterQuery(
  filters: ProductFilter[],
): NonNullable<GetProductsParams['filterQuery']> {
  const attributeIds: string[] = [];
  const attributeTerms: string[] = [];

  for (const filter of filters) {
    const terms = filter.terms;

    if (terms.length === 0) {
      continue;
    }

    attributeIds.push(`attributeId=${filter.id}`);

    for (const term of terms) {
      attributeTerms.push(`attributeTerm=${term.id}`);
    }
  }

  return [attributeIds, attributeTerms].flat().join('&');
}

export { ProductFilters };
export type { ProductFiltersProps };
