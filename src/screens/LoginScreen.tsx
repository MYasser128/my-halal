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
import { login, register, createUserProfile, getUserProfile } from '../services/auth';
import { User } from 'firebase/auth';
import { loginScreenStyles } from '../styles/LoginScreen.styles';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
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
      Alert.alert('Login Failed', error.message || 'An error occurred');
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
            <View style={loginScreenStyles.logo}>
              <Text style={loginScreenStyles.logoText}>🕌</Text>
            </View>
            <Text style={loginScreenStyles.title}>Welcome Back</Text>
            <Text style={loginScreenStyles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={loginScreenStyles.form}>
            <View style={loginScreenStyles.inputContainer}>
              <Text style={loginScreenStyles.label}>Email</Text>
              <TextInput
                style={loginScreenStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={loginScreenStyles.inputContainer}>
              <Text style={loginScreenStyles.label}>Password</Text>
              <TextInput
                style={loginScreenStyles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[loginScreenStyles.button, loading && loginScreenStyles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <View style={loginScreenStyles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={loginScreenStyles.loadingText}>Signing In...</Text>
                </View>
              ) : (
                <Text style={loginScreenStyles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={loginScreenStyles.switchContainer}>
              <Text style={loginScreenStyles.switchText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSwitchToRegister}>
                <Text style={loginScreenStyles.switchLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

