import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginScreen from '../components/auth/LoginScreen';
import SignupScreen from '../components/auth/SignupScreen';
import UserProfileScreen from '../components/auth/UserProfileScreen';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <UserProfileScreen />
      ) : (
        <View style={styles.authContainer}>
          {isLoginMode ? (
            <LoginScreen onToggleMode={toggleAuthMode} />
          ) : (
            <SignupScreen onToggleMode={toggleAuthMode} />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authContainer: {
    flex: 1,
  },
});

export default ProfileScreen; 