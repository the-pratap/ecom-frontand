import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';

// Import admin screens to render inside tabs container
import AdminDashboardScreen from '../AdminDashboardScreen';
import AdminProductsScreen from '../AdminProductsScreen';
import AdminOrdersScreen from '../AdminOrdersScreen';
import AdminReviewsScreen from '../AdminReviewsScreen';
import AdminUsersScreen from '../AdminUsersScreen';

export type AdminTabType = 'dashboard' | 'products' | 'orders' | 'reviews' | 'users';

export interface AdminTabBarProps {
  activeTab?: AdminTabType;
  onTabPress?: (tab: AdminTabType) => void;
}

// ==========================================
// 1. REUSABLE ADMIN TAB BAR (Single File Export)
// ==========================================
export function AdminTabBar({ activeTab = 'dashboard', onTabPress }: AdminTabBarProps) {
  const handlePress = (tab: AdminTabType) => {
    if (onTabPress) {
      onTabPress(tab);
    } else {
      router.push({
        pathname: '/(admin)/(tabs)',
        params: { tab },
      });
    }
  };

  return (
    <View style={tabStyles.bottomNav}>
      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('dashboard')}
        activeOpacity={0.7}
      >
        <Text style={[tabStyles.navIcon, activeTab === 'dashboard' && tabStyles.activeNavIcon]}>
          📊
        </Text>
        <Text style={[tabStyles.navLabel, activeTab === 'dashboard' && tabStyles.activeNavLabel]}>
          Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('products')}
        activeOpacity={0.7}
      >
        <Text style={[tabStyles.navIcon, activeTab === 'products' && tabStyles.activeNavIcon]}>
          📦
        </Text>
        <Text style={[tabStyles.navLabel, activeTab === 'products' && tabStyles.activeNavLabel]}>
          Products
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('orders')}
        activeOpacity={0.7}
      >
        <Text style={[tabStyles.navIcon, activeTab === 'orders' && tabStyles.activeNavIcon]}>
          📋
        </Text>
        <Text style={[tabStyles.navLabel, activeTab === 'orders' && tabStyles.activeNavLabel]}>
          Orders
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('reviews')}
        activeOpacity={0.7}
      >
        <Text style={[tabStyles.navIcon, activeTab === 'reviews' && tabStyles.activeNavIcon]}>
          ⭐
        </Text>
        <Text style={[tabStyles.navLabel, activeTab === 'reviews' && tabStyles.activeNavLabel]}>
          Reviews
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('users')}
        activeOpacity={0.7}
      >
        <Text style={[tabStyles.navIcon, activeTab === 'users' && tabStyles.activeNavIcon]}>
          👥
        </Text>
        <Text style={[tabStyles.navLabel, activeTab === 'users' && tabStyles.activeNavLabel]}>
          Users
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ==========================================
// 2. MAIN SINGLE-FILE ADMIN TAB CONTAINER
// ==========================================
export default function AdminTabsScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [currentTab, setCurrentTab] = useState<AdminTabType>('dashboard');

  useEffect(() => {
    if (
      params.tab &&
      ['dashboard', 'products', 'orders', 'reviews', 'users'].includes(params.tab)
    ) {
      setCurrentTab(params.tab as AdminTabType);
    }
  }, [params.tab]);

  return (
    <SafeAreaView style={tabStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Dynamic Admin Content */}
      <View style={tabStyles.contentArea}>
        {currentTab === 'dashboard' && <AdminDashboardScreen />}
        {currentTab === 'products' && <AdminProductsScreen />}
        {currentTab === 'orders' && <AdminOrdersScreen />}
        {currentTab === 'reviews' && <AdminReviewsScreen />}
        {currentTab === 'users' && <AdminUsersScreen />}
      </View>

      {/* Unified Tab Bar from this single file */}
      <AdminTabBar activeTab={currentTab} onTabPress={(tab) => setCurrentTab(tab)} />
    </SafeAreaView>
  );
}

const tabStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7FA',
  },
  contentArea: {
    flex: 1,
  },
  bottomNav: {
    height: 64,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    paddingBottom: Platform.OS === 'ios' ? 8 : 4,
    paddingTop: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  activeNavIcon: {
    transform: [{ scale: 1.15 }],
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
});
