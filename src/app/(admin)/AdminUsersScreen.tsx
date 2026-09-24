import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useShop, DEMO_USER, DEMO_ADMIN } from '../ShopStore';

export default function AdminUsersScreen() {
  const shop = useShop();

  const customerAccounts = [
    {
      id: 'u-1',
      name: 'Rahul Das',
      email: 'user@shopnest.demo',
      phone: '9876543210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      role: 'Customer',
      joined: '2026-01-15',
      ordersCount: shop.orders.length,
      totalSpent: shop.orders.reduce((sum, o) => sum + o.total, 0),
      city: 'Bolpur, West Bengal',
    },
    {
      id: 'u-2',
      name: 'Ananya Sen',
      email: 'ananya@example.com',
      phone: '9830112233',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      role: 'Customer',
      joined: '2026-03-10',
      ordersCount: 3,
      totalSpent: 8490,
      city: 'Kolkata, West Bengal',
    },
    {
      id: 'u-3',
      name: 'Vikram Roy',
      email: 'vikram@example.com',
      phone: '9874112244',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      role: 'Customer',
      joined: '2026-05-22',
      ordersCount: 2,
      totalSpent: 4999,
      city: 'Siliguri, West Bengal',
    },
    {
      id: 'u-4',
      name: 'ShopNest Administrator',
      email: 'admin@shopnest.demo',
      phone: '9876540000',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
      role: 'Super Administrator',
      joined: '2025-12-01',
      ordersCount: 0,
      totalSpent: 0,
      city: 'Salt Lake, Kolkata',
    },
  ];

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
        <Text style={styles.headerTitle}>Customer Directory</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtext}>
          Registered customer accounts, contact details, and lifetime spending.
        </Text>

        {customerAccounts.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />

            <View style={styles.details}>
              <View style={styles.topRow}>
                <Text style={styles.name}>{user.name}</Text>
                <View
                  style={[
                    styles.roleBadge,
                    user.role.includes('Admin') && styles.roleBadgeAdmin,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleText,
                      user.role.includes('Admin') && styles.roleTextAdmin,
                    ]}
                  >
                    {user.role}
                  </Text>
                </View>
              </View>

              <Text style={styles.emailText}>✉️ {user.email}</Text>
              <Text style={styles.phoneText}>📞 {user.phone} • {user.city}</Text>

              <View style={styles.statsRow}>
                <Text style={styles.statLine}>
                  Orders: <Text style={styles.bold}>{user.ordersCount}</Text>
                </Text>
                <Text style={styles.statLine}>
                  Lifetime Spend:{' '}
                  <Text style={[styles.bold, { color: '#5B4BFF' }]}>
                    ₹{user.totalSpent.toLocaleString()}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
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
  scrollList: {
    padding: 16,
    paddingBottom: 40,
  },
  subtext: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 14,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0EEFF',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    color: '#171717',
  },
  roleBadge: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeAdmin: {
    backgroundColor: '#FEF3C7',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  roleTextAdmin: {
    color: '#D97706',
  },
  emailText: {
    fontSize: 11,
    color: '#777777',
    marginTop: 2,
  },
  phoneText: {
    fontSize: 11,
    color: '#555555',
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F7',
  },
  statLine: {
    fontSize: 11,
    color: '#777777',
  },
  bold: {
    fontWeight: '800',
    color: '#171717',
  },
});
