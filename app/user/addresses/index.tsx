import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link } from 'expo-router';

import { BackButton } from '@/components/BackButton';
import { Text } from '@/components/ui/Text';
import { AddressList } from '@/components/features/user/AddressList';
import { Button, ButtonText } from '@/components/ui/Button';
import { AsyncBoundary } from '@/components/AsyncBoundary';
import { useAddresses } from '@/hooks/api/useCustomer';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Screen() {
  const { styles } = useStyles(stylesheet);

  const {
    data: addresses,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAddresses();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text variant="labelLg" highContrast>
          Addresses
        </Text>
      </View>

      <View style={styles.slot}>
        <AsyncBoundary
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          isRetrying={isRefetching}
          LoadingComponent={LoadingComponent}
        >
          {!addresses ? null : (
            <>
              <View style={styles.rowBetween}>
                <Text>
                  {addresses.length < 1 ? (
                    <View />
                  ) : addresses.length === 1 ? (
                    '1 saved address'
                  ) : (
                    `${addresses.length} saved addresses`
                  )}
                </Text>
                <Link href={'/user/addresses/add'} asChild>
                  <Button
                    color="blue"
                    size="md"
                    variant="plain"
                    style={{ paddingHorizontal: 0 }}
                  >
                    <ButtonText>Add address</ButtonText>
                  </Button>
                </Link>
              </View>
              <AddressList
                data={addresses}
                refreshing={isRefetching}
                onRefresh={refetch}
              />
            </>
          )}
        </AsyncBoundary>
      </View>
    </View>
  );
}

const LoadingComponent = () => {
  return (
    <View style={{ flex: 1, gap: 16, marginTop: 16 }}>
      <Skeleton style={{ width: '100%', height: 24 }} />
      <Skeleton style={{ width: '100%', height: 140 }} />
      <Skeleton style={{ width: '100%', height: 140 }} />
      <Skeleton style={{ width: '100%', height: 140 }} />
    </View>
  );
};

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: rt.insets.top + space[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    paddingHorizontal: space[16],
  },
  slot: {
    flex: 1,
    paddingHorizontal: space[16],
  },
  flex: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[8],
  },
}));
