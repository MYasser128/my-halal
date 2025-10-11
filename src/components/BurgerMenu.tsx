import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { User } from 'firebase/auth';
import { isRTL } from '../i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface BurgerMenuProps {
  user: User | null;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onNavigateToAdmin?: () => void;
  isAdmin?: boolean;
  style?: any;
}

const { width: screenWidth } = Dimensions.get('window');

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ 
  user, 
  onLogout, 
  onNavigateToLogin, 
  onNavigateToAdmin,
  isAdmin,
  style 
}) => {
  const { t, i18n } = useTranslation();
  const isCurrentRTL = isRTL(i18n.language);
  const [isOpen, setIsOpen] = React.useState(false);
  const [slideAnim] = React.useState(new Animated.Value(isCurrentRTL ? screenWidth : -screenWidth));

  // Handle Android back button for sidebar modal
  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === 'android' && isOpen) {
        closeSidebar();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isOpen]);

  const toggleSidebar = () => {
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  const openSidebar = () => {
    setIsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isCurrentRTL ? screenWidth : -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
    });
  };

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
    container: {
      ...style,
    },
    burgerButton: {
      padding: 8,
      borderRadius: 6,
    },
    burgerIcon: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: 20,
      height: 16,
      position: "absolute",
      ...(isCurrentRTL ? { left: 'auto', right: 0 } : { left: 0, right: 'auto' }),
    },
    burgerLine: {
      height: 2,
      backgroundColor: '#ffffff',
      borderRadius: 1,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: screenWidth * 0.8,
      maxWidth: 300,
      backgroundColor: '#ffffff',
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      flex: 1,
      ...(isCurrentRTL ? { right: 0 } : { left: 0 }),
    },
    sidebarHeader: {
      flexDirection: isCurrentRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 30,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
      justifyContent: 'space-between',
    },
    sidebarTitleContainer: {
      flexDirection: isCurrentRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      flex: 1,
    },
    sidebarLogo: {
      width: 32,
      height: 32,
    },
    sidebarTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#212529',
      marginLeft: isCurrentRTL ? 0 : 12,
      marginRight: isCurrentRTL ? 12 : 0,
    },
    closeButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: '#f8f9fa',
    },
    closeIcon: {
      fontSize: 18,
      color: '#6c757d',
    },
    menuItem: {
      flexDirection: isCurrentRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 8,
    },
    menuItemActive: {
      backgroundColor: '#e3f2fd',
    },
    menuItemText: {
      fontSize: 16,
      color: '#495057',
      marginLeft: isCurrentRTL ? 0 : 12,
      marginRight: isCurrentRTL ? 12 : 0,
    },
    menuItemTextActive: {
      color: '#1976d2',
      fontWeight: '600',
    },
    menuIcon: {
      fontSize: 18,
      color: '#6c757d',
    },
    menuIconActive: {
      color: '#1976d2',
    },
    
    languageSectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6c757d',
      marginBottom: 15,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    adminSection: {
      marginTop: 20,
      marginBottom: 12,
      
    },
    adminButton: {
      flexDirection: isCurrentRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: '#6f42c1',
    },
    adminButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
      marginLeft: isCurrentRTL ? 0 : 12,
      marginRight: isCurrentRTL ? 12 : 0,
    },
    bottomSection: {
      marginTop: 'auto',
      borderTopWidth: 1,
      borderTopColor: '#e9ecef',
    },
    userInfo: {
      marginBottom: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#e9ecef',
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#212529',
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: '#6c757d',
    },
    loginButton: {
      flexDirection: isCurrentRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: '#007AFF',
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
      marginLeft: isCurrentRTL ? 0 : 12,
      marginRight: isCurrentRTL ? 12 : 0,
    },
    logoutButton: {
      flexDirection: isCurrentRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: '#dc3545',
    },
    logoutButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
      marginLeft: isCurrentRTL ? 0 : 12,
      marginRight: isCurrentRTL ? 12 : 0,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.burgerButton} onPress={toggleSidebar}>
        <View style={styles.burgerIcon}>
          <View style={styles.burgerLine} />
          <View style={[styles.burgerLine, { marginVertical: 4 }]} />
          <View style={styles.burgerLine} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeSidebar}
      >
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.sidebar,
                  {
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >
                <View style={styles.sidebarHeader}>
                  <View style={styles.sidebarTitleContainer}>
                    <Image 
                      source={require('../../assets/logo.png')} 
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
                    <Text style={styles.userName}>{user.displayName || user.email}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                )}

                <View>
                  <Text style={styles.languageSectionTitle}>
                    {t('language.selectLanguage')}
                  </Text>
                  <LanguageSwitcher compact={true} style={{ backgroundColor: 'transparent' }} />
                </View>

                

                <View style={styles.bottomSection}>
                  {user && isAdmin && (
                    <View style={styles.adminSection}>
                      <TouchableOpacity style={styles.adminButton} onPress={handleAdmin}>
                        <Text style={styles.menuIcon}>⚙️</Text>
                        <Text style={styles.adminButtonText}>{t('home.adminPanel')}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {user ? (
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                      <Text style={styles.menuIcon}>🚪</Text>
                      <Text style={styles.logoutButtonText}>{t('home.logout')}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                      <Text style={styles.menuIcon}>🔑</Text>
                      <Text style={styles.loginButtonText}>{t('auth.signIn')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
