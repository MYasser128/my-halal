import { StatusBar } from "expo-status-bar";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  I18nManager,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import mobileAds from "react-native-google-mobile-ads";
import "./src/i18n"; // Initialize i18n
import { isRTL } from "./src/i18n";
import { AdminScreen } from "./src/screens/AdminScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import ScannerScreen from "./src/screens/ScannerScreen";
import { logout, onAuthStateChange } from "./src/services/auth";

type AuthScreen = "login" | "register";
type AppScreen = "home" | "scanner" | "admin" | "login" | "register";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [navigationHistory, setNavigationHistory] = useState<AppScreen[]>([
    "home",
  ]);

  useEffect(() => {
    // Initialize Google Mobile Ads
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        // Initialization complete!
        console.log("Mobile Ads initialized successfully");
      })
      .catch((error) => {
        console.error("Mobile Ads initialization failed:", error);
      });

    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // Create/update user profile and get the user with proper display name
        const { createUserProfile, getUserProfile } = await import(
          "./src/services/auth"
        );
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

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === "android") {
        // If we're on home screen, show exit confirmation
        if (currentScreen === "home") {
          Alert.alert("Exit App", "Are you sure you want to exit the app?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "Exit",
              onPress: () => BackHandler.exitApp(),
            },
          ]);
          return true; // Prevent default behavior
        }

        // If there's navigation history, go back
        if (navigationHistory.length > 1) {
          const newHistory = [...navigationHistory];
          newHistory.pop(); // Remove current screen
          const previousScreen = newHistory[newHistory.length - 1];
          setNavigationHistory(newHistory);
          setCurrentScreen(previousScreen);
          return true; // Prevent default behavior
        }
      }
      return false; // Allow default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [currentScreen, navigationHistory]);

  const handleLogin = async (user: User) => {
    setUser(user);
    // Note: User profile is already created and updated in the login/register screens
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
    setCurrentScreen("home");
    setNavigationHistory(["home"]);
  };

  const switchToRegister = () => {
    setAuthScreen("register");
    setCurrentScreen("register");
    setNavigationHistory((prev) => [...prev, "register"]);
  };

  const switchToLogin = () => {
    setAuthScreen("login");
    setCurrentScreen("login");
    setNavigationHistory((prev) => [...prev, "login"]);
  };

  const navigateToScanner = () => {
    setCurrentScreen("scanner");
    setNavigationHistory((prev) => [...prev, "scanner"]);
  };

  const navigateToHome = () => {
    setCurrentScreen("home");
    setNavigationHistory((prev) => [...prev, "home"]);
  };

  const navigateToAdmin = () => {
    setCurrentScreen("admin");
    setNavigationHistory((prev) => [...prev, "admin"]);
  };

  const navigateToLogin = () => {
    setCurrentScreen("login");
    setNavigationHistory((prev) => [...prev, "login"]);
  };

  const navigateToRegister = () => {
    setCurrentScreen("register");
    setNavigationHistory((prev) => [...prev, "register"]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Always show Home as default, with different content based on auth state
  if (currentScreen === "scanner") {
    return (
      <ScannerScreen
        onBack={navigateToHome}
        user={user}
        onNavigateToLogin={navigateToLogin}
      />
    );
  }
  if (currentScreen === "admin" && user) {
    return <AdminScreen currentUserId={user.uid} onBack={navigateToHome} />;
  }
  if (currentScreen === "login") {
    return (
      <View style={styles.container}>
        <LoginScreen
          onLogin={handleLogin}
          onSwitchToRegister={switchToRegister}
          onBackToHome={navigateToHome}
        />
        <StatusBar style="auto" />
      </View>
    );
  }
  if (currentScreen === "register") {
    return (
      <View style={styles.container}>
        <RegisterScreen
          onRegister={handleLogin}
          onSwitchToLogin={switchToLogin}
          onBackToHome={navigateToHome}
        />
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
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
});
