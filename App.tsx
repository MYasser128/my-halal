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
type AppScreen = 'home' | 'scanner' | 'admin' | 'login' | 'register';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [currentLanguage, setCurrentLanguage] = useState('en');

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
    setCurrentScreen('register');
  };

  const switchToLogin = () => {
    setAuthScreen('login');
    setCurrentScreen('login');
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

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  const navigateToRegister = () => {
    setCurrentScreen('register');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Always show Home as default, with different content based on auth state
  if (currentScreen === 'scanner') {
    return <ScannerScreen onBack={navigateToHome} user={user} onNavigateToLogin={navigateToLogin} />;
  }
  if (currentScreen === 'admin' && user) {
    return <AdminScreen currentUserId={user.uid} onBack={navigateToHome} />;
  }
  if (currentScreen === 'login') {
    return (
      <View style={styles.container}>
        <LoginScreen onLogin={handleLogin} onSwitchToRegister={switchToRegister} onBackToHome={navigateToHome} />
        <StatusBar style="auto" />
      </View>
    );
  }
  if (currentScreen === 'register') {
    return (
      <View style={styles.container}>
        <RegisterScreen onRegister={handleLogin} onSwitchToLogin={switchToLogin} onBackToHome={navigateToHome} />
        <StatusBar style="auto" />
      </View>
    );
  }

  // Default Home screen (shows for both authenticated and non-authenticated users)
  return (
    <View style={styles.container}>
      <HomeScreen 
        user={user} 
        onLogout={handleLogout} 
        onNavigateToScanner={navigateToScanner} 
        onNavigateToAdmin={navigateToAdmin}
        onNavigateToLogin={navigateToLogin}
      />
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