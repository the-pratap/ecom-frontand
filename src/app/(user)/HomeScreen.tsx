import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useShop, Product } from '../ShopStore';

const { width } = Dimensions.get('window');
const isTablet = width >= 600;
const cardWidth = isTablet ? (width - 64) / 3 : (width - 48) / 2;

export default function HomeScreen() {
  const shop = useShop();

  // Simulated flash sale countdown
  const [timeLeft, setTimeLeft] = useState({ h: 6, m: 34, s: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: 59, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 12, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = shop.products.slice(0, 4);
  const popularProducts = shop.products.slice(0, 6);
  const newArrivals = shop.products.slice(6, 12);
  const recommended = shop.products.slice(12, 18);

  const renderProductCard = (product: Product) => {
    const isWishlisted = shop.isInWishlist(product.id);
    const discountPercent = Math.round(
      ((product.price - product.discountPrice) / product.price) * 100
    );

    return (
      <TouchableOpacity
        key={product.id}
        style={[styles.productCard, { width: cardWidth }]}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: '/(user)/ProductDetailsScreen',
            params: { productId: product.id },
          })
        }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>-{discountPercent}%</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.wishlistBtn,
              isWishlisted && styles.wishlistBtnActive,
            ]}
            onPress={() => shop.toggleWishlist(product)}
            activeOpacity={0.8}
          >
            <Text style={styles.wishlistIcon}>{isWishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.brandText}>{product.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.starText}>★</Text>
            <Text style={styles.ratingValue}>{product.averageRating}</Text>
            <Text style={styles.reviewCount}>({product.totalReviews})</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.discountPrice}>
              ₹{product.discountPrice.toLocaleString()}
            </Text>
            <Text style={styles.originalPrice}>
              ₹{product.price.toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addCartBtn}
            onPress={() => shop.addToCart(product, {}, 1)}
            activeOpacity={0.8}
          >
            <Text style={styles.addCartText}>+ Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* App Header */}
      <View style={styles.header}>
        <View style={styles.greetingBox}>
          <Text style={styles.greetingSub}>
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},
          </Text>
          <Text style={styles.greetingName}>
            {shop.user?.name || 'Rahul Das'} 👋
          </Text>
        </View>

        {shop.user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.adminSwitchBtn}
            onPress={() => router.push('/(admin)/AdminDashboardScreen')}
          >
            <Text style={styles.adminSwitchText}>🛡️ Admin</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => router.push('/(user)/NotificationsScreen')}
          activeOpacity={0.7}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          {shop.unreadNotificationCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>
                {shop.unreadNotificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar Input Trigger */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(user)/SearchScreen')}
          activeOpacity={0.85}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>
            Search headphones, shoes, hoodies...
          </Text>
          <View style={styles.searchFilterIcon}>
            <Text style={{ fontSize: 13 }}>⚙️</Text>
          </View>
        </TouchableOpacity>

        {/* Promo Hero Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>MEGA FESTIVE SALE</Text>
          </View>
          <Text style={styles.promoHeadline}>Up to 50% OFF</Text>
          <Text style={styles.promoSubtitle}>
            Grab top electronics, trendy fashion & accessories today.
          </Text>
          <TouchableOpacity
            style={styles.promoCta}
            onPress={() => router.push('/(user)/CategoriesScreen')}
            activeOpacity={0.85}
          >
            <Text style={styles.promoCtaText}>Shop Collection →</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity
            onPress={() => router.push('/(user)/CategoriesScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>See All ({shop.categories.length})</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {shop.categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() =>
                router.push({
                  pathname: '/(user)/CategoryDetailsScreen',
                  params: { category: cat.name },
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.categoryIconCircle}>
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.productCount} items</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Flash Sale Banner & Timer */}
        <View style={styles.flashHeader}>
          <View style={styles.flashTitleRow}>
            <Text style={styles.flashBolt}>⚡</Text>
            <Text style={styles.sectionTitle}>Flash Sale</Text>
          </View>
          <View style={styles.timerRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeDigit}>
                {String(timeLeft.h).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.timeColon}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeDigit}>
                {String(timeLeft.m).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.timeColon}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeDigit}>
                {String(timeLeft.s).padStart(2, '0')}
              </Text>
            </View>
          </View>
        </View>

        {/* Flash Products Grid */}
        <View style={styles.productGrid}>
          {flashSaleProducts.map(renderProductCard)}
        </View>

        {/* Popular Products */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(user)/CategoryDetailsScreen',
                params: { category: 'Electronics' },
              })
            }
          >
            <Text style={styles.seeAllText}>View More</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {popularProducts.map(renderProductCard)}
        </View>

        {/* New Arrivals */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>New Arrivals</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(user)/CategoryDetailsScreen',
                params: { category: 'Fashion' },
              })
            }
          >
            <Text style={styles.seeAllText}>Explore</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {newArrivals.map(renderProductCard)}
        </View>

        {/* Recommended For You */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
        </View>

        <View style={styles.productGrid}>
          {recommended.map(renderProductCard)}
        </View>
      </ScrollView>

      {/* Unified Professional Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(user)/HomeScreen')}
          activeOpacity={0.8}
        >
          <Text style={[styles.navIcon, styles.activeNavIcon]}>🏠</Text>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/(user)/CategoriesScreen')}
          activeOpacity={0.8}
        >
          <Text style={styles.navIcon}>📂</Text>
          <Text style={styles.navLabel}>Categories</Text>
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
                <Text style={styles.badgeText}>
                  {shop.cartTotals.totalItems}
                </Text>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  greetingBox: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 18,
    color: '#171717',
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  adminSwitchBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  adminSwitchText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '800',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 18,
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  notifBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    backgroundColor: '#F7F7FA',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
  },
  searchFilterIcon: {
    backgroundColor: '#F0EEFF',
    padding: 6,
    borderRadius: 8,
  },
  promoBanner: {
    backgroundColor: '#5B4BFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  promoBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoHeadline: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  promoSubtitle: {
    fontSize: 13,
    color: '#E0DDFF',
    lineHeight: 18,
    marginBottom: 16,
    maxWidth: '85%',
  },
  promoCta: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  promoCtaText: {
    color: '#5B4BFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  categoriesScroll: {
    paddingVertical: 6,
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 76,
  },
  categoryIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171717',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 10,
    color: '#8E8E93',
  },
  flashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 14,
  },
  flashTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flashBolt: {
    fontSize: 20,
    marginRight: 6,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBox: {
    backgroundColor: '#171717',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  timeDigit: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  timeColon: {
    marginHorizontal: 3,
    fontWeight: '800',
    color: '#171717',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F5F7',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  wishlistIcon: {
    fontSize: 14,
  },
  productInfo: {
    padding: 10,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
    height: 34,
    lineHeight: 17,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  starText: {
    fontSize: 12,
    color: '#F59E0B',
    marginRight: 3,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#171717',
    marginRight: 2,
  },
  reviewCount: {
    fontSize: 10,
    color: '#8E8E93',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B4BFF',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 11,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  addCartBtn: {
    backgroundColor: '#F0EEFF',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addCartText: {
    color: '#5B4BFF',
    fontSize: 12,
    fontWeight: '700',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
