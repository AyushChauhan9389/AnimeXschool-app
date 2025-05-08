import * as Application from 'expo-application';

import { Text } from './ui/Text';

const AppVersion = () => {
  const version = Application.nativeApplicationVersion;
  if (!version) {
    return null;
  }
  return <Text variant="bodySm">Lelekart Mobile v{version}</Text>;
};

export { AppVersion };
