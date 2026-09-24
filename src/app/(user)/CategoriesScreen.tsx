import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
});
