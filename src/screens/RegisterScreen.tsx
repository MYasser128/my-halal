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
import { register, createUserProfile, getUserProfile } from '../services/auth';
import { User } from 'firebase/auth';
import { registerScreenStyles } from '../styles/RegisterScreen.styles';

interface RegisterScreenProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
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
      Alert.alert('Registration Failed', error.message || 'An error occurred');
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
            <View style={registerScreenStyles.logo}>
              <Text style={registerScreenStyles.logoText}>🕌</Text>
            </View>
            <Text style={registerScreenStyles.title}>Create Account</Text>
            <Text style={registerScreenStyles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={registerScreenStyles.form}>
            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>Full Name</Text>
              <TextInput
                style={registerScreenStyles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>

            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>Email</Text>
              <TextInput
                style={registerScreenStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>Password</Text>
              <TextInput
                style={registerScreenStyles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
              />
              
              {password.length > 0 && (
                <View style={registerScreenStyles.passwordRequirements}>
                  <Text style={registerScreenStyles.passwordRequirementsTitle}>Password Requirements:</Text>
                  <Text style={isPasswordValid ? registerScreenStyles.passwordRequirementValid : registerScreenStyles.passwordRequirementInvalid}>
                    • At least 6 characters {isPasswordValid ? '✓' : '✗'}
                  </Text>
                </View>
              )}
            </View>

            <View style={registerScreenStyles.inputContainer}>
              <Text style={registerScreenStyles.label}>Confirm Password</Text>
              <TextInput
                style={registerScreenStyles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
              />
              
              {confirmPassword.length > 0 && (
                <Text style={doPasswordsMatch ? registerScreenStyles.passwordRequirementValid : registerScreenStyles.passwordRequirementInvalid}>
                  {doPasswordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
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
                  <Text style={registerScreenStyles.loadingText}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={registerScreenStyles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={registerScreenStyles.termsContainer}>
              <Text style={registerScreenStyles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={registerScreenStyles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={registerScreenStyles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <View style={registerScreenStyles.switchContainer}>
              <Text style={registerScreenStyles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text style={registerScreenStyles.switchLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

