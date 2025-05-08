import { ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Link, LinkProps, useRouter } from 'expo-router';

import { Text } from '@/components/ui/Text';
import { Button, ButtonText } from '@/components/ui/Button';
import {
  Avatar,
  AvatarFallback,
  AvatarIcon,
  AvatarImage,
} from '@/components/ui/Avatar';
import {
  SettingsList,
  SettingsListItem,
  SettingsListItemIcon,
  SettingsListItemTitle,
} from '@/components/ui/SettingsList';
import { Separator } from '@/components/ui/Separator';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { DeleteAccountDialog } from '@/components/features/auth/DeleteAccountDialog';
import { AppVersion } from '@/components/AppVersion';

const settngsList: { title: string; href: LinkProps['href'] }[] = [
  {
    title: 'About Us',
    href: '/about',
  },
  {
    title: 'Payment Policy',
    href: '/payment-policy',
  },
  {
    title: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    title: 'Refund and Cancellation',
    href: '/refund-cancellation-policy',
  },
  {
    title: 'Shipping and Returns',
    href: '/shipping-return-policy',
  },
];

export default function Tab() {
  const { styles } = useStyles(stylesheet);

  const router = useRouter();

  const { isAuthenticating, isAuthenticated, user, logout } = useAuthStore(
    state => ({
      isAuthenticated: state.isAuthenticated,
      isAuthenticating: state.isAuthenticating,
      user: state.user,
      logout: state.logout,
    }),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headingMd" highContrast>
          Account
        </Text>
      </View>

      {isAuthenticating ? (
        <LoadingComponent />
      ) : (
        <ScrollView>
          {/* Profile Header */}
          {user && (
            <View style={styles.profileHeader}>
              <Avatar color="neutralA" size="3xl">
                <AvatarImage source={{ uri: user.customerData?.avatar_url }} />
                <AvatarFallback>
                  <AvatarIcon name="person" />
                </AvatarFallback>
              </Avatar>

              <View>
                <Text variant="headingSm" highContrast>
                  {user.name}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.slotContainer}>
            <SettingsList>
              {isAuthenticated && (
                <>
                  <SecuredListItems />
                  <Separator />
                </>
              )}
              {settngsList.map((item, i) => (
                <SettingsListItem
                  key={i}
                  onPress={() => router.push(item.href)}
                >
                  <SettingsListItemTitle>{item.title}</SettingsListItemTitle>
                </SettingsListItem>
              ))}
              {isAuthenticated && (
                <>
                  <Separator />
                  <SettingsListItem color="red" onPress={logout}>
                    <SettingsListItemTitle>Logout</SettingsListItemTitle>
                    <SettingsListItemIcon
                      name="log-out-outline"
                      size="xl"
                      isEndIcon
                    />
                  </SettingsListItem>
                  <DeleteAccountDialog
                    triggerProps={{
                      style: { marginHorizontal: 16, marginVertical: 16 },
                    }}
                  />
                </>
              )}
            </SettingsList>

            {!isAuthenticated && (
              <Link
                href={{
                  pathname: '/sign-in',
                  params: {
                    returnTo: '/account',
                  },
                }}
                asChild
              >
                <Button style={{ marginHorizontal: 16 }}>
                  <ButtonText>Sign in</ButtonText>
                </Button>
              </Link>
            )}

            <View style={styles.appVersionContainer}>
              <AppVersion />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const SecuredListItems = () => {
  return (
    <>
      <Link href="/orders" asChild>
        <SettingsListItem>
          <SettingsListItemTitle>Orders</SettingsListItemTitle>
          <SettingsListItemIcon name="chevron-forward-outline" isEndIcon />
        </SettingsListItem>
      </Link>
      <Link href="/orders/refunds" asChild>
        <SettingsListItem>
          <SettingsListItemTitle>Refunds</SettingsListItemTitle>
          <SettingsListItemIcon name="chevron-forward-outline" isEndIcon />
        </SettingsListItem>
      </Link>
      <Link href="/user/addresses" asChild>
        <SettingsListItem>
          <SettingsListItemTitle>Addresses</SettingsListItemTitle>
          <SettingsListItemIcon name="chevron-forward-outline" isEndIcon />
        </SettingsListItem>
      </Link>
      <Link href="/points" asChild>
        <SettingsListItem>
          <SettingsListItemTitle>Points</SettingsListItemTitle>
        </SettingsListItem>
      </Link>
    </>
  );
};

const LoadingComponent = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.loadingContainer}>
      <View style={styles.profileHeader}>
        <Skeleton style={{ width: 100, height: 100, borderRadius: 50 }} />
        <Skeleton style={{ height: 24, width: 200 }} />
      </View>
      <Skeleton style={{ height: 44 }} />
      <Skeleton style={{ height: 44 }} />
      <Skeleton style={{ height: 44 }} />
      <Skeleton style={{ height: 44 }} />
      <Skeleton style={{ height: 44 }} />
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
    justifyContent: 'space-between',
    gap: space[12],
    paddingHorizontal: space[16],
  },
  profileHeader: {
    // flexDirection: 'row',
    alignItems: 'center',
    gap: space[16],
    paddingHorizontal: space[16],
    paddingVertical: space[20],
  },
  slotContainer: {
    paddingTop: space[12],
    gap: space[12],
    paddingBottom: space[44],
  },
  loadingContainer: {
    gap: space[12],
    paddingHorizontal: space[16],
  },
  appVersionContainer: {
    marginTop: space[12],
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
