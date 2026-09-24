import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useShop } from '../ShopStore';

export default function ProfileScreen() {
  const shop = useShop();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to log out of your ShopNest account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            shop.logout();
            router.replace('/(auth)/LoginScreen');
          },
        },
      ]
    );
  };

  const handleToggleRole = () => {
    if (shop.user?.role === 'admin') {
      shop.login('user', 'user');
      Alert.alert('Role Switched', 'Active account: Rahul Das (Regular Customer)');
      router.replace('/(user)/(tabs)');
    } else {
      shop.login('admin', 'admin');
      Alert.alert('Role Switched', 'Active account: ShopNest Administrator');
      router.replace('/(admin)/(tabs)');
    }
  };

  const handleSupport = () => {
    Alert.alert(
      'ShopNest Customer Care',
      'Need assistance with your deliveries or payments?\n\nHelpline: 1800-200-NEST\nEmail: support@shopnest.demo\nLive Hours: 24x7',
      [{ text: 'Close' }]
    );
  };

  const handleLegal = (title: string) => {
    Alert.alert(
      title,
      'ShopNest adheres to the highest e-commerce safety, data encryption, and consumer protection guidelines under IT Act and BIS Standards.',
      [{ text: 'Understood' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          onPress={() => router.push('/(user)/EditProfileScreen')}
          style={styles.editBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <Image
            source={{
              uri:
                shop.user?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <View style={styles.nameBadgeRow}>
              <Text style={styles.userName}>
                {shop.user?.name || 'Rahul Das'}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  shop.user?.role === 'admin' && styles.roleBadgeAdmin,
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    shop.user?.role === 'admin' && styles.roleBadgeTextAdmin,
                  ]}
                >
                  {shop.user?.role?.toUpperCase() || 'USER'}
                </Text>
              </View>
            </View>
            <Text style={styles.userEmail}>
              {shop.user?.email || 'user@shopnest.demo'}
            </Text>
            <Text style={styles.userPhone}>
              📞 {shop.user?.phone || '9876543210'}
            </Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push('/(user)/OrdersScreen')}
          >
            <Text style={styles.statVal}>{shop.orders.length}</Text>
            <Text style={styles.statLabel}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() =>
              router.push({
                pathname: '/(user)/(tabs)',
                params: { tab: 'wishlist' },
              })
            }
          >
            <Text style={styles.statVal}>{shop.wishlist.length}</Text>
            <Text style={styles.statLabel}>Saved Items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push('/(user)/ReviewsScreen')}
          >
            <Text style={styles.statVal}>{shop.reviews.length}</Text>
            <Text style={styles.statLabel}>My Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Demo Switcher */}
        <TouchableOpacity
          style={styles.demoSwitchCard}
          onPress={handleToggleRole}
          activeOpacity={0.8}
        >
          <View style={styles.demoSwitchLeft}>
            <Text style={styles.demoSwitchIcon}>🔄</Text>
            <View>
              <Text style={styles.demoSwitchTitle}>
                Switch Session: {shop.user?.role === 'admin' ? 'Customer Mode' : 'Admin Mode'}
              </Text>
              <Text style={styles.demoSwitchSub}>
                Currently logged in as {shop.user?.name}
              </Text>
            </View>
          </View>
          <Text style={styles.demoSwitchAction}>Switch →</Text>
        </TouchableOpacity>

        {/* Account Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account & Purchases</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(user)/OrdersScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemIcon}>📦</Text>
            <Text style={styles.menuItemLabel}>My Orders & History</Text>
            <Text style={styles.menuItemBadge}>{shop.orders.length}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              router.push({
                pathname: '/(user)/(tabs)',
                params: { tab: 'wishlist' },
              })
            }
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemIcon}>💖</Text>
            <Text style={styles.menuItemLabel}>Wishlist & Saved Items</Text>
            <Text style={styles.menuItemBadge}>{shop.wishlist.length}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(user)/AddressScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemIcon}>📍</Text>
            <Text style={styles.menuItemLabel}>Saved Delivery Addresses</Text>
            <Text style={styles.menuItemBadge}>{shop.addresses.length}</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(user)/NotificationsScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemIcon}>🔔</Text>
            <Text style={styles.menuItemLabel}>Notifications & Alerts</Text>
            {shop.unreadNotificationCount > 0 && (
              <View style={styles.notifPill}>
                <Text style={styles.notifPillText}>
                  {shop.unreadNotificationCount} New
                </Text>
              </View>
            )}
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences & Support Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Preferences & Support</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(user)/EditProfileScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemIcon}>✏️</Text>
            <Text style={styles.menuItemLabel}>Edit Profile Information</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSupport}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemIcon}>🎧</Text>
            <Text style={styles.menuItemLabel}>Help & Customer Support</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleLegal('Terms & Conditions')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemIcon}>📜</Text>
            <Text style={styles.menuItemLabel}>Terms of Service</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleLegal('Privacy Policy')}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemIcon}>🔒</Text>
            <Text style={styles.menuItemLabel}>Privacy Policy</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutBtnText}>Log Out of ShopNest</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F0EEFF',
  },
  editText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
    backgroundColor: '#F7F7FA',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0EEFF',
    marginRight: 14,
  },
  userInfo: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
    marginRight: 8,
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
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#5B4BFF',
  },
  roleBadgeTextAdmin: {
    color: '#D97706',
  },
  userEmail: {
    fontSize: 13,
    color: '#777777',
  },
  userPhone: {
    fontSize: 12,
    color: '#171717',
    fontWeight: '600',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statBox: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5B4BFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777777',
  },
  demoSwitchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2DEFF',
  },
  demoSwitchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  demoSwitchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  demoSwitchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  demoSwitchSub: {
    fontSize: 11,
    color: '#777777',
    marginTop: 1,
  },
  demoSwitchAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  menuItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 14,
    color: '#171717',
    fontWeight: '600',
  },
  menuItemBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777777',
    marginRight: 8,
  },
  notifPill: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  notifPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  menuItemArrow: {
    fontSize: 18,
    color: '#C7C7CC',
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
});
