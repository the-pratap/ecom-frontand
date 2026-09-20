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
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useShop, Order } from '../ShopStore';

type StatusTab = 'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

const STATUS_TABS: StatusTab[] = [
  'All',
  'Processing',
  'Shipped',
  'Delivered',
  'Pending',
  'Cancelled',
];

export default function OrdersScreen() {
  const shop = useShop();
  const [activeTab, setActiveTab] = useState<StatusTab>('All');

  const filteredOrders = shop.orders.filter((order) => {
    if (activeTab === 'All') return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

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
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Status Tabs Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {STATUS_TABS.map((tab) => {
          const count =
            tab === 'All'
              ? shop.orders.length
              : shop.orders.filter((o) => o.status.toLowerCase() === tab.toLowerCase()).length;

          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabChip,
                activeTab === tab && styles.tabChipActive,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabChipText,
                  activeTab === tab && styles.tabChipTextActive,
                ]}
              >
                {tab} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No orders in {activeTab}</Text>
            <Text style={styles.emptySub}>
              You don't have any orders matching this category filter.
            </Text>
          </View>
        ) : (
          filteredOrders.map((order: Order) => {
            const badgeStyle = getStatusBadgeStyle(order.status);

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Top Bar */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>Ordered on {order.date}</Text>
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

                {/* Items Thumbnails Row */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbsRow}
                >
                  {order.items.map((item, idx) => (
                    <View key={idx} style={styles.thumbWrapper}>
                      <Image
                        source={{ uri: item.product.thumbnail }}
                        style={styles.itemThumb}
                        resizeMode="cover"
                      />
                      {item.quantity > 1 && (
                        <View style={styles.qtyPill}>
                          <Text style={styles.qtyPillText}>x{item.quantity}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>

                {/* Info and Pricing */}
                <View style={styles.summaryRow}>
                  <Text style={styles.itemCountDesc}>
                    {order.items.length}{' '}
                    {order.items.length === 1 ? 'Product' : 'Products'} •{' '}
                    {order.paymentMethod}
                  </Text>
                  <Text style={styles.totalPrice}>
                    ₹{order.total.toLocaleString()}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() =>
                      router.push({
                        pathname: '/(user)/OrderDetailsScreen',
                        params: { orderId: order.id },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.detailsBtnText}>View Details</Text>
                  </TouchableOpacity>

                  {order.status !== 'Cancelled' && (
                    <TouchableOpacity
                      style={styles.trackBtn}
                      onPress={() =>
                        router.push({
                          pathname: '/(user)/TrackOrderScreen',
                          params: { orderId: order.id },
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={styles.trackBtnText}>Track Order 🚚</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
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
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: '#777777',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#8E8E93',
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
  thumbsRow: {
    paddingVertical: 4,
    marginBottom: 12,
  },
  thumbWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  itemThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
  },
  qtyPill: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#171717',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  qtyPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F7',
    marginBottom: 12,
  },
  itemCountDesc: {
    fontSize: 12,
    color: '#777777',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#5B4BFF',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsBtn: {
    flex: 1,
    backgroundColor: '#F7F7FA',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  detailsBtnText: {
    color: '#171717',
    fontSize: 13,
    fontWeight: '700',
  },
  trackBtn: {
    flex: 1,
    backgroundColor: '#5B4BFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
