import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { User } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '../hooks/useAdmin';
import { AdminPanel } from '../components/AdminPanel';
import { BurgerMenu } from '../components/BurgerMenu';
import { isRTL } from '../i18n';
import { homeScreenStyles } from '../styles/HomeScreen.styles';

interface HomeScreenProps {
  user: User;
  onLogout: () => void;
  onNavigateToScanner: () => void;
  onNavigateToAdmin: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user, onLogout, onNavigateToScanner, onNavigateToAdmin }) => {
  const { t, i18n } = useTranslation();
  const { isAdmin, loading } = useAdmin(user);
  const isCurrentRTL = isRTL(i18n.language);

  return (
    <ScrollView style={homeScreenStyles.container}>
      <View style={homeScreenStyles.header}>
        <BurgerMenu 
          onLogout={onLogout} 
          style={[
            homeScreenStyles.burgerMenu,
            isCurrentRTL ? { right: 'auto', left: 20 } : { right: 20, left: 'auto' }
          ]} 
        />
        <View style={homeScreenStyles.headerContent}>
          <Text style={homeScreenStyles.title}>My Halal</Text>
          <Text style={homeScreenStyles.subtitle}>{t('home.welcome')}, {user.displayName || user.email}!</Text>
        </View>
      </View>

      <View style={homeScreenStyles.content}>
        <View style={homeScreenStyles.welcomeCard}>
          <Text style={homeScreenStyles.welcomeTitle}>{t('home.welcomeToApp')}</Text>
          <Text style={homeScreenStyles.welcomeDescription}>
            {t('home.welcomeDescription')}
          </Text>
        </View>

        <Text style={homeScreenStyles.sectionTitle}>{t('home.quickActions')}</Text>
        
        <View style={homeScreenStyles.quickActions}>
          <TouchableOpacity style={homeScreenStyles.quickActionButton} onPress={onNavigateToScanner}>
            <Text style={homeScreenStyles.quickActionText}>{t('home.scanProduct')}</Text>
          </TouchableOpacity>
        </View>

        <View style={homeScreenStyles.featureCard}>
          <Text style={homeScreenStyles.featureTitle}>{t('home.productScanner')}</Text>
          <Text style={homeScreenStyles.featureDescription}>
            {t('home.productScannerDescription')}
          </Text>
        </View>

        {isAdmin && (
          <View style={homeScreenStyles.adminSection}>
            <Text style={homeScreenStyles.adminSectionTitle}>{t('home.adminPanel')}</Text>
            <AdminPanel onNavigateToAdmin={onNavigateToAdmin} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

