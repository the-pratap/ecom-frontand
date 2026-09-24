import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useShop, Order } from '../ShopStore';

export default function AdminOrdersScreen() {
  const shop = useShop();

  const [activeStatusTab, setActiveStatusTab] = useState<
    'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  >('All');

  const filteredOrders = shop.orders.filter((o) => {
    if (activeStatusTab === 'All') return true;
    return o.status.toLowerCase() === activeStatusTab.toLowerCase();
  });

  const advanceOrderStatus = (order: Order) => {
    let nextStatus: Order['status'] = 'Processing';
    if (order.status === 'Pending') nextStatus = 'Processing';
    else if (order.status === 'Processing') nextStatus = 'Shipped';
    else if (order.status === 'Shipped') nextStatus = 'Delivered';
    else {
      Alert.alert('Status Final', `Order is already marked as ${order.status}.`);
      return;
    }

    Alert.alert(
      'Update Order Stage',
      `Move Order #${order.id} status to "${nextStatus}"? This triggers real-time notification to the customer.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Update',
          onPress: () => {
            Alert.alert('Updated', `Order #${order.id} is now ${nextStatus}!`);
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: Order['status']) => {
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
        <Text style={styles.headerTitle}>Order Fulfillment</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Status Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {['All', 'Processing', 'Shipped', 'Delivered', 'Pending', 'Cancelled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabChip,
              activeStatusTab === tab && styles.tabChipActive,
            ]}
            onPress={() => setActiveStatusTab(tab as any)}
          >
            <Text
              style={[
                styles.tabChipText,
                activeStatusTab === tab && styles.tabChipTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.countText}>
          Total {filteredOrders.length} orders found
        </Text>

        {filteredOrders.map((order) => {
          const badge = getStatusBadge(order.status);

          return (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>Ordered: {order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.statusText, { color: badge.text }]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              {/* Customer Info */}
              <View style={styles.customerBox}>
                <Text style={styles.customerName}>
                  👤 {order.address.name} • {order.address.phone}
                </Text>
                <Text style={styles.customerAddr}>
                  📍 {order.address.street}, {order.address.city} - {order.address.pincode}
                </Text>
              </View>

              {/* Items & Payment */}
              <View style={styles.itemsBox}>
                <Text style={styles.itemsSummary}>
                  {order.items.length} Product(s) • Method: {order.paymentMethod} ({order.paymentStatus})
                </Text>
                <Text style={styles.orderTotal}>
                  ₹{order.total.toLocaleString()}
                </Text>
              </View>

              {/* Admin Actions */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.trackBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/(user)/TrackOrderScreen',
                      params: { orderId: order.id },
                    })
                  }
                >
                  <Text style={styles.trackText}>Live Timeline</Text>
                </TouchableOpacity>

                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <TouchableOpacity
                    style={styles.advanceBtn}
                    onPress={() => advanceOrderStatus(order)}
                  >
                    <Text style={styles.advanceText}>
                      Advance Stage →
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
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
  tabsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  tabChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F7F7FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tabChipActive: {
    backgroundColor: '#5B4BFF',
    borderColor: '#5B4BFF',
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollList: {
    padding: 16,
    paddingBottom: 40,
  },
  countText: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '600',
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171717',
  },
  orderDate: {
    fontSize: 11,
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  customerBox: {
    backgroundColor: '#F7F7FA',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
  },
  customerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  customerAddr: {
    fontSize: 11,
    color: '#555555',
  },
  itemsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemsSummary: {
    fontSize: 11,
    color: '#777777',
    flex: 1,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#5B4BFF',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F7',
    paddingTop: 8,
  },
  trackBtn: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trackText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  advanceBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  advanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
