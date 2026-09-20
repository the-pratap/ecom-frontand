import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useShop, Order } from '../ShopStore';

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const shop = useShop();

  const orderId = params.orderId;
  const order: Order | undefined = shop.orders.find((o) => o.id === orderId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Celebration Graphic */}
        <View style={styles.successIconCircle}>
          <Text style={styles.checkmarkIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Thank you for shopping with ShopNest. We have received your order and are preparing it for shipment.
        </Text>

        {/* Order Details Receipt Card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptHeaderLabel}>ORDER IDENTIFIER</Text>
            <Text style={styles.orderIdText}>{order?.id || orderId || 'SN-20260921-1001'}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Total Amount Paid</Text>
            <Text style={styles.receiptValHighlight}>
              ₹{order?.total.toLocaleString() || '4,388'}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Payment Method</Text>
            <Text style={styles.receiptVal}>
              {order?.paymentMethod || 'UPI (Google Pay)'}
            </Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Payment Status</Text>
            <View style={styles.paidBadge}>
              <Text style={styles.paidText}>
                {order?.paymentStatus || 'Paid'}
              </Text>
            </View>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Estimated Delivery</Text>
            <Text style={styles.receiptVal}>
              {order?.estimatedDelivery || '3 to 5 business days'}
            </Text>
          </View>

          <View style={styles.receiptDivider} />

          {/* Delivery Address Summary */}
          <Text style={styles.addressTitle}>Shipping Destination</Text>
          <Text style={styles.addressText}>
            {order?.address.name || 'Rahul Das'}
          </Text>
          <Text style={styles.addressSub}>
            {order?.address.street || '21 College Road'}, {order?.address.city || 'Bolpur'},{' '}
            {order?.address.state || 'West Bengal'} - {order?.address.pincode || '731204'}
          </Text>
          <Text style={styles.addressPhone}>
            📞 {order?.address.phone || '9876543210'}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() =>
              router.push({
                pathname: '/(user)/TrackOrderScreen',
                params: { orderId: order?.id || orderId },
              })
            }
            activeOpacity={0.85}
          >
            <Text style={styles.trackBtnText}>🚚 Track Package Live</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ordersBtn}
            onPress={() => router.push('/(user)/OrdersScreen')}
            activeOpacity={0.85}
          >
            <Text style={styles.ordersBtnText}>View All Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => router.replace('/(user)/HomeScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.homeBtnText}>Continue Shopping →</Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  checkmarkIcon: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#171717',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#F7F7FA',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 28,
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5B4BFF',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 14,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  receiptLabel: {
    fontSize: 13,
    color: '#777777',
  },
  receiptVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
  },
  receiptValHighlight: {
    fontSize: 18,
    fontWeight: '900',
    color: '#171717',
  },
  paidBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  paidText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '800',
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  addressSub: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  addressPhone: {
    fontSize: 12,
    color: '#171717',
    fontWeight: '600',
    marginTop: 4,
  },
  btnGroup: {
    width: '100%',
  },
  trackBtn: {
    backgroundColor: '#5B4BFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ordersBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    marginBottom: 12,
  },
  ordersBtnText: {
    color: '#171717',
    fontSize: 15,
    fontWeight: '700',
  },
  homeBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#5B4BFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
