import { NavigationIndependentTree } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './components/SplashScreen';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext';
import { TabNavigator } from './navigation/TabNavigator';

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  const handleSplashComplete = () => {
    setIsSplashComplete(true);
  };

  return (
    <SafeAreaProvider>
      <FirebaseAuthProvider>
        {!isSplashComplete ? (
          <SplashScreen onAnimationComplete={handleSplashComplete} />
        ) : (
          <NavigationIndependentTree>
            <TabNavigator />
          </NavigationIndependentTree>
        )}
      </FirebaseAuthProvider>
    </SafeAreaProvider>
  );
}
