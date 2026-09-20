import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { router, Stack } from 'expo-router';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Discover Curated Trends',
    subtitle: 'Explore thousands of premium products from trusted international and local brands.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    tag: 'NEW COLLECTION 2026',
  },
  {
    id: '2',
    title: 'Lightning Fast Delivery',
    subtitle: 'Delivered straight to your doorstep with real-time live package tracking and zero hassle.',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
    tag: 'EXPRESS SHIPPING',
  },
  {
    id: '3',
    title: 'Seamless & Secure Checkout',
    subtitle: 'Pay with UPI, Cards or Cash on Delivery with 100% buyer protection and easy returns.',
    image: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=800&q=80',
    tag: '100% SECURE',
  },
];

export default function WelcomeScreen() {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleNext = () => {
    if (activeSlide < SLIDES.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      router.push('/(auth)/LoginScreen');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>S</Text>
          </View>
          <Text style={styles.brandName}>ShopNest</Text>
        </View>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(user)/HomeScreen')}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Visual Card */}
        <View style={styles.slideCard}>
          <Image
            source={{ uri: SLIDES[activeSlide].image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{SLIDES[activeSlide].tag}</Text>
          </View>
        </View>

        {/* Carousel Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveSlide(index)}
              style={[
                styles.dot,
                activeSlide === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Typography Content */}
        <View style={styles.textContent}>
          <Text style={styles.headline}>{SLIDES[activeSlide].title}</Text>
          <Text style={styles.body}>{SLIDES[activeSlide].subtitle}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              {activeSlide === SLIDES.length - 1 ? 'Get Started' : 'Next Step'}
            </Text>
          </TouchableOpacity>

          <View style={styles.authRow}>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => router.push('/(auth)/LoginScreen')}
              activeOpacity={0.7}
            >
              <Text style={styles.outlineBtnText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => router.push('/(auth)/RegisterScreen')}
              activeOpacity={0.7}
            >
              <Text style={styles.outlineBtnText}>Register</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.guestLink}
            onPress={() => router.replace('/(user)/HomeScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.guestText}>Continue as Customer Guest →</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Mode Notice */}
        <View style={styles.demoNotice}>
          <Text style={styles.demoNoticeTitle}>Demo Credentials Available</Text>
          <Text style={styles.demoNoticeDesc}>
            User: user@shopnest.demo (123456) • Admin: admin@shopnest.demo (admin123)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#5B4BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171717',
    letterSpacing: -0.5,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F7F7FA',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777777',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  slideCard: {
    width: '100%',
    height: width * 0.85,
    maxHeight: 380,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 10,
    backgroundColor: '#F0EEFF',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(23, 23, 23, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#5B4BFF',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#E5E5E5',
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#171717',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 32,
  },
  body: {
    fontSize: 15,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    width: '100%',
  },
  primaryBtn: {
    backgroundColor: '#5B4BFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  authRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  outlineBtn: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  outlineBtnText: {
    color: '#171717',
    fontSize: 15,
    fontWeight: '600',
  },
  guestLink: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  guestText: {
    color: '#5B4BFF',
    fontSize: 15,
    fontWeight: '600',
  },
  demoNotice: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F7F7FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  demoNoticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
    marginBottom: 2,
  },
  demoNoticeDesc: {
    fontSize: 11,
    color: '#777777',
    textAlign: 'center',
  },
});
