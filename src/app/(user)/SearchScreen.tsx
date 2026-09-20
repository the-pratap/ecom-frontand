import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

const POPULAR_SUGGESTIONS = [
  'Headphones',
  'Watch',
  'Keyboard',
  'Sneakers',
  'Hoodie',
  'Lamp',
  'Backpack',
  'Coffee',
];

export default function SearchScreen() {
  const shop = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<'relevance' | 'priceLow' | 'priceHigh' | 'rating'>('relevance');

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    let list = shop.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    if (activeSort === 'priceLow') {
      list.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (activeSort === 'priceHigh') {
      list.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (activeSort === 'rating') {
      list.sort((a, b) => b.averageRating - a.averageRating);
    }

    return list;
  }, [shop.products, searchQuery, activeSort]);

  const handleSelectKeyword = (term: string) => {
    setSearchQuery(term);
    shop.addRecentSearch(term);
  };

  const handleSubmitSearch = () => {
    if (searchQuery.trim()) {
      shop.addRecentSearch(searchQuery);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Search Header Bar */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Text style={styles.searchPrefix}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search products, brands, or categories..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSubmitSearch}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!searchQuery.trim() ? (
          <View style={styles.suggestionsContainer}>
            {/* Recent Searches */}
            {shop.recentSearches.length > 0 && (
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={shop.clearRecentSearches}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.pillContainer}>
                  {shop.recentSearches.map((term, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recentPill}
                      onPress={() => handleSelectKeyword(term)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.clockIcon}>🕒</Text>
                      <Text style={styles.pillText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Suggestions */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Trending Searches</Text>
              <View style={styles.pillContainer}>
                {POPULAR_SUGGESTIONS.map((term, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.trendPill}
                    onPress={() => handleSelectKeyword(term)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.fireIcon}>🔥</Text>
                    <Text style={styles.trendPillText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Featured Categories Quick Jump */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
              <View style={styles.catGrid}>
                {shop.categories.slice(0, 6).map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.catCard}
                    onPress={() =>
                      router.push({
                        pathname: '/(user)/CategoryDetailsScreen',
                        params: { category: cat.name },
                      })
                    }
                  >
                    <Text style={styles.catEmoji}>{cat.icon}</Text>
                    <Text style={styles.catName}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                Found{' '}
                <Text style={styles.highlightCount}>
                  {searchResults.length}
                </Text>{' '}
                results for "{searchQuery}"
              </Text>
            </View>

            {searchResults.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sortBar}
              >
                <TouchableOpacity
                  style={[
                    styles.sortChip,
                    activeSort === 'relevance' && styles.activeSortChip,
                  ]}
                  onPress={() => setActiveSort('relevance')}
                >
                  <Text
                    style={[
                      styles.sortText,
                      activeSort === 'relevance' && styles.activeSortText,
                    ]}
                  >
                    Best Match
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortChip,
                    activeSort === 'rating' && styles.activeSortChip,
                  ]}
                  onPress={() => setActiveSort('rating')}
                >
                  <Text
                    style={[
                      styles.sortText,
                      activeSort === 'rating' && styles.activeSortText,
                    ]}
                  >
                    Top Rated ★
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortChip,
                    activeSort === 'priceLow' && styles.activeSortChip,
                  ]}
                  onPress={() => setActiveSort('priceLow')}
                >
                  <Text
                    style={[
                      styles.sortText,
                      activeSort === 'priceLow' && styles.activeSortText,
                    ]}
                  >
                    Price: Low to High
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortChip,
                    activeSort === 'priceHigh' && styles.activeSortChip,
                  ]}
                  onPress={() => setActiveSort('priceHigh')}
                >
                  <Text
                    style={[
                      styles.sortText,
                      activeSort === 'priceHigh' && styles.activeSortText,
                    ]}
                  >
                    Price: High to Low
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {searchResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🛍️</Text>
                <Text style={styles.emptyTitle}>No matching items found</Text>
                <Text style={styles.emptySubtitle}>
                  We couldn't find anything matching "{searchQuery}". Check for spelling errors or try searching for "Headphones", "Shoes", or "Watch".
                </Text>
                <TouchableOpacity
                  style={styles.browseAllBtn}
                  onPress={() => router.push('/(user)/CategoriesScreen')}
                >
                  <Text style={styles.browseAllText}>Browse All Categories</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.productGrid}>
                {searchResults.map((product: Product) => {
                  const isWishlisted = shop.isInWishlist(product.id);
                  const discountPercent = Math.round(
                    ((product.price - product.discountPrice) / product.price) * 100
                  );

                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={[styles.productCard, { width: cardWidth }]}
                      activeOpacity={0.9}
                      onPress={() => {
                        shop.addRecentSearch(searchQuery);
                        router.push({
                          pathname: '/(user)/ProductDetailsScreen',
                          params: { productId: product.id },
                        });
                      }}
                    >
                      <View style={styles.imageContainer}>
                        <Image
                          source={{ uri: product.thumbnail }}
                          style={styles.productImage}
                          resizeMode="cover"
                        />
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountBadgeText}>
                            -{discountPercent}%
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.wishlistBtn}
                          onPress={() => shop.toggleWishlist(product)}
                          activeOpacity={0.8}
                        >
                          <Text style={{ fontSize: 13 }}>
                            {isWishlisted ? '❤️' : '🤍'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.productInfo}>
                        <Text style={styles.brandText}>{product.brand}</Text>
                        <Text style={styles.productName} numberOfLines={2}>
                          {product.name}
                        </Text>

                        <View style={styles.ratingRow}>
                          <Text style={styles.starText}>★</Text>
                          <Text style={styles.ratingValue}>
                            {product.averageRating}
                          </Text>
                          <Text style={styles.reviewCount}>
                            ({product.totalReviews})
                          </Text>
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
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    marginRight: 10,
  },
  backIcon: {
    fontSize: 18,
    color: '#171717',
    fontWeight: '700',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchPrefix: {
    fontSize: 15,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#171717',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 12,
    color: '#8E8E93',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: '#F7F7FA',
    minHeight: '100%',
  },
  suggestionsContainer: {},
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 10,
  },
  clearAllText: {
    fontSize: 12,
    color: '#5B4BFF',
    fontWeight: '600',
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  clockIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  pillText: {
    fontSize: 13,
    color: '#171717',
    fontWeight: '500',
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2DEFF',
  },
  fireIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  trendPillText: {
    fontSize: 13,
    color: '#5B4BFF',
    fontWeight: '700',
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  catCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  catEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  catName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171717',
    textAlign: 'center',
  },
  resultsHeader: {
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: '#777777',
  },
  highlightCount: {
    fontWeight: '800',
    color: '#5B4BFF',
  },
  sortBar: {
    paddingBottom: 12,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  activeSortChip: {
    backgroundColor: '#5B4BFF',
    borderColor: '#5B4BFF',
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
  },
  activeSortText: {
    color: '#FFFFFF',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 140,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 10,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '700',
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
    paddingVertical: 7,
    alignItems: 'center',
  },
  addCartText: {
    color: '#5B4BFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  browseAllBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseAllText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
