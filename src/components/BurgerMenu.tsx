import { User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  BackHandler,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isRTL } from "../i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface BurgerMenuProps {
  style?: any;
}

interface BurgerMenuProviderProps {
  user: User | null;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onNavigateToAdmin?: () => void;
  isAdmin?: boolean;
  children: React.ReactNode;
}

const { width: screenWidth } = Dimensions.get("window");
const SIDEBAR_WIDTH = Math.min(screenWidth * 0.8, 300);
const EDGE_WIDTH = 28;
const OPEN_THRESHOLD = 0.32;

type DrawerContextValue = {
  toggleSidebar: () => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export const BurgerMenuProvider: React.FC<BurgerMenuProviderProps> = ({
  user,
  onLogout,
  onNavigateToLogin,
  onNavigateToAdmin,
  isAdmin,
  children,
}) => {
  const { t, i18n } = useTranslation();
  const isCurrentRTL = isRTL(i18n.language);
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = React.useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(0);
  const dragStart = useRef(0);
  const isRTLRef = useRef(isCurrentRTL);
  isRTLRef.current = isCurrentRTL;

  useEffect(() => {
    const id = progress.addListener(({ value }) => {
      progressValue.current = value;
    });
    return () => progress.removeListener(id);
  }, [progress]);

  const finishTo = (open: boolean) => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setIsOpen(open);
    });
  };
  const finishToRef = useRef(finishTo);
  finishToRef.current = finishTo;

  const openSidebar = () => {
    setIsOpen(true);
    finishTo(true);
  };

  const closeSidebar = () => {
    finishTo(false);
  };

  const toggleSidebar = () => {
    if (progressValue.current > 0.5) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === "android" && (isOpen || progressValue.current > 0)) {
        closeSidebar();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [isOpen]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gesture) => {
          const horizontal = Math.abs(gesture.dx) > Math.abs(gesture.dy) + 6;
          if (!horizontal) return false;
          const rtl = isRTLRef.current;
          const opening = rtl ? gesture.dx < -8 : gesture.dx > 8;
          const closing = rtl ? gesture.dx > 8 : gesture.dx < -8;
          if (progressValue.current < 0.05) return opening;
          return closing;
        },
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          dragStart.current = progressValue.current;
          setIsOpen(true);
        },
        onPanResponderMove: (_evt, gesture) => {
          const delta = isRTLRef.current ? -gesture.dx : gesture.dx;
          progress.setValue(
            clamp(dragStart.current + delta / SIDEBAR_WIDTH, 0, 1)
          );
        },
        onPanResponderRelease: (_evt, gesture) => {
          const velocity = isRTLRef.current ? -gesture.vx : gesture.vx;
          const shouldOpen =
            progressValue.current > OPEN_THRESHOLD || velocity > 0.55;
          finishToRef.current(shouldOpen);
        },
      }),
    [progress]
  );

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: isCurrentRTL ? [SIDEBAR_WIDTH, 0] : [-SIDEBAR_WIDTH, 0],
  });

  const overlayOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const handleLogout = () => {
    closeSidebar();
    onLogout();
  };

  const handleLogin = () => {
    closeSidebar();
    onNavigateToLogin();
  };

  const handleAdmin = () => {
    closeSidebar();
    onNavigateToAdmin?.();
  };

  const styles = StyleSheet.create({
    host: {
      flex: 1,
    },
    edge: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: EDGE_WIDTH,
      zIndex: 20,
      ...(isCurrentRTL ? { right: 0 } : { left: 0 }),
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "#000",
      zIndex: 21,
    },
    sidebar: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: SIDEBAR_WIDTH,
      backgroundColor: "#ffffff",
      paddingTop: insets.top + 20,
      paddingHorizontal: 20,
      paddingBottom: insets.bottom + 20,
      zIndex: 22,
      ...(isCurrentRTL ? { right: 0 } : { left: 0 }),
    },
    sidebarHeader: {
      flexDirection: isCurrentRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 30,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#e9ecef",
      justifyContent: "space-between",
    },
    sidebarTitleContainer: {
      flexDirection: isCurrentRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 1,
    },
    sidebarLogo: {
      width: 32,
      height: 32,
    },
    sidebarTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#212529",
      marginLeft: isCurrentRTL ? 0 : 12,
      marginRight: isCurrentRTL ? 12 : 0,
    },
    closeButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: "#f8f9fa",
    },
    closeIcon: {
      fontSize: 18,
      color: "#6c757d",
    },
    menuIcon: {
      fontSize: 18,
      color: "#6c757d",
    },
    languageSectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: "#6c757d",
      marginBottom: 15,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    adminSection: {
      marginTop: 20,
      marginBottom: 12,
    },
    adminButton: {
      flexDirection: isCurrentRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: "#6f42c1",
    },
    adminButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
      marginLeft: isCurrentRTL ? 0 : 12,
      marginRight: isCurrentRTL ? 12 : 0,
    },
    bottomSection: {
      marginTop: "auto",
      borderTopWidth: 1,
      borderTopColor: "#e9ecef",
    },
    userInfo: {
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#e9ecef",
    },
    userName: {
      fontSize: 16,
      fontWeight: "600",
      color: "#212529",
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: "#6c757d",
    },
    loginButton: {
      flexDirection: isCurrentRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: "#007AFF",
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
      marginLeft: isCurrentRTL ? 0 : 12,
      marginRight: isCurrentRTL ? 12 : 0,
    },
    logoutButton: {
      flexDirection: isCurrentRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: "#dc3545",
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
      marginLeft: isCurrentRTL ? 0 : 12,
      marginRight: isCurrentRTL ? 12 : 0,
    },
  });

  return (
    <DrawerContext.Provider value={{ toggleSidebar }}>
      <View style={styles.host}>
        {children}

        <View
          style={styles.edge}
          {...panResponder.panHandlers}
          pointerEvents={isOpen ? "none" : "auto"}
        />

        <TouchableWithoutFeedback onPress={closeSidebar}>
          <Animated.View
            pointerEvents={isOpen ? "auto" : "none"}
            style={[styles.overlay, { opacity: overlayOpacity }]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX }] }]}
          pointerEvents={isOpen ? "auto" : "none"}
          {...panResponder.panHandlers}
        >
          <View style={styles.sidebarHeader}>
            <View style={styles.sidebarTitleContainer}>
              <Image
                source={require("../../assets/logo-black.png")}
                style={styles.sidebarLogo}
                resizeMode="contain"
              />
              <Text style={styles.sidebarTitle}>HalalScan</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeSidebar}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user.displayName || user.email}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          )}

          <View>
            <Text style={styles.languageSectionTitle}>
              {t("language.selectLanguage")}
            </Text>
            <LanguageSwitcher
              compact={true}
              style={{ backgroundColor: "transparent" }}
            />
          </View>

          <View style={styles.bottomSection}>
            {user && isAdmin && (
              <View style={styles.adminSection}>
                <TouchableOpacity style={styles.adminButton} onPress={handleAdmin}>
                  <Text style={styles.menuIcon}>⚙️</Text>
                  <Text style={styles.adminButtonText}>
                    {t("home.adminPanel")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {user ? (
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.menuIcon}>🚪</Text>
                <Text style={styles.logoutButtonText}>{t("home.logout")}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.menuIcon}>🔑</Text>
                <Text style={styles.loginButtonText}>{t("auth.signIn")}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </DrawerContext.Provider>
  );
};

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ style }) => {
  const drawer = useContext(DrawerContext);
  const { i18n } = useTranslation();
  const isCurrentRTL = isRTL(i18n.language);

  const styles = StyleSheet.create({
    container: {
      ...style,
    },
    burgerButton: {
      padding: 8,
      borderRadius: 6,
    },
    burgerIcon: {
      flexDirection: "column",
      justifyContent: "space-between",
      width: 20,
      height: 16,
      position: "absolute",
      ...(isCurrentRTL
        ? { left: "auto", right: 0 }
        : { left: 0, right: "auto" }),
    },
    burgerLine: {
      height: 2,
      backgroundColor: "#ffffff",
      borderRadius: 1,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.burgerButton}
        onPress={drawer?.toggleSidebar}
      >
        <View style={styles.burgerIcon}>
          <View style={styles.burgerLine} />
          <View style={[styles.burgerLine, { marginVertical: 4 }]} />
          <View style={styles.burgerLine} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
