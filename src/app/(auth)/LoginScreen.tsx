import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useShop } from '../ShopStore';

export default function LoginScreen() {
  const shop = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = shop.login(email, password);
      if (res.success) {
        const cleanEmail = email.trim().toLowerCase();
        if (
          shop.user?.role === 'admin' ||
          cleanEmail === 'admin' ||
          cleanEmail === 'admin@shopnest.demo'
        ) {
          router.replace('/(admin)/(tabs)');
        } else {
          router.replace('/(user)/(tabs)');
        }
      } else {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  const autofillUser = () => {
    setEmail('user');
    setPassword('user');
    setErrorMessage('');
  };

  const autofillAdmin = () => {
    setEmail('admin');
    setPassword('admin');
    setErrorMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/WelcomeScreen')}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in with "user" / "user" or "admin" / "admin"
            </Text>
          </View>

          {/* Quick Demo Autofill Section */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>⚡ Quick 1-Tap Demo Login</Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={autofillUser}
                activeOpacity={0.7}
              >
                <Text style={styles.demoChipText}>👤 User Demo</Text>
                <Text style={styles.demoChipSub}>user / user</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoChip, styles.adminChip]}
                onPress={autofillAdmin}
                activeOpacity={0.7}
              >
                <Text style={styles.demoChipText}>🛡️ Admin Demo</Text>
                <Text style={styles.demoChipSub}>admin / admin</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Message Box */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username or Email</Text>
              <TextInput
                style={styles.input}
                placeholder="user or admin"
                placeholderTextColor="#A0A0A0"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrorMessage('');
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.togglePassword}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessage('');
                }}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.disabledBtn]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Skip / Guest Link */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.replace('/(user)/(tabs)')}
              activeOpacity={0.7}
            >
              <Text style={styles.guestText}>Continue as Customer Guest →</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/RegisterScreen')}
              activeOpacity={0.7}
            >
              <Text style={styles.signupLink}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F7F7FA',
  },
  backText: {
    fontSize: 14,
    color: '#171717',
    fontWeight: '600',
  },
  header: {
    marginBottom: 24,
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#5B4BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 22,
  },
  demoBox: {
    backgroundColor: '#F0EEFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2DEFF',
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BFF',
    marginBottom: 10,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoChip: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#5B4BFF',
  },
  adminChip: {
    borderColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },
  demoChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  demoChipSub: {
    fontSize: 10,
    color: '#777777',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '600',
    flex: 1,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 8,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  togglePassword: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B4BFF',
  },
  input: {
    backgroundColor: '#F7F7FA',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#171717',
  },
  loginBtn: {
    backgroundColor: '#5B4BFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  guestButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  guestText: {
    color: '#5B4BFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#777777',
    fontSize: 14,
  },
  signupLink: {
    color: '#5B4BFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
