import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useShop, Product } from '../ShopStore';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams<{ productId?: string }>();
  const shop = useShop();

  const productId = params.productId || 'p1';
  const product =
    shop.products.find((p) => p.id === productId) || shop.products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const availableColors = product.variants.colors || [];
  const availableSizes = product.variants.sizes || [];

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    availableColors[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    availableSizes[0]
  );

  const [quantity, setQuantity] = useState(1);

  const isWishlisted = shop.isInWishlist(product.id, {
    color: selectedColor,
    size: selectedSize,
  });

  const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  const similarProducts = shop.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleQuantityDelta = (delta: number) => {
    const nextQty = quantity + delta;
    if (nextQty < 1) return;
    if (nextQty > product.stock) {
      Alert.alert('Stock Limit', `Only ${product.stock} units available in stock.`);
      return;
    }
    setQuantity(nextQty);
  };

  const handleAddToCart = () => {
    const res = shop.addToCart(
      product,
      { color: selectedColor, size: selectedSize },
      quantity
    );
    Alert.alert(
      res.success ? 'Success! 🎉' : 'Note',
      res.message,
      [
        { text: 'Keep Shopping' },
        { text: 'View Cart 🛒', onPress: () => router.push('/(user)/CartScreen') },
      ]
    );
  };

  const handleBuyNow = () => {
    shop.addToCart(
      product,
      { color: selectedColor, size: selectedSize },
      quantity
    );
    router.push('/(user)/CheckoutScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.circleBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.topIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle} numberOfLines={1}>
          {product.name}
        </Text>

        <View style={styles.topRightRow}>
          <TouchableOpacity
            onPress={() =>
              shop.toggleWishlist(product, {
                color: selectedColor,
                size: selectedSize,
              })
            }
            style={styles.circleBtn}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(user)/CartScreen')}
            style={[styles.circleBtn, { marginLeft: 8 }]}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16 }}>🛒</Text>
            {shop.cartTotals.totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {shop.cartTotals.totalItems}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Image Carousel */}
        <View style={styles.galleryContainer}>
          <Image
            source={{ uri: product.images[activeImageIndex] || product.thumbnail }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          <View style={styles.floatingBadges}>
            <View style={styles.discountTag}>
              <Text style={styles.discountTagText}>-{discountPercent}% OFF</Text>
            </View>
            <View style={styles.stockTag}>
              <Text style={styles.stockTagText}>
                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {product.images.length > 1 && (
            <View style={styles.thumbStrip}>
              {product.images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.thumbItem,
                    activeImageIndex === idx && styles.activeThumb,
                  ]}
                  onPress={() => setActiveImageIndex(idx)}
                >
                  <Image source={{ uri: img }} style={styles.thumbImg} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View style={styles.detailsBox}>
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>{product.brand}</Text>
            <View style={styles.soldBadge}>
              <Text style={styles.soldText}>🔥 {product.soldCount}+ Sold</Text>
            </View>
          </View>

          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Rating and Reviews trigger */}
          <TouchableOpacity
            style={styles.ratingBox}
            onPress={() =>
              router.push({
                pathname: '/(user)/ReviewsScreen',
                params: { productId: product.id },
              })
            }
            activeOpacity={0.7}
          >
            <View style={styles.starBadge}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.starScore}>{product.averageRating}</Text>
            </View>
            <Text style={styles.ratingTotalText}>
              ({product.totalReviews} verified reviews)
            </Text>
            <Text style={styles.seeReviewsLink}>Read All →</Text>
          </TouchableOpacity>

          {/* Price breakdown */}
          <View style={styles.priceCard}>
            <View style={styles.priceLeft}>
              <Text style={styles.effectivePrice}>
                ₹{product.discountPrice.toLocaleString()}
              </Text>
              <Text style={styles.originalStrike}>
                ₹{product.price.toLocaleString()}
              </Text>
            </View>
            <View style={styles.shippingNotice}>
              <Text style={styles.shippingText}>
                🚚 Delivery: ₹{product.shippingCharge}
              </Text>
            </View>
          </View>

          {/* Variant: Color Selection */}
          {availableColors.length > 0 && (
            <View style={styles.variantSection}>
              <Text style={styles.variantLabel}>
                Color:{' '}
                <Text style={styles.variantSelectedValue}>{selectedColor}</Text>
              </Text>
              <View style={styles.variantOptionsRow}>
                {availableColors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorChip,
                        isSelected && styles.colorChipSelected,
                      ]}
                      onPress={() => setSelectedColor(color)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.colorChipText,
                          isSelected && styles.colorChipTextSelected,
                        ]}
                      >
                        {color}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Variant: Size Selection */}
          {availableSizes.length > 0 && (
            <View style={styles.variantSection}>
              <Text style={styles.variantLabel}>
                Size / Type:{' '}
                <Text style={styles.variantSelectedValue}>{selectedSize}</Text>
              </Text>
              <View style={styles.variantOptionsRow}>
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeChip,
                        isSelected && styles.sizeChipSelected,
                      ]}
                      onPress={() => setSelectedSize(size)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.sizeChipText,
                          isSelected && styles.sizeChipTextSelected,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.variantLabel}>Quantity</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => handleQuantityDelta(-1)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => handleQuantityDelta(1)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyBtnText}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Description */}
          <View style={styles.descSection}>
            <Text style={styles.descHeading}>Product Description</Text>
            <Text style={styles.descBody}>{product.description}</Text>
          </View>

          {/* Benefits Grid */}
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🛡️</Text>
              <Text style={styles.benefitTitle}>1 Year Warranty</Text>
              <Text style={styles.benefitSub}>100% genuine guaranteed</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>🔄</Text>
              <Text style={styles.benefitTitle}>7 Days Return</Text>
              <Text style={styles.benefitSub}>Hassle-free doorstep pickup</Text>
            </View>
          </View>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <View style={styles.similarSection}>
              <Text style={styles.similarHeading}>Similar In This Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similarProducts.map((sp) => (
                  <TouchableOpacity
                    key={sp.id}
                    style={styles.similarCard}
                    onPress={() => {
                      router.push({
                        pathname: '/(user)/ProductDetailsScreen',
                        params: { productId: sp.id },
                      });
                    }}
                  >
                    <Image
                      source={{ uri: sp.thumbnail }}
                      style={styles.similarImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.similarName} numberOfLines={1}>
                      {sp.name}
                    </Text>
                    <Text style={styles.similarPrice}>
                      ₹{sp.discountPrice.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[
            styles.wishlistBottomBtn,
            isWishlisted && styles.wishlistBottomBtnActive,
          ]}
          onPress={() =>
            shop.toggleWishlist(product, {
              color: selectedColor,
              size: selectedSize,
            })
          }
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addCartBottomBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Text style={styles.addCartBottomText}>+ Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyNowBottomBtn}
          onPress={handleBuyNow}
          activeOpacity={0.85}
        >
          <Text style={styles.buyNowBottomText}>Buy Now ⚡</Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F7F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  topTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    marginHorizontal: 12,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scrollContent: {
    paddingBottom: 90,
  },
  galleryContainer: {
    width: '100%',
    height: width * 0.85,
    backgroundColor: '#F5F5F7',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  floatingBadges: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
  },
  discountTag: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
  },
  discountTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  stockTag: {
    backgroundColor: 'rgba(23,23,23,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  thumbStrip: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  thumbItem: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  activeThumb: {
    borderColor: '#5B4BFF',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  detailsBox: {
    padding: 20,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B4BFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  soldBadge: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  soldText: {
    fontSize: 11,
    color: '#E11D48',
    fontWeight: '700',
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#171717',
    lineHeight: 28,
    marginBottom: 10,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  starIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    marginRight: 2,
  },
  starScore: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  ratingTotalText: {
    fontSize: 13,
    color: '#777777',
    flex: 1,
  },
  seeReviewsLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  effectivePrice: {
    fontSize: 26,
    fontWeight: '900',
    color: '#5B4BFF',
    marginRight: 10,
  },
  originalStrike: {
    fontSize: 15,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  shippingNotice: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  shippingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#171717',
  },
  variantSection: {
    marginBottom: 16,
  },
  variantLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },
  variantSelectedValue: {
    color: '#5B4BFF',
  },
  variantOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F7F7FA',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    marginRight: 8,
    marginBottom: 8,
  },
  colorChipSelected: {
    backgroundColor: '#F0EEFF',
    borderColor: '#5B4BFF',
  },
  colorChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  colorChipTextSelected: {
    color: '#5B4BFF',
    fontWeight: '700',
  },
  sizeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F7F7FA',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    marginRight: 8,
    marginBottom: 8,
  },
  sizeChipSelected: {
    backgroundColor: '#F0EEFF',
    borderColor: '#5B4BFF',
  },
  sizeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  sizeChipTextSelected: {
    color: '#5B4BFF',
    fontWeight: '700',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 20,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  qtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
    paddingHorizontal: 12,
  },
  descSection: {
    marginBottom: 20,
  },
  descHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 8,
  },
  descBody: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
  },
  benefitsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  benefitItem: {
    width: '48%',
    backgroundColor: '#F7F7FA',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  benefitIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  benefitSub: {
    fontSize: 11,
    color: '#777777',
  },
  similarSection: {
    marginTop: 10,
  },
  similarHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 12,
  },
  similarCard: {
    width: 120,
    marginRight: 12,
  },
  similarImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#F5F5F7',
  },
  similarName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  similarPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5B4BFF',
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  wishlistBottomBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F7F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: 10,
  },
  wishlistBottomBtnActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FF6B6B',
  },
  addCartBottomBtn: {
    flex: 1,
    backgroundColor: '#F0EEFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#5B4BFF',
  },
  addCartBottomText: {
    color: '#5B4BFF',
    fontSize: 14,
    fontWeight: '700',
  },
  buyNowBottomBtn: {
    flex: 1,
    backgroundColor: '#5B4BFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buyNowBottomText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
