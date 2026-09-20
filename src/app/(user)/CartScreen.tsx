import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useShop, CartItem } from '../ShopStore';

export default function CartScreen() {
  const shop = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const handleQuantity = (item: CartItem, delta: number) => {
    const res = shop.updateCartQuantity(item.id, delta);
    if (!res.success && res.message) {
      Alert.alert('Quantity Notice', res.message);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponMessage({
        text: 'Please enter a coupon code.',
        isError: true,
      });
      return;
    }

    const res = shop.applyCoupon(couponInput);
    setCouponMessage({
      text: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    if (shop.cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add products to your cart before proceeding.');
      return;
    }
    router.push('/(user)/CheckoutScreen');
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

        <View style={styles.titleBox}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSub}>
            {shop.cartTotals.totalItems} {shop.cartTotals.totalItems === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {shop.cart.length > 0 ? (
          <TouchableOpacity onPress={shop.clearCart} activeOpacity={0.7}>
            <Text style={styles.clearCartText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Cart Empty State */}
      {shop.cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCartCircle}>
            <Text style={styles.emptyCartEmoji}>🛒</Text>
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added any products yet. Browse through our trending deals and collections.
          </Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => router.push('/(user)/HomeScreen')}
            activeOpacity={0.85}
          >
            <Text style={styles.shopNowBtnText}>Start Shopping →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Cart Active Items & Dynamic Calculations */
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cart Items List */}
          <View style={styles.itemsList}>
            {shop.cart.map((item: CartItem) => {
              const variantText = [item.variant.color, item.variant.size]
                .filter(Boolean)
                .join(' • ');

              return (
                <View key={item.id} style={styles.cartCard}>
                  {/* Image */}
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/(user)/ProductDetailsScreen',
                        params: { productId: item.product.id },
                      })
                    }
                  >
                    <Image
                      source={{ uri: item.product.thumbnail }}
                      style={styles.productThumb}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  {/* Info */}
                  <View style={styles.cardDetails}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.brandText}>{item.product.brand}</Text>
                      <TouchableOpacity
                        onPress={() => shop.removeFromCart(item.id)}
                        style={styles.removeIconBtn}
                      >
                        <Text style={styles.removeIcon}>✕</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: '/(user)/ProductDetailsScreen',
                          params: { productId: item.product.id },
                        })
                      }
                    >
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                    </TouchableOpacity>

                    {variantText ? (
                      <Text style={styles.variantBadge}>
                        Variant: {variantText}
                      </Text>
                    ) : null}

                    {/* Price and Quantity Controller */}
                    <View style={styles.priceAndQtyRow}>
                      <View>
                        <Text style={styles.itemEffectivePrice}>
                          ₹{(item.discountPrice * item.quantity).toLocaleString()}
                        </Text>
                        <Text style={styles.itemUnitDiscount}>
                          ₹{item.discountPrice} each (saved ₹
                          {(item.price - item.discountPrice) * item.quantity})
                        </Text>
                      </View>

                      <View style={styles.qtyControl}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => handleQuantity(item, -1)}
                        >
                          <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => handleQuantity(item, 1)}
                        >
                          <Text style={styles.qtyBtnText}>＋</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Promo Coupon Box */}
          <View style={styles.couponCard}>
            <Text style={styles.couponTitle}>Apply Discount Coupon</Text>
            <View style={styles.couponInputRow}>
              <TextInput
                style={styles.couponInput}
                placeholder="WELCOME10 or SAVE200"
                placeholderTextColor="#8E8E93"
                autoCapitalize="characters"
                value={couponInput}
                onChangeText={(t) => {
                  setCouponInput(t);
                  setCouponMessage(null);
                }}
              />
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handleApplyCoupon}
                activeOpacity={0.8}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>

            {couponMessage && (
              <Text
                style={[
                  styles.couponMessageText,
                  couponMessage.isError
                    ? styles.couponErrorText
                    : styles.couponSuccessText,
                ]}
              >
                {couponMessage.text}
              </Text>
            )}

            {/* If coupon is active */}
            {shop.appliedCoupon && (
              <View style={styles.activeCouponBadge}>
                <Text style={styles.activeCouponCode}>
                  🏷️ Code {shop.appliedCoupon.code} applied!
                </Text>
                <TouchableOpacity onPress={shop.removeCoupon}>
                  <Text style={styles.removeCouponText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Dynamic Order Price Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Price Summary</Text>

            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>
                Total Items ({shop.cartTotals.totalItems})
              </Text>
              <Text style={styles.summaryVal}>
                ₹{(shop.cartTotals.subtotal + shop.cartTotals.totalDiscount).toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Product Discount</Text>
              <Text style={[styles.summaryVal, styles.discountGreen]}>
                −₹{shop.cartTotals.totalDiscount.toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryVal}>
                ₹{shop.cartTotals.subtotal.toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Estimated Shipping</Text>
              <Text style={styles.summaryVal}>
                ₹{shop.cartTotals.totalShipping.toLocaleString()}
              </Text>
            </View>

            {shop.cartTotals.couponDiscount > 0 && (
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>
                  Coupon Savings ({shop.appliedCoupon?.code})
                </Text>
                <Text style={[styles.summaryVal, styles.discountGreen]}>
                  −₹{shop.cartTotals.couponDiscount.toFixed(0)}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalLine}>
              <View>
                <Text style={styles.grandTotalLabel}>Grand Total</Text>
                <Text style={styles.savingsTag}>
                  🎉 You are saving ₹{shop.cartTotals.totalSavings.toFixed(0)}
                </Text>
              </View>
              <Text style={styles.grandTotalVal}>
                ₹{shop.cartTotals.grandTotal.toFixed(0)}
              </Text>
            </View>
          </View>

          {/* Checkout CTA Button */}
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            <Text style={styles.checkoutBtnText}>
              Proceed to Checkout (₹{shop.cartTotals.grandTotal.toFixed(0)}) →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

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
            <Text style={[styles.navIcon, styles.activeNavIcon]}>🛒</Text>
            {shop.cartTotals.totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{shop.cartTotals.totalItems}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Cart</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  titleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  headerSub: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '500',
  },
  clearCartText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCartCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyCartEmoji: {
    fontSize: 38,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  shopNowBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  shopNowBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: '#F7F7FA',
  },
  itemsList: {
    marginBottom: 16,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  productThumb: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  removeIconBtn: {
    padding: 2,
  },
  removeIcon: {
    fontSize: 14,
    color: '#8E8E93',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  variantBadge: {
    fontSize: 11,
    color: '#5B4BFF',
    fontWeight: '600',
    marginBottom: 6,
  },
  priceAndQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemEffectivePrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
  },
  itemUnitDiscount: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '600',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
  },
  qtyValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#171717',
    paddingHorizontal: 8,
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 10,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#F7F7FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#171717',
    marginRight: 8,
  },
  applyBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  couponMessageText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  couponErrorText: {
    color: '#DC2626',
  },
  couponSuccessText: {
    color: '#16A34A',
  },
  activeCouponBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  activeCouponCode: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '700',
  },
  removeCouponText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#777777',
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  discountGreen: {
    color: '#16A34A',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 12,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
  },
  savingsTag: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '700',
    marginTop: 2,
  },
  grandTotalVal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#5B4BFF',
  },
  checkoutBtn: {
    backgroundColor: '#5B4BFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
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
