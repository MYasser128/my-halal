import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppUser, ensureUserProfile, login, register, setPendingProfileExtras } from '../services/auth';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useSafeAreaPadding } from '../hooks/useSafeAreaPadding';
import { registerScreenStyles } from '../styles/RegisterScreen.styles';

interface RegisterScreenProps {
  onRegister: (user: AppUser) => void;
  onSwitchToLogin: () => void;
  onBackToHome: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onSwitchToLogin, onBackToHome }) => {
  const { t } = useTranslation();
  const { headerStyle, screenBottomStyle } = useSafeAreaPadding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const submittingRef = useRef(false);

  const handleRegister = async () => {
    if (submittingRef.current || loading) return;
    const trimmedEmail = email.trim();
    const trimmedName = displayName.trim();
    if (!trimmedEmail || !password || !confirmPassword || !trimmedName) {
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

    submittingRef.current = true;
    setLoading(true);
    try {
      setPendingProfileExtras({ displayName: trimmedName, receiveUpdates });
      let credential;
      try {
        credential = await register(trimmedEmail, password);
      } catch (error: any) {
        if (error?.code !== 'auth/email-already-in-use') {
          throw error;
        }
        // First tap often created the account; second tap should finish sign-in.
        credential = await login(trimmedEmail, password);
      }

      const userWithProfile = await ensureUserProfile(credential.user, {
        displayName: trimmedName,
        receiveUpdates,
      });
      onRegister(userWithProfile);
      onBackToHome();
    } catch (error: any) {
      if (error?.code === 'auth/email-already-in-use' || error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
        Alert.alert(t('auth.alreadyHaveAccount'), t('auth.emailAlreadyInUse'), [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('auth.signIn'), onPress: onSwitchToLogin },
        ]);
      } else {
        Alert.alert(t('auth.registrationFailed'), t('auth.anErrorOccurred'));
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  return (
    <KeyboardAvoidingView 
      style={registerScreenStyles.container} 
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={[
          registerScreenStyles.scrollContainer,
          headerStyle,
          screenBottomStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
      >
        <View style={registerScreenStyles.formContainer}>
          <View style={registerScreenStyles.header}>
            <View style={registerScreenStyles.headerTop}>
              <TouchableOpacity style={registerScreenStyles.backButton} onPress={onBackToHome}>
                <Text style={registerScreenStyles.backButtonText}>← {t('common.back')}</Text>
              </TouchableOpacity>
              <LanguageSwitcher compact style={registerScreenStyles.languageSwitcher} />
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
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>

            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>{t('auth.email')}</Text>
              <TextInput
                ref={emailRef}
                style={registerScreenStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.enterEmail')}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>

            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>{t('auth.password')}</Text>
              <TextInput
                ref={passwordRef}
                style={registerScreenStyles.input}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.enterPassword')}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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
                ref={confirmPasswordRef}
                style={registerScreenStyles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('auth.confirmYourPassword')}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="go"
                onSubmitEditing={handleRegister}
              />
              
              {confirmPassword.length > 0 && (
                <Text style={doPasswordsMatch ? registerScreenStyles.passwordRequirementValid : registerScreenStyles.passwordRequirementInvalid}>
                  {doPasswordsMatch ? t('auth.passwordsMatch') : t('auth.passwordsDoNotMatch')}
                </Text>
              )}
            </View>

            <View style={registerScreenStyles.checkboxContainer}>
              <TouchableOpacity
                style={[registerScreenStyles.checkbox, receiveUpdates && registerScreenStyles.checkboxChecked]}
                onPress={() => setReceiveUpdates(!receiveUpdates)}
              >
                {receiveUpdates && (
                  <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                )}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={registerScreenStyles.checkboxText}>
                  {t('auth.receiveUpdates')}
                </Text>
                
              </View>
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

