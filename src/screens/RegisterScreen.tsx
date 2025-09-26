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
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { register, createUserProfile, getUserProfile } from '../services/auth';
import { User } from 'firebase/auth';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { registerScreenStyles } from '../styles/RegisterScreen.styles';

interface RegisterScreenProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
  onBackToHome: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onSwitchToLogin, onBackToHome }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert(t('common.error'), t('auth.pleaseFillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordsDoNotMatchError'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordMustBeAtLeast6'));
      return;
    }

    setLoading(true);
    try {
      const userCredential = await register(email, password);
      await createUserProfile(userCredential.user, { displayName });
      
      // Get the user profile with actual display name from Firestore
      const userWithProfile = await getUserProfile(userCredential.user);
      onRegister(userWithProfile);
    } catch (error: any) {
      Alert.alert(t('auth.registrationFailed'), error.message || t('auth.anErrorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  return (
    <KeyboardAvoidingView 
      style={registerScreenStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={registerScreenStyles.scrollContainer}>
        <View style={registerScreenStyles.formContainer}>
          <View style={registerScreenStyles.header}>
            <View style={registerScreenStyles.headerTop}>
              <TouchableOpacity style={registerScreenStyles.backButton} onPress={onBackToHome}>
                <Text style={registerScreenStyles.backButtonText}>← {t('common.back')}</Text>
              </TouchableOpacity>
              <LanguageSwitcher style={registerScreenStyles.languageSwitcher} />
            </View>
            <View style={registerScreenStyles.logo}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={registerScreenStyles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={registerScreenStyles.title}>{t('auth.createAccount')}</Text>
            <Text style={registerScreenStyles.subtitle}>{t('auth.signUpToGetStarted')}</Text>
          </View>

          <View style={registerScreenStyles.form}>
            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>{t('auth.fullName')}</Text>
              <TextInput
                style={registerScreenStyles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder={t('auth.enterFullName')}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>

            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>{t('auth.email')}</Text>
              <TextInput
                style={registerScreenStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.enterEmail')}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>{t('auth.password')}</Text>
              <TextInput
                style={registerScreenStyles.input}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.enterPassword')}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
              />
              
              {password.length > 0 && (
                <View style={registerScreenStyles.passwordRequirements}>
                  <Text style={registerScreenStyles.passwordRequirementsTitle}>{t('auth.passwordRequirements')}</Text>
                  <Text style={isPasswordValid ? registerScreenStyles.passwordRequirementValid : registerScreenStyles.passwordRequirementInvalid}>
                    {t('auth.atLeast6Characters')} {isPasswordValid ? '✓' : '✗'}
                  </Text>
                </View>
              )}
            </View>

            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>{t('auth.confirmPassword')}</Text>
              <TextInput
                style={registerScreenStyles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('auth.confirmYourPassword')}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
              />
              
              {confirmPassword.length > 0 && (
                <Text style={doPasswordsMatch ? registerScreenStyles.passwordRequirementValid : registerScreenStyles.passwordRequirementInvalid}>
                  {doPasswordsMatch ? t('auth.passwordsMatch') : t('auth.passwordsDoNotMatch')}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[registerScreenStyles.button, loading && registerScreenStyles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading || !isPasswordValid || !doPasswordsMatch}
            >
              {loading ? (
                <View style={registerScreenStyles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={registerScreenStyles.loadingText}>{t('auth.creatingAccount')}</Text>
                </View>
              ) : (
                <Text style={registerScreenStyles.buttonText}>{t('auth.signUp')}</Text>
              )}
            </TouchableOpacity>

            <View style={registerScreenStyles.termsContainer}>
              <Text style={registerScreenStyles.termsText}>
                {t('auth.bySigningUp')}{' '}
                <Text style={registerScreenStyles.termsLink}>{t('auth.termsOfService')}</Text>
                {' '}{t('auth.and')}{' '}
                <Text style={registerScreenStyles.termsLink}>{t('auth.privacyPolicy')}</Text>
              </Text>
            </View>

            <View style={registerScreenStyles.switchContainer}>
              <Text style={registerScreenStyles.switchText}>{t('auth.alreadyHaveAccount')} </Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text style={registerScreenStyles.switchLink}>{t('auth.signIn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

