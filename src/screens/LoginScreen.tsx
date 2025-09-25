import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { login, register, createUserProfile, getUserProfile } from '../services/auth';
import { User } from 'firebase/auth';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { loginScreenStyles } from '../styles/LoginScreen.styles';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToRegister }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.pleaseFillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const userCredential = await login(email, password);
      await createUserProfile(userCredential.user);
      
      // Get the user profile with actual display name from Firestore
      const userWithProfile = await getUserProfile(userCredential.user);
      onLogin(userWithProfile);
    } catch (error: any) {
      Alert.alert(t('auth.loginFailed'), error.message || t('auth.anErrorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={loginScreenStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={loginScreenStyles.scrollContainer}>
        <View style={loginScreenStyles.formContainer}>
          <View style={loginScreenStyles.header}>
            <View style={loginScreenStyles.headerTop}>
              <View style={loginScreenStyles.logo}>
                <Text style={loginScreenStyles.logoText}>🕌</Text>
              </View>
              <LanguageSwitcher style={loginScreenStyles.languageSwitcher} />
            </View>
            <Text style={loginScreenStyles.title}>{t('auth.welcomeBack')}</Text>
            <Text style={loginScreenStyles.subtitle}>{t('auth.signInToAccount')}</Text>
          </View>

          <View style={loginScreenStyles.form}>
            <View style={loginScreenStyles.inputContainer}>
              <Text style={loginScreenStyles.label}>{t('auth.email')}</Text>
              <TextInput
                style={loginScreenStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.enterEmail')}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={loginScreenStyles.inputContainer}>
              <Text style={loginScreenStyles.label}>{t('auth.password')}</Text>
              <View style={loginScreenStyles.passwordInputContainer}>
                <TextInput
                  style={loginScreenStyles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('auth.enterPassword')}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={loginScreenStyles.passwordToggle}
                  onPress={togglePasswordVisibility}
                  accessibilityLabel={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  accessibilityRole="button"
                >
                  <Text style={loginScreenStyles.passwordToggleText}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[loginScreenStyles.button, loading && loginScreenStyles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <View style={loginScreenStyles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={loginScreenStyles.loadingText}>{t('auth.signingIn')}</Text>
                </View>
              ) : (
                <Text style={loginScreenStyles.buttonText}>{t('auth.signIn')}</Text>
              )}
            </TouchableOpacity>

            <View style={loginScreenStyles.switchContainer}>
              <Text style={loginScreenStyles.switchText}>{t('auth.dontHaveAccount')} </Text>
              <TouchableOpacity onPress={onSwitchToRegister}>
                <Text style={loginScreenStyles.switchLink}>{t('auth.signUp')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

