import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useShop, Order } from '../ShopStore';

export default function OrderDetailsScreen() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const shop = useShop();

  const orderId = params.orderId;
  const order = shop.orders.find((o) => o.id === orderId) || shop.orders[0];

  const handleCancelOrder = () => {
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      Alert.alert('Notice', `This order cannot be cancelled as it is already ${order.status.toLowerCase()}.`);
      return;
    }

    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? Any payments will be refunded to your original payment source.',
      [
        { text: 'No, Keep Order', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            shop.cancelOrder(order.id);
            Alert.alert('Order Cancelled', 'Your order has been cancelled.');
          },
        },
      ]
    );
  };

  const getStatusBadgeStyle = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#DCFCE7', text: '#16A34A' };
      case 'Shipped':
        return { bg: '#E0E7FF', text: '#4338CA' };
      case 'Processing':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'Pending':
        return { bg: '#F3F4F6', text: '#4B5563' };
      case 'Cancelled':
        return { bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  const badgeStyle = getStatusBadgeStyle(order.status);
  const firstProductId = order.items[0]?.product.id;

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
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Identifier & Status Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerTop}>
            <View>
              <Text style={styles.bannerOrderLabel}>ORDER ID</Text>
              <Text style={styles.bannerOrderId}>{order.id}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: badgeStyle.bg },
              ]}
            >
              <Text style={[styles.statusText, { color: badgeStyle.text }]}>
                {order.status}
              </Text>
            </View>
          </View>
          <Text style={styles.bannerDate}>
            Placed on {order.date} • Estimated delivery: {order.estimatedDelivery}
          </Text>

          {/* Quick Tracking Action */}
          {order.status !== 'Cancelled' && (
            <TouchableOpacity
              style={styles.trackCardAction}
              onPress={() =>
                router.push({
                  pathname: '/(user)/TrackOrderScreen',
                  params: { orderId: order.id },
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.trackActionLeft}>
                <Text style={styles.courierName}>🚚 {order.courier}</Text>
                <Text style={styles.trackingIdText}>
                  Tracking #{order.trackingId}
                </Text>
              </View>
              <Text style={styles.trackActionArrow}>Live Map & Timeline →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Ordered Products List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Purchased Products ({order.items.length})
          </Text>

          {order.items.map((item, idx) => {
            const variantText = [item.variant.color, item.variant.size]
              .filter(Boolean)
              .join(' • ');

            return (
              <View key={idx} style={styles.productRow}>
                <Image
                  source={{ uri: item.product.thumbnail }}
                  style={styles.productThumb}
                  resizeMode="cover"
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productBrand}>{item.product.brand}</Text>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  {variantText ? (
                    <Text style={styles.variantBadge}>
                      Variant: {variantText}
                    </Text>
                  ) : null}
                  <Text style={styles.qtyText}>
                    ₹{item.discountPrice.toLocaleString()} × {item.quantity} qty
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  ₹{(item.discountPrice * item.quantity).toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Shipping Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Delivery Destination</Text>
          <Text style={styles.recipientName}>{order.address.name}</Text>
          <Text style={styles.addressLine}>{order.address.street}</Text>
          <Text style={styles.addressLine}>
            {order.address.city}, {order.address.state} - {order.address.pincode}
          </Text>
          <Text style={styles.phoneLine}>📞 Phone: {order.address.phone}</Text>
        </View>

        {/* Payment Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💳 Payment & Billing</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Payment Method</Text>
            <Text style={styles.billVal}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Payment Status</Text>
            <Text style={[styles.billVal, styles.paidText]}>
              {order.paymentStatus}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Items Subtotal</Text>
            <Text style={styles.billVal}>
              ₹{order.subtotal.toLocaleString()}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Total Discount</Text>
            <Text style={[styles.billVal, styles.greenText]}>
              −₹{order.discount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Shipping Fee</Text>
            <Text style={styles.billVal}>
              ₹{order.shipping.toLocaleString()}
            </Text>
          </View>

          {order.couponDiscount > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>
                Coupon Applied ({order.couponCode})
              </Text>
              <Text style={[styles.billVal, styles.greenText]}>
                −₹{order.couponDiscount.toFixed(0)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalVal}>
              ₹{order.total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomActions}>
          {order.status !== 'Cancelled' && (
            <TouchableOpacity
              style={styles.trackLargeBtn}
              onPress={() =>
                router.push({
                  pathname: '/(user)/TrackOrderScreen',
                  params: { orderId: order.id },
                })
              }
              activeOpacity={0.85}
            >
              <Text style={styles.trackLargeText}>🚚 Track Shipment</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() =>
              router.push({
                pathname: '/(user)/WriteReviewScreen',
                params: { productId: firstProductId },
              })
            }
            activeOpacity={0.85}
          >
            <Text style={styles.reviewBtnText}>★ Write Product Review</Text>
          </TouchableOpacity>

          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancelOrder}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel This Order</Text>
            </TouchableOpacity>
          )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bannerOrderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  bannerOrderId: {
    fontSize: 18,
    fontWeight: '900',
    color: '#171717',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  bannerDate: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 12,
  },
  trackCardAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    borderRadius: 12,
    padding: 12,
  },
  trackActionLeft: {
    flex: 1,
  },
  courierName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  trackingIdText: {
    fontSize: 11,
    color: '#555555',
    marginTop: 2,
  },
  trackActionArrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  productThumb: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
  },
  variantBadge: {
    fontSize: 11,
    color: '#5B4BFF',
    marginTop: 1,
  },
  qtyText: {
    fontSize: 11,
    color: '#777777',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171717',
  },
  recipientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
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
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: '#777777',
  },
  billVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
  },
  paidText: {
    color: '#16A34A',
  },
  greenText: {
    color: '#16A34A',
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
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#5B4BFF',
  },
  bottomActions: {
    marginTop: 6,
  },
  trackLargeBtn: {
    backgroundColor: '#5B4BFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  trackLargeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  reviewBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    marginBottom: 10,
  },
  reviewBtnText: {
    color: '#171717',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});
