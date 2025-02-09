import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import AppContainer from './navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RNBootSplash from 'react-native-bootsplash';

const App = () => {
  useEffect(() => {
    // Splash ekranını 2 saniye sonra gizle
    setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, ); // 2 saniye bekleme süresi
  }, []);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#101218' }} />
        <SafeAreaView style={styles.safeArea}>
          <AppContainer />
        </SafeAreaView>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101218', // Tüm ekranın rengini uygula
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'black', // SafeAreaView arka planı
  },
});

export default App;