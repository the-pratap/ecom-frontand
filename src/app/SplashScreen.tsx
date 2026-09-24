import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useShop } from './ShopStore';

export default function SplashScreen() {
  const shop = useShop();
  const [statusText, setStatusText] = useState('Initializing ShopNest Engine...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStatusText('Connecting catalog & user session...');
    }, 600);

    const t2 = setTimeout(() => {
      if (shop.isAuthenticated && shop.user?.role === 'admin') {
        setStatusText('Welcome Administrator! Launching Portal...');
        setTimeout(() => router.replace('/(admin)/(tabs)'), 400);
      } else if (shop.isAuthenticated) {
        setStatusText(`Welcome ${shop.user?.name || 'Customer'}! Launching Store...`);
        setTimeout(() => router.replace('/(user)/(tabs)'), 400);
      } else {
        setStatusText('Please sign in to continue...');
        setTimeout(() => router.replace('/(auth)/LoginScreen'), 400);
      }
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shop.isAuthenticated, shop.user?.role]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#5B4BFF" />

      <View style={styles.container}>
        {/* Glow Logo Card */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>S</Text>
        </View>

        <Text style={styles.brandTitle}>ShopNest</Text>
        <Text style={styles.tagline}>Curated Modern Shopping • Bolpur & Kolkata</Text>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        {/* Manual Quick Access Shortcuts (if needed during testing) */}
        <View style={styles.quickAccessBox}>
          <Text style={styles.quickAccessTitle}>Quick Route Jump</Text>
          <View style={styles.quickBtnRow}>
            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => router.replace('/(user)/(tabs)')}
            >
              <Text style={styles.quickBtnText}>🛍️ Customer Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, styles.adminBtn]}
              onPress={() => router.replace('/(admin)/(tabs)')}
            >
              <Text style={styles.quickBtnText}>🛡️ Admin Portal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickBtn}
              onPress={() => router.replace('/(auth)/WelcomeScreen')}
            >
              <Text style={styles.quickBtnText}>✨ Welcome / Auth</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.versionText}>ShopNest v1.0.0 • Expo Router v57</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5B4BFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  logoLetter: {
    fontSize: 54,
    fontWeight: '900',
    color: '#5B4BFF',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#E0DDFF',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '500',
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 40,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
  },
  quickAccessBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  quickAccessTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E0DDFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  quickBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  quickBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 3,
  },
  adminBtn: {
    backgroundColor: '#FEF3C7',
  },
  quickBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#171717',
  },
  versionText: {
    position: 'absolute',
    bottom: 24,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
  },
});
