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

export default function CheckoutScreen() {
  const shop = useShop();

  const [orderNotes, setOrderNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  // Active delivery address
  const currentAddress =
    shop.addresses.find((a) => a.id === shop.selectedAddressId) ||
    shop.addresses[0];

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const res = shop.applyCoupon(couponCode);
    setCouponFeedback(res.message);
    if (res.success) setCouponCode('');
  };

  const handleProceedToPayment = () => {
    if (!currentAddress) {
      Alert.alert('Address Missing', 'Please add or select a delivery address.');
      return;
    }
    if (shop.cart.length === 0) {
      Alert.alert('Empty Order', 'Your cart has no items.');
      router.replace('/(user)/HomeScreen');
      return;
    }
    router.push('/(user)/PaymentScreen');
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
        <Text style={styles.headerTitle}>Order Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Checkout Progress Stepper */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepCompleted]}>
            <Text style={styles.stepNumberCompleted}>✓</Text>
          </View>
          <Text style={styles.stepLabelActive}>Cart</Text>
        </View>
        <View style={[styles.stepLine, styles.stepLineActive]} />
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, styles.stepActive]}>
            <Text style={styles.stepNumberActive}>2</Text>
          </View>
          <Text style={styles.stepLabelActive}>Review</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepItem}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Payment</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>📍 Delivery Address</Text>
            <TouchableOpacity
              onPress={() => router.push('/(user)/AddressScreen')}
              activeOpacity={0.7}
            >
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>

          {currentAddress ? (
            <View style={styles.addressInfo}>
              <View style={styles.recipientRow}>
                <Text style={styles.recipientName}>{currentAddress.name}</Text>
                {currentAddress.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressLine}>{currentAddress.street}</Text>
              <Text style={styles.addressLine}>
                {currentAddress.city}, {currentAddress.state} - {currentAddress.pincode}
              </Text>
              <Text style={styles.phoneLine}>📞 Phone: {currentAddress.phone}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addAddressNotice}
              onPress={() => router.push('/(user)/AddressScreen')}
            >
              <Text style={styles.addAddressText}>+ Add Delivery Address</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Selected Items Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            🛍️ Order Items ({shop.cartTotals.totalItems})
          </Text>

          {shop.cart.map((item: CartItem) => {
            const variantText = [item.variant.color, item.variant.size]
              .filter(Boolean)
              .join(' • ');

            return (
              <View key={item.id} style={styles.itemRow}>
                <Image
                  source={{ uri: item.product.thumbnail }}
                  style={styles.itemThumb}
                  resizeMode="cover"
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  {variantText ? (
                    <Text style={styles.itemVariant}>{variantText}</Text>
                  ) : null}
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  ₹{(item.discountPrice * item.quantity).toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Coupon Box */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎟️ Have a Promo Coupon?</Text>
          <View style={styles.couponInputRow}>
            <TextInput
              style={styles.couponInput}
              placeholder="e.g. WELCOME10 or SAVE200"
              placeholderTextColor="#8E8E93"
              autoCapitalize="characters"
              value={couponCode}
              onChangeText={(t) => {
                setCouponCode(t);
                setCouponFeedback(null);
              }}
            />
            <TouchableOpacity
              style={styles.couponApplyBtn}
              onPress={handleApplyCoupon}
            >
              <Text style={styles.couponApplyText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {couponFeedback ? (
            <Text style={styles.feedbackText}>{couponFeedback}</Text>
          ) : null}

          {shop.appliedCoupon && (
            <View style={styles.activeCouponRow}>
              <Text style={styles.activeCouponText}>
                ✓ Applied: {shop.appliedCoupon.code} ({shop.appliedCoupon.description})
              </Text>
              <TouchableOpacity onPress={shop.removeCoupon}>
                <Text style={styles.removeCouponText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Order Delivery Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 Delivery Instructions (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g. Leave package with security guard, ring bell twice..."
            placeholderTextColor="#8E8E93"
            multiline
            numberOfLines={3}
            value={orderNotes}
            onChangeText={setOrderNotes}
          />
        </View>

        {/* Dynamic Billing Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🧾 Price Details</Text>

          <View style={styles.billLine}>
            <Text style={styles.billLabel}>
              Subtotal ({shop.cartTotals.totalItems} items)
            </Text>
            <Text style={styles.billVal}>
              ₹{shop.cartTotals.subtotal.toLocaleString()}
            </Text>
          </View>

          <View style={styles.billLine}>
            <Text style={styles.billLabel}>Product Savings</Text>
            <Text style={[styles.billVal, styles.greenText]}>
              −₹{shop.cartTotals.totalDiscount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.billLine}>
            <Text style={styles.billLabel}>Shipping & Delivery</Text>
            <Text style={styles.billVal}>
              ₹{shop.cartTotals.totalShipping.toLocaleString()}
            </Text>
          </View>

          {shop.cartTotals.couponDiscount > 0 && (
            <View style={styles.billLine}>
              <Text style={styles.billLabel}>
                Coupon Discount ({shop.appliedCoupon?.code})
              </Text>
              <Text style={[styles.billVal, styles.greenText]}>
                −₹{shop.cartTotals.couponDiscount.toFixed(0)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalSavingsTag}>
                Total Savings: ₹{shop.cartTotals.totalSavings.toFixed(0)}
              </Text>
            </View>
            <Text style={styles.totalVal}>
              ₹{shop.cartTotals.grandTotal.toFixed(0)}
            </Text>
          </View>
        </View>

        {/* Proceed to Payment CTA */}
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleProceedToPayment}
          activeOpacity={0.85}
        >
          <Text style={styles.payBtnText}>
            Proceed to Payment (₹{shop.cartTotals.grandTotal.toFixed(0)}) →
          </Text>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepActive: {
    backgroundColor: '#5B4BFF',
  },
  stepCompleted: {
    backgroundColor: '#16A34A',
  },
  stepNumber: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '700',
  },
  stepNumberActive: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepNumberCompleted: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  stepLabel: {
    fontSize: 11,
    color: '#777777',
    fontWeight: '500',
  },
  stepLabelActive: {
    fontSize: 11,
    color: '#171717',
    fontWeight: '700',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: '#16A34A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 10,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  addressInfo: {
    backgroundColor: '#F7F7FA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: '#5B4BFF',
    fontSize: 9,
    fontWeight: '800',
  },
  addressLine: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  phoneLine: {
    fontSize: 12,
    color: '#171717',
    fontWeight: '600',
    marginTop: 4,
  },
  addAddressNotice: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5B4BFF',
    alignItems: 'center',
  },
  addAddressText: {
    color: '#5B4BFF',
    fontSize: 13,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  itemThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
  },
  itemVariant: {
    fontSize: 11,
    color: '#5B4BFF',
    marginTop: 2,
  },
  itemQty: {
    fontSize: 11,
    color: '#777777',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171717',
  },
  couponInputRow: {
    flexDirection: 'row',
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
  couponApplyBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  couponApplyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  feedbackText: {
    fontSize: 12,
    marginTop: 6,
    color: '#5B4BFF',
    fontWeight: '600',
  },
  activeCouponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  activeCouponText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  removeCouponText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
  },
  notesInput: {
    backgroundColor: '#F7F7FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#171717',
    textAlignVertical: 'top',
  },
  billLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: '#777777',
  },
  billVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717',
  },
  greenText: {
    color: '#16A34A',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
  },
  totalSavingsTag: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '700',
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#5B4BFF',
  },
  payBtn: {
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
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
