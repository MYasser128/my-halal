import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator, I18nManager } from 'react-native';
import { User } from 'firebase/auth';
import { onAuthStateChange } from './src/services/auth';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import { AdminScreen } from './src/screens/AdminScreen';
import './src/i18n'; // Initialize i18n
import { isRTL } from './src/i18n';

type AuthScreen = 'login' | 'register';
type AppScreen = 'home' | 'scanner' | 'admin';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [currentLanguage, setCurrentLanguage] = useState('it');

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
    
      
      if (user) {
        // Create/update user profile and get the user with proper display name
        const { createUserProfile, getUserProfile } = await import('./src/services/auth');
        await createUserProfile(user);
        const userWithProfile = await getUserProfile(user);
        setUser(userWithProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Handle RTL support
  useEffect(() => {
    const isRTLMode = isRTL(currentLanguage);
    I18nManager.allowRTL(isRTLMode);
    I18nManager.forceRTL(isRTLMode);
  }, [currentLanguage]);

  const handleLogin = async (user: User) => {
    setUser(user);
    // Note: User profile is already created and updated in the login/register screens
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('home');
  };

  const switchToRegister = () => {
    setAuthScreen('register');
  };

  const switchToLogin = () => {
    setAuthScreen('login');
  };

  const navigateToScanner = () => {
    setCurrentScreen('scanner');
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
  };

  const navigateToAdmin = () => {
    setCurrentScreen('admin');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (user) {
    if (currentScreen === 'scanner') {
      return <ScannerScreen onBack={navigateToHome} user={user} />;
    }
    if (currentScreen === 'admin') {
      return <AdminScreen currentUserId={user.uid} onBack={navigateToHome} />;
    }
    return <HomeScreen user={user} onLogout={handleLogout} onNavigateToScanner={navigateToScanner} onNavigateToAdmin={navigateToAdmin} />;
  }

  return (
    <View style={styles.container}>
      {authScreen === 'login' ? (
        <LoginScreen onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterScreen onRegister={handleLogin} onSwitchToLogin={switchToLogin} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});