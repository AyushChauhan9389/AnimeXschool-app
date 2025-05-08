/**
 * This component is only meant to be used in the main tab navigator
 */
import { Platform, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { NavigationRoute } from '@react-navigation/native';

import { Icon, IconProps } from './ui/Icon';
import { Text } from './ui/Text';

type MainBottomTabsParamList = {
  index: undefined;
  categories: undefined;
  cart: undefined;
  wishlist: undefined;
  account: undefined;
};

const CustomBottomTabBar = ({
  state,
  navigation,
  descriptors,
}: BottomTabBarProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        return (
          <TabButton
            key={route.key}
            navigation={navigation}
            options={options}
            route={
              route as NavigationRoute<
                MainBottomTabsParamList,
                keyof MainBottomTabsParamList
              >
            }
            isFocused={isFocused}
          />
        );
      })}
    </View>
  );
};

const iconNames: Record<keyof MainBottomTabsParamList, IconProps['name']> = {
  index: 'home',
  categories: 'grid',
  cart: 'cart',
  wishlist: 'heart',
  account: 'person',
};

const TabButton = ({
  isFocused,
  navigation,
  options,
  route,
}: {
  isFocused: boolean;
  navigation: BottomTabBarProps['navigation'];
  options: BottomTabNavigationOptions;
  route: NavigationRoute<
    MainBottomTabsParamList,
    keyof MainBottomTabsParamList
  >;
}) => {
  const { styles } = useStyles(stylesheet);

  // make sure manually that the icon's outline version exists
  const icon = isFocused
    ? iconNames[route.name]
    : ((iconNames[route.name] + '-outline') as IconProps['name']);
  const label = options.title || route.name;

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };
  return (
    <Pressable
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
    >
      <Icon
        name={icon}
        size="2xl"
        color={isFocused ? 'primary' : 'neutral'}
        colorStep={isFocused ? '9' : '11'}
      />
      <Text
        variant="labelXs"
        fontSize={11}
        color={isFocused ? 'primary' : 'neutral'}
        colorStep={isFocused ? '9' : '11'}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const stylesheet = createStyleSheet(({ colors, space }, rt) => ({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: rt.hairlineWidth,
    borderTopColor: colors.neutral6,
    paddingBottom: rt.navigationBar.height,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: space[2],
    paddingTop: space[8],
    paddingBottom: Platform.OS === 'ios' ? rt.insets.bottom : space[8],
  },
}));

export { CustomBottomTabBar };
