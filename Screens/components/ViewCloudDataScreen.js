import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export default function ViewCloudDataScreen( navigation ) {
  fileUri = navigation.route.params.fileUrl
  return (
    <WebView
      style={styles.container}
      source={{ uri: fileUri }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
