import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useShop, CategoryItem } from '../ShopStore';

const { width } = Dimensions.get('window');
const cardWidth = (width - 44) / 2;

export default function CategoriesScreen() {
  const shop = useShop();

  const handleSelectCategory = (categoryName: string) => {
    router.push({
      pathname: '/(user)/CategoryDetailsScreen',
      params: { category: categoryName },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <TouchableOpacity
          onPress={() => router.push('/(user)/SearchScreen')}
          style={styles.searchBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.tagline}>
          Explore our complete catalog organized into 8 high-quality collections.
        </Text>

        {/* 2-Column Categories Grid */}
        <View style={styles.grid}>
          {shop.categories.map((cat: CategoryItem) => {
            const matchedProductsCount = shop.products.filter(
              (p) => p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catCard, { width: cardWidth }]}
                onPress={() => handleSelectCategory(cat.name)}
                activeOpacity={0.85}
              >
                <View style={styles.iconWrapper}>
                  <Text style={styles.iconEmoji}>{cat.icon}</Text>
                </View>

                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.productCount}>
                  {matchedProductsCount || cat.productCount} Products
                </Text>
                <Text style={styles.catDescription} numberOfLines={2}>
                  {cat.description}
                </Text>

                <View style={styles.arrowRow}>
                  <Text style={styles.arrowText}>Browse Items →</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(user)/HomeScreen')}
          activeOpacity={0.8}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(user)/CategoriesScreen')}
          activeOpacity={0.8}
        >
          <Text style={[styles.navIcon, styles.activeNavIcon]}>📂</Text>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(user)/WishlistScreen')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.navIcon}>💖</Text>
            {shop.wishlist.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{shop.wishlist.length}</Text>
              </View>
            )}
          </View>
          <Text style={styles.navLabel}>Wishlist</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(user)/CartScreen')}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.navIcon}>🛒</Text>
            {shop.cartTotals.totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{shop.cartTotals.totalItems}</Text>
              </View>
            )}
          </View>
          <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(user)/ProfileScreen')}
          activeOpacity={0.8}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#171717',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  tagline: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 16,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  catCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    elevation: 2,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconEmoji: {
    fontSize: 26,
  },
  catName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 2,
  },
  productCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B4BFF',
    marginBottom: 6,
  },
  catDescription: {
    fontSize: 11,
    color: '#777777',
    lineHeight: 15,
    marginBottom: 12,
  },
  arrowRow: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    paddingTop: 8,
  },
  arrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  activeNavIcon: {
    transform: [{ scale: 1.1 }],
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeNavLabel: {
    color: '#5B4BFF',
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#5B4BFF',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
