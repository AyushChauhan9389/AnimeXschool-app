import { useCallback } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link } from 'expo-router';
import he from 'he';

import { Text } from '@/components/ui/Text';
import { Button, ButtonIcon } from '@/components/ui/Button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsTriggerText,
} from '@/components/ui/Tabs';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import {
  EmptyState,
  EmptyStateImage,
  EmptyStateTitle,
} from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useCategories, useSubCategories } from '@/hooks/api/useCategories';
import { Category } from '@/types/category';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export default function Tab() {
  const { styles, theme } = useStyles(stylesheet);

  const { data: categories, isLoading, error, refetch } = useCategories();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headingMd" highContrast>
          Categories
        </Text>

        <Link href="/search" asChild>
          <Button color="neutral" variant="soft" iconOnly>
            <ButtonIcon name="search" />
          </Button>
        </Link>
      </View>

      <View style={styles.slotContainer}>
        <AsyncBoundary
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          LoadingComponent={LoadingComponent}
        >
          {/* Categories Sidebar */}
          <Tabs
            defaultValue={categories?.[0]?.name}
            orientation="vertical"
            style={{ gap: theme.space[12] }}
          >
            <View style={styles.tabListContainer}>
              <TabsList
                as={ScrollView}
                contentContainerStyle={[
                  {
                    maxWidth: 100,
                  },
                ]}
                showsVerticalScrollIndicator={false}
              >
                {/* Render all categories triggers */}
                {categories?.length
                  ? categories?.map(category => (
                      <TabsTrigger
                        key={category.id}
                        value={category.name}
                        style={{
                          paddingHorizontal: theme.space[12],
                          paddingBottom: theme.space[10],
                        }}
                      >
                        <ImageWithFallback
                          source={category.image?.src}
                          alt={category.image?.alt}
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: theme.radius.full,
                          }}
                          fallbackSize={52}
                        />
                        <TabsTriggerText
                          variant="labelXs"
                          textTransform="capitalize"
                          textAlign="center"
                        >
                          {he.decode(category.name)}
                        </TabsTriggerText>
                      </TabsTrigger>
                    ))
                  : null}
              </TabsList>
            </View>

            {/* Render all categories content */}
            {categories?.map(category => (
              <CategoryContent key={category.id} category={category} />
            ))}
          </Tabs>
        </AsyncBoundary>
      </View>
    </View>
  );
}

const LoadingComponent = () => {
  const { theme } = useStyles();
  return (
    <View style={{ flex: 1, flexDirection: 'row', gap: theme.space[12] }}>
      {/* Left Side Tabs */}
      <Skeleton
        style={{
          marginBottom: theme.space[8],
          borderRadius: theme.radius.lg,
          flexShrink: 1,
          width: 100,
        }}
      />
      {/* Right Side Thumbnail */}
      <Skeleton
        style={{
          borderRadius: theme.radius.md,
          height: 200,
          flex: 1,
        }}
      />
    </View>
  );
};

type CategoryContentProps = {
  category: Category;
};
const CategoryContent = ({ category }: CategoryContentProps) => {
  const { styles, theme } = useStyles(stylesheet);

  const { data, isLoading, error, refetch } = useSubCategories(category.id);

  const subCategories = data?.data;

  const renderItem = useCallback(
    ({ item }: { item: Category }) => {
      return (
        <Link
          href={{
            pathname: '/category/[id]',
            params: {
              id: item.id,
              name: item.name,
              thumbnail: item.image?.src,
            },
          }}
          asChild
        >
          <Pressable style={styles.subCategoryButton}>
            <ImageWithFallback
              source={item.image?.src}
              alt={item.image?.alt}
              contentFit="cover"
              style={styles.subCategoryImage}
              fallbackSize={styles.subCategoryImage.height}
            />
            <Text
              variant="labelLg"
              textTransform="capitalize"
              highContrast
              style={{ flex: 1 }}
            >
              {he.decode(item.name)}
            </Text>
          </Pressable>
        </Link>
      );
    },
    [styles.subCategoryButton, styles.subCategoryImage],
  );

  return (
    <TabsContent value={category.name} style={{ flex: 1 }}>
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        LoadingComponent={() => (
          <Skeleton
            style={{
              borderRadius: theme.radius.md,
              flexShrink: 1,
              height: 200,
            }}
          />
        )}
      >
        <FlatList
          data={subCategories}
          keyExtractor={subCategory => subCategory.slug}
          renderItem={renderItem}
          contentContainerStyle={styles.subCategoriesList}
          ListHeaderComponent={
            <View style={styles.categoryHeader}>
              <ImageWithFallback
                source={category.image?.src}
                alt={category.image?.alt}
                transition={300}
                style={styles.categoryThumbnail}
                fallbackSize={styles.categoryThumbnail.height}
              />
              <Text variant="headingSm" textTransform="capitalize" highContrast>
                {he.decode(category.name)}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <EmptyState>
              <EmptyStateImage
                source={require('@/assets/images/animal-pana.png')}
              />
              <EmptyStateTitle>No sub categories</EmptyStateTitle>
            </EmptyState>
          }
        />
      </AsyncBoundary>
    </TabsContent>
  );
};

const stylesheet = createStyleSheet(({ colors, radius, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.insets.top + space[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space[12],
    paddingHorizontal: space[16],
  },
  slotContainer: {
    flex: 1,
    paddingTop: space[12],
    paddingHorizontal: space[12],
  },
  tabListContainer: {
    marginBottom: space[8],
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  tabsContent: {
    flex: 1,
    gap: space[16],
  },
  categoryHeader: {
    alignItems: 'center',
    gap: space[16],
  },
  categoryThumbnail: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
  subCategoriesList: {
    gap: space[16],
    paddingBottom: 80,
  },
  subCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    backgroundColor: colors.neutral3,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    padding: space[4],
  },
  subCategoryImage: {
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    width: 80,
    height: 80,
    backgroundColor: colors.neutralA3,
  },
}));
