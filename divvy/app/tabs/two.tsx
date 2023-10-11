import { StyleSheet } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from 'react-native'
export default function TabTwoScreen() {
  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-xl font-bold'>Tab Two</Text>
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
