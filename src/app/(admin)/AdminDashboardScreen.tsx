import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useShop } from '../ShopStore';

const { width } = Dimensions.get('window');

export default function AdminDashboardScreen() {
  const shop = useShop();

  // Admin calculations
  const totalRevenue = shop.orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = shop.orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length;

  const lowStockProducts = shop.products.filter((p) => p.stock <= 15);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Sign out of administrator session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          shop.logout();
          router.replace('/(auth)/LoginScreen');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Admin Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.adminBadgeRow}>
          <View style={styles.adminShieldCircle}>
            <Text style={styles.shieldIcon}>🛡️</Text>
          </View>
          <View>
            <Text style={styles.portalTitle}>ShopNest Console</Text>
            <Text style={styles.adminName}>
              Administrator: {shop.user?.name || 'Admin'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.switchStoreBtn}
            onPress={() => router.push('/(user)/(tabs)')}
            activeOpacity={0.8}
          >
            <Text style={styles.switchStoreText}>🛍️ Store View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Notice */}
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>⚡</Text>
          <Text style={styles.alertText}>
            Bolpur & Kolkata fulfillment centers are running smoothly with 0 delayed parcels.
          </Text>
        </View>

        {/* Executive KPI Metrics Grid */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { borderColor: '#5B4BFF' }]}>
            <Text style={styles.kpiLabel}>Total Revenue</Text>
            <Text style={[styles.kpiValue, { color: '#5B4BFF' }]}>
              ₹{totalRevenue.toLocaleString()}
            </Text>
            <Text style={styles.kpiSub}>+18.4% from last week</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#F59E0B' }]}>
            <Text style={styles.kpiLabel}>Pending Orders</Text>
            <Text style={[styles.kpiValue, { color: '#D97706' }]}>
              {pendingOrdersCount}
            </Text>
            <Text style={styles.kpiSub}>Requires fulfillment</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#16A34A' }]}>
            <Text style={styles.kpiLabel}>Total Products</Text>
            <Text style={[styles.kpiValue, { color: '#16A34A' }]}>
              {shop.products.length}
            </Text>
            <Text style={styles.kpiSub}>Across 8 categories</Text>
          </View>

          <View style={[styles.kpiCard, { borderColor: '#DC2626' }]}>
            <Text style={styles.kpiLabel}>Low Stock Alert</Text>
            <Text style={[styles.kpiValue, { color: '#DC2626' }]}>
              {lowStockProducts.length}
            </Text>
            <Text style={styles.kpiSub}>Units &lt;= 15 remaining</Text>
          </View>
        </View>

        {/* Quick Operations Actions */}
        <Text style={styles.sectionHeading}>Management Modules</Text>
        <View style={styles.moduleGrid}>
          <TouchableOpacity
            style={styles.moduleCard}
            onPress={() => router.push({ pathname: '/(admin)/(tabs)', params: { tab: 'products' } })}
            activeOpacity={0.8}
          >
            <View style={[styles.moduleIconCircle, { backgroundColor: '#F0EEFF' }]}>
              <Text style={{ fontSize: 24 }}>📦</Text>
            </View>
            <Text style={styles.moduleTitle}>Manage Products</Text>
            <Text style={styles.moduleSub}>Stock, prices, discounts & status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moduleCard}
            onPress={() => router.push({ pathname: '/(admin)/(tabs)', params: { tab: 'orders' } })}
            activeOpacity={0.8}
          >
            <View style={[styles.moduleIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Text style={{ fontSize: 24 }}>📋</Text>
            </View>
            <Text style={styles.moduleTitle}>Order Deliveries</Text>
            <Text style={styles.moduleSub}>Update stages & courier tracking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moduleCard}
            onPress={() => router.push({ pathname: '/(admin)/(tabs)', params: { tab: 'reviews' } })}
            activeOpacity={0.8}
          >
            <View style={[styles.moduleIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Text style={{ fontSize: 24 }}>⭐</Text>
            </View>
            <Text style={styles.moduleTitle}>Review Moderation</Text>
            <Text style={styles.moduleSub}>Moderate feedback & ratings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moduleCard}
            onPress={() => router.push({ pathname: '/(admin)/(tabs)', params: { tab: 'users' } })}
            activeOpacity={0.8}
          >
            <View style={[styles.moduleIconCircle, { backgroundColor: '#E0E7FF' }]}>
              <Text style={{ fontSize: 24 }}>👥</Text>
            </View>
            <Text style={styles.moduleTitle}>Customer Accounts</Text>
            <Text style={styles.moduleSub}>Customer directory & spending</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Orders Overview */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Recent Customer Orders</Text>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(admin)/(tabs)', params: { tab: 'orders' } })}
          >
            <Text style={styles.viewAllText}>View All ({shop.orders.length}) →</Text>
          </TouchableOpacity>
        </View>

        {shop.orders.slice(0, 3).map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderItemCard}
            onPress={() => router.push({ pathname: '/(admin)/(tabs)', params: { tab: 'orders' } })}
            activeOpacity={0.85}
          >
            <View style={styles.orderTop}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={styles.orderStatusBadge}>
                <Text style={styles.orderStatusText}>{order.status}</Text>
              </View>
            </View>

            <Text style={styles.orderCustomer}>
              Customer: {order.address.name} ({order.address.city})
            </Text>
            <View style={styles.orderBottom}>
              <Text style={styles.orderItemsCount}>
                {order.items.length} item(s) • {order.paymentMethod}
              </Text>
              <Text style={styles.orderTotal}>₹{order.total.toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7FA',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminShieldCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  shieldIcon: {
    fontSize: 20,
  },
  portalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#171717',
  },
  adminName: {
    fontSize: 11,
    color: '#777777',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchStoreBtn: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  switchStoreText: {
    color: '#5B4BFF',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutBtn: {
    padding: 6,
  },
  logoutIcon: {
    fontSize: 18,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  alertIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  alertText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '600',
    flex: 1,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  kpiSub: {
    fontSize: 10,
    color: '#8E8E93',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  moduleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 4,
  },
  moduleSub: {
    fontSize: 11,
    color: '#777777',
    lineHeight: 15,
  },
  orderItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171717',
  },
  orderStatusBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
  },
  orderCustomer: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 6,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F7',
    paddingTop: 6,
  },
  orderItemsCount: {
    fontSize: 11,
    color: '#777777',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B4BFF',
  },
});
