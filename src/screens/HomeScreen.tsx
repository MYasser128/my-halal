import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { User } from 'firebase/auth';
import { useAdmin } from '../hooks/useAdmin';
import { AdminPanel } from '../components/AdminPanel';
import { homeScreenStyles } from '../styles/HomeScreen.styles';

interface HomeScreenProps {
  user: User;
  onLogout: () => void;
  onNavigateToScanner: () => void;
  onNavigateToAdmin: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ user, onLogout, onNavigateToScanner, onNavigateToAdmin }) => {
  const { isAdmin, loading } = useAdmin(user);

  return (
    <ScrollView style={homeScreenStyles.container}>
      <View style={homeScreenStyles.header}>
        <View style={homeScreenStyles.headerContent}>
          <Text style={homeScreenStyles.title}>My Halal</Text>
          <Text style={homeScreenStyles.subtitle}>Welcome, {user.displayName || user.email}!</Text>
        </View>
        
        <TouchableOpacity style={homeScreenStyles.logoutButton} onPress={onLogout}>
          <Text style={homeScreenStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={homeScreenStyles.content}>
        <View style={homeScreenStyles.welcomeCard}>
          <Text style={homeScreenStyles.welcomeTitle}>🕌 Welcome to My Halal App</Text>
          <Text style={homeScreenStyles.welcomeDescription}>
            Your trusted companion for verifying halal products. Scan barcodes, check ingredients, and make informed choices.
          </Text>
        </View>

        <Text style={homeScreenStyles.sectionTitle}>Quick Actions</Text>
        
        <View style={homeScreenStyles.quickActions}>
          <TouchableOpacity style={homeScreenStyles.quickActionButton} onPress={onNavigateToScanner}>
            <Text style={homeScreenStyles.quickActionText}>📱 Scan Product</Text>
          </TouchableOpacity>
        </View>

        <View style={homeScreenStyles.featureCard}>
          <Text style={homeScreenStyles.featureTitle}>🔍 Product Scanner</Text>
          <Text style={homeScreenStyles.featureDescription}>
            Scan barcodes to instantly check if products are halal, haram, or need verification. Get detailed ingredient analysis and certification information.
          </Text>
        </View>

        {isAdmin && (
          <View style={homeScreenStyles.adminSection}>
            <Text style={homeScreenStyles.adminSectionTitle}>Admin Panel</Text>
            <AdminPanel onNavigateToAdmin={onNavigateToAdmin} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

