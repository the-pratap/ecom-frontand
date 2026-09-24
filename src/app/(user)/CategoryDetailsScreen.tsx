import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useShop, Product } from '../ShopStore';

const { width } = Dimensions.get('window');
const isTablet = width >= 600;
const cardWidth = isTablet ? (width - 64) / 3 : (width - 48) / 2;

export default function CategoryDetailsScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const shop = useShop();

  const selectedCategoryName = params.category || 'Electronics';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'popular' | 'newest' | 'priceLow' | 'priceHigh' | 'rating'
  >('popular');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filters
  const [selectedPriceRange, setSelectedPriceRange] = useState<'all' | 'under1500' | '1500to4000' | 'above4000'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscountOnly, setMinDiscountOnly] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    let list = shop.products.filter(
      (p) => p.category.toLowerCase() === selectedCategoryName.toLowerCase()
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedPriceRange === 'under1500') {
      list = list.filter((p) => p.discountPrice < 1500);
    } else if (selectedPriceRange === '1500to4000') {
      list = list.filter((p) => p.discountPrice >= 1500 && p.discountPrice <= 4000);
    } else if (selectedPriceRange === 'above4000') {
      list = list.filter((p) => p.discountPrice > 4000);
    }

    if (minRating > 0) {
      list = list.filter((p) => p.averageRating >= minRating);
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    if (minDiscountOnly) {
      list = list.filter(
        (p) => ((p.price - p.discountPrice) / p.price) * 100 >= 20
      );
    }

    if (sortBy === 'popular') {
      list.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'priceLow') {
      list.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (sortBy === 'priceHigh') {
      list.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.averageRating - a.averageRating);
    }

    return list;
  }, [
    shop.products,
    selectedCategoryName,
    searchQuery,
    sortBy,
    selectedPriceRange,
    minRating,
    inStockOnly,
    minDiscountOnly,
  ]);

  const resetFilters = () => {
    setSelectedPriceRange('all');
    setMinRating(0);
    setInStockOnly(false);
    setMinDiscountOnly(false);
    setShowFilterModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>{selectedCategoryName}</Text>
          <Text style={styles.headerSub}>
            {filteredProducts.length} items found
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/(user)/(tabs)',
              params: { tab: 'cart' },
            })
          }
          style={styles.cartIconBtn}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 18 }}>🛒</Text>
          {shop.cartTotals.totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {shop.cartTotals.totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category In-page Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder={`Search within ${selectedCategoryName}...`}
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.filterBtnText}>⚙️ Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Sort Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortBar}
      >
        <TouchableOpacity
          style={[styles.sortChip, sortBy === 'popular' && styles.activeSortChip]}
          onPress={() => setSortBy('popular')}
        >
          <Text style={[styles.sortChipText, sortBy === 'popular' && styles.activeSortText]}>
            🔥 Popular
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortChip, sortBy === 'newest' && styles.activeSortChip]}
          onPress={() => setSortBy('newest')}
        >
          <Text style={[styles.sortChipText, sortBy === 'newest' && styles.activeSortText]}>
            ✨ Newest
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortChip, sortBy === 'priceLow' && styles.activeSortChip]}
          onPress={() => setSortBy('priceLow')}
        >
          <Text style={[styles.sortChipText, sortBy === 'priceLow' && styles.activeSortText]}>
            ₹ Price: Low → High
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortChip, sortBy === 'priceHigh' && styles.activeSortChip]}
          onPress={() => setSortBy('priceHigh')}
        >
          <Text style={[styles.sortChipText, sortBy === 'priceHigh' && styles.activeSortText]}>
            ₹ Price: High → Low
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortChip, sortBy === 'rating' && styles.activeSortChip]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[styles.sortChipText, sortBy === 'rating' && styles.activeSortText]}>
            ★ Rating
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Product List */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No matching products found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search keyword or clearing active filters.
            </Text>
            <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((product: Product) => {
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
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Products</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity
                  style={[styles.filterChip, selectedPriceRange === 'all' && styles.activeFilterChip]}
                  onPress={() => setSelectedPriceRange('all')}
                >
                  <Text style={[styles.filterChipText, selectedPriceRange === 'all' && styles.activeFilterChipText]}>
                    All Prices
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, selectedPriceRange === 'under1500' && styles.activeFilterChip]}
                  onPress={() => setSelectedPriceRange('under1500')}
                >
                  <Text style={[styles.filterChipText, selectedPriceRange === 'under1500' && styles.activeFilterChipText]}>
                    Under ₹1,500
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, selectedPriceRange === '1500to4000' && styles.activeFilterChip]}
                  onPress={() => setSelectedPriceRange('1500to4000')}
                >
                  <Text style={[styles.filterChipText, selectedPriceRange === '1500to4000' && styles.activeFilterChipText]}>
                    ₹1,500 - ₹4,000
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, selectedPriceRange === 'above4000' && styles.activeFilterChip]}
                  onPress={() => setSelectedPriceRange('above4000')}
                >
                  <Text style={[styles.filterChipText, selectedPriceRange === 'above4000' && styles.activeFilterChipText]}>
                    Above ₹4,000
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.filterSectionTitle}>Customer Rating</Text>
              <View style={styles.chipRow}>
                {[0, 4.0, 4.5, 4.8].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.filterChip, minRating === r && styles.activeFilterChip]}
                    onPress={() => setMinRating(r)}
                  >
                    <Text style={[styles.filterChipText, minRating === r && styles.activeFilterChipText]}>
                      {r === 0 ? 'Any Rating' : `${r}★ & above`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterSectionTitle}>Availability & Deals</Text>
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setInStockOnly(!inStockOnly)}
              >
                <Text style={styles.toggleLabel}>In Stock Only</Text>
                <Text style={{ fontSize: 18 }}>{inStockOnly ? '☑️' : '⬜'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setMinDiscountOnly(!minDiscountOnly)}
              >
                <Text style={styles.toggleLabel}>High Discounts (20%+ OFF)</Text>
                <Text style={{ fontSize: 18 }}>{minDiscountOnly ? '☑️' : '⬜'}</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalResetBtn} onPress={resetFilters}>
                <Text style={styles.modalResetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.modalApplyText}>
                  Apply Filters ({filteredProducts.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
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
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  headerSub: {
    fontSize: 11,
    color: '#777777',
    fontWeight: '500',
  },
  cartIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#5B4BFF',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  searchInputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: 10,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: '#171717',
    padding: 0,
  },
  clearSearch: {
    fontSize: 13,
    color: '#8E8E93',
    paddingHorizontal: 4,
  },
  filterBtn: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  sortBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F7F7FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  activeSortChip: {
    backgroundColor: '#5B4BFF',
    borderColor: '#5B4BFF',
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
  },
  activeSortText: {
    color: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    backgroundColor: '#F7F7FA',
    minHeight: '100%',
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
  emptyContainer: {
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
    lineHeight: 18,
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  modalClose: {
    fontSize: 18,
    color: '#777777',
    fontWeight: '700',
    padding: 4,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginTop: 12,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F7F7FA',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  activeFilterChip: {
    backgroundColor: '#F0EEFF',
    borderColor: '#5B4BFF',
  },
  filterChipText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#5B4BFF',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  toggleLabel: {
    fontSize: 14,
    color: '#171717',
    fontWeight: '500',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  modalResetBtn: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
  },
  modalResetText: {
    color: '#777777',
    fontSize: 14,
    fontWeight: '700',
  },
  modalApplyBtn: {
    width: '66%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#5B4BFF',
  },
  modalApplyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
