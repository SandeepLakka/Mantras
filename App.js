import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Player from './Player';
export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.topBorder}>
      </View>
      <StatusBar style='light'/>
      <Player/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
