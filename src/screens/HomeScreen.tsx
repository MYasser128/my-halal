import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { User } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useAdmin } from "../hooks/useAdmin";
import { BurgerMenu } from "../components/BurgerMenu";
import { isRTL } from "../i18n";
import { homeScreenStyles } from "../styles/HomeScreen.styles";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : Platform.select({
      android: "ca-app-pub-4190475427615963/9140513175",
      ios: "ca-app-pub-4190475427615963/8408963930",
    }) || TestIds.ADAPTIVE_BANNER;

interface HomeScreenProps {
  user: User | null;
  onLogout: () => void;
  onNavigateToScanner: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToLogin: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  onLogout,
  onNavigateToScanner,
  onNavigateToAdmin,
  onNavigateToLogin,
}) => {
  const { t, i18n } = useTranslation();
  const { isAdmin, loading } = useAdmin(user);
  const isCurrentRTL = isRTL(i18n.language);

  return (
    <ScrollView style={homeScreenStyles.container}>
      <View style={homeScreenStyles.header}>
        <BurgerMenu
          user={user}
          onLogout={onLogout}
          onNavigateToLogin={onNavigateToLogin}
          onNavigateToAdmin={onNavigateToAdmin}
          isAdmin={isAdmin}
          style={[
            homeScreenStyles.burgerMenu,
            isCurrentRTL
              ? { right: "auto", left: 20 }
              : { right: 20, left: "auto" },
          ]}
        />
        <View style={homeScreenStyles.headerContent}>
          <View style={homeScreenStyles.logoContainer}>
            <Image
              source={require("../../assets/logo.png")}
              style={homeScreenStyles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={homeScreenStyles.title}>HalalScan</Text>
          <Text style={homeScreenStyles.subtitle}>
            {user
              ? `${t("home.welcome")}, ${user.displayName || user.email}!`
              : t("home.welcomeGuest")}
          </Text>
        </View>
      </View>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />

      <View style={homeScreenStyles.content}>
        <View style={homeScreenStyles.welcomeCard}>
          <Text style={homeScreenStyles.welcomeTitle}>
            {t("home.welcomeToApp")}
          </Text>
          <Text style={homeScreenStyles.welcomeDescription}>
            {t("home.welcomeDescription")}
          </Text>
        </View>

        <Text style={homeScreenStyles.sectionTitle}>
          {t("home.quickActions")}
        </Text>

        <View style={homeScreenStyles.quickActions}>
          <TouchableOpacity
            style={homeScreenStyles.quickActionButton}
            onPress={onNavigateToScanner}
          >
            <Text style={homeScreenStyles.quickActionText}>
              {t("home.scanProduct")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={homeScreenStyles.featureCard}>
          <Text style={homeScreenStyles.featureTitle}>
            {t("home.productScanner")}
          </Text>
          <Text style={homeScreenStyles.featureDescription}>
            {t("home.productScannerDescription")}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
