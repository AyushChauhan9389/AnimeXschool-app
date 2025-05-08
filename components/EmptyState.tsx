import { View, ViewProps } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, TextProps } from './ui/Text';

type EmptyStateProps = ViewProps;

const EmptyState = ({ style, ...restProps }: EmptyStateProps) => {
  const { styles } = useStyles(stylesheet);

  return <View style={[styles.container, style]} {...restProps} />;
};

type EmptyStateImageProps = ImageProps;

const EmptyStateImage = ({ style, ...restProps }: EmptyStateImageProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Image transition={300} style={[styles.image, style]} {...restProps} />
  );
};

type EmptyStateTitleProps = TextProps;

const EmptyStateTitle = (props: EmptyStateTitleProps) => {
  return (
    <Text variant="headingSm" textAlign="center" highContrast {...props} />
  );
};

type EmptyStateDescriptionProps = TextProps;

const EmptyStateDescription = (props: EmptyStateDescriptionProps) => {
  return <Text variant="bodyMd" textAlign="center" {...props} />;
};

type EmptyStateActionsProps = ViewProps;

const EmptyStateActions = ({ style, ...restProps }: EmptyStateActionsProps) => {
  const { styles } = useStyles(stylesheet);

  return <View style={[styles.actions, style]} {...restProps} />;
};

const stylesheet = createStyleSheet(({ space }) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[12],
    padding: space[16],
  },
  image: {
    width: 200,
    height: 200,
  },
  actions: {
    gap: space[12],
    marginTop: space[8],
  },
}));

export {
  EmptyState,
  EmptyStateImage,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
};
export type {
  EmptyStateProps,
  EmptyStateImageProps,
  EmptyStateTitleProps,
  EmptyStateDescriptionProps,
  EmptyStateActionsProps,
};
