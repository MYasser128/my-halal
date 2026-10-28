import { User } from "firebase/auth";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { useSafeAreaPadding } from "../hooks/useSafeAreaPadding";
import { createUserProfile, getUserProfile, login } from "../services/auth";
import { loginScreenStyles } from "../styles/LoginScreen.styles";

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
  onBackToHome: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onSwitchToRegister,
  onBackToHome,
}) => {
  const { t } = useTranslation();
  const { headerStyle, screenBottomStyle } = useSafeAreaPadding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t("common.error"), t("auth.pleaseFillAllFields"));
      return;
    }

    setLoading(true);
    try {
      const userCredential = await login(email, password);
      await createUserProfile(userCredential.user);

      // Get the user profile with actual display name from Firestore
      const userWithProfile = await getUserProfile(userCredential.user);
      onLogin(userWithProfile);
      onBackToHome();
    } catch (error: any) {
      // Check for specific Firebase auth error codes

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-email" ||
        error.code === "auth/invalid-credential"
      ) {
        Alert.alert(t("auth.loginFailed"), t("auth.invalidCredentials"));
      } else {
        Alert.alert(
          t("auth.loginFailed"),
          error.message || t("auth.anErrorOccurred")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={loginScreenStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          loginScreenStyles.scrollContainer,
          headerStyle,
          screenBottomStyle,
        ]}
      >
        <View style={loginScreenStyles.formContainer}>
          <View style={loginScreenStyles.header}>
            <View style={loginScreenStyles.headerTop}>
              <TouchableOpacity
                style={loginScreenStyles.backButton}
                onPress={onBackToHome}
              >
                <Text style={loginScreenStyles.backButtonText}>
                  ← {t("common.back")}
                </Text>
              </TouchableOpacity>
              <LanguageSwitcher style={loginScreenStyles.languageSwitcher} />
            </View>
            <View style={loginScreenStyles.logo}>
              <Image
                source={require("../../assets/logo.png")}
                style={loginScreenStyles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={loginScreenStyles.title}>{t("auth.welcomeBack")}</Text>
            <Text style={loginScreenStyles.subtitle}>
              {t("auth.signInToAccount")}
            </Text>
          </View>

          <View style={loginScreenStyles.form}>
            <View style={loginScreenStyles.inputContainer}>
              <Text style={loginScreenStyles.label}>{t("auth.email")}</Text>
              <TextInput
                style={loginScreenStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t("auth.enterEmail")}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={loginScreenStyles.inputContainer}>
              <Text style={loginScreenStyles.label}>{t("auth.password")}</Text>
              <View style={loginScreenStyles.passwordInputContainer}>
                <TextInput
                  style={loginScreenStyles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t("auth.enterPassword")}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={loginScreenStyles.passwordToggle}
                  onPress={togglePasswordVisibility}
                  accessibilityLabel={
                    showPassword
                      ? t("auth.hidePassword")
                      : t("auth.showPassword")
                  }
                  accessibilityRole="button"
                >
                  <Text style={loginScreenStyles.passwordToggleText}>
                    {showPassword ? "🙈" : "👁️"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                loginScreenStyles.button,
                loading && loginScreenStyles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <View style={loginScreenStyles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={loginScreenStyles.loadingText}>
                    {t("auth.signingIn")}
                  </Text>
                </View>
              ) : (
                <Text style={loginScreenStyles.buttonText}>
                  {t("auth.signIn")}
                </Text>
              )}
            </TouchableOpacity>

            <View style={loginScreenStyles.switchContainer}>
              <Text style={loginScreenStyles.switchText}>
                {t("auth.dontHaveAccount")}{" "}
              </Text>
              <TouchableOpacity onPress={onSwitchToRegister}>
                <Text style={loginScreenStyles.switchLink}>
                  {t("auth.signUp")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
