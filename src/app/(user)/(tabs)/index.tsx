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
import { useShop } from '../../ShopStore';

// Import screens to render inside tabs container
import HomeScreen from '../HomeScreen';
import CategoriesScreen from '../CategoriesScreen';
import WishlistScreen from '../WishlistScreen';
import CartScreen from '../CartScreen';
import ProfileScreen from '../ProfileScreen';

export type UserTabType = 'home' | 'categories' | 'wishlist' | 'cart' | 'profile';

export interface UserTabBarProps {
  activeTab?: UserTabType;
  onTabPress?: (tab: UserTabType) => void;
}

// ==========================================
// 1. REUSABLE USER TAB BAR (Single File Export)
// ==========================================
export function UserTabBar({ activeTab = 'home', onTabPress }: UserTabBarProps) {
  const shop = useShop();

  const handlePress = (tab: UserTabType) => {
    if (onTabPress) {
      onTabPress(tab);
    } else {
      router.push({
        pathname: '/(user)/(tabs)',
        params: { tab },
      });
    }
  };

  return (
    <View style={tabStyles.bottomNav}>
      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('home')}
        activeOpacity={0.7}
      >
        <Text style={[tabStyles.navIcon, activeTab === 'home' && tabStyles.activeNavIcon]}>
          🏠
        </Text>
        <Text style={[tabStyles.navLabel, activeTab === 'home' && tabStyles.activeNavLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('categories')}
        activeOpacity={0.7}
      >
        <Text style={[tabStyles.navIcon, activeTab === 'categories' && tabStyles.activeNavIcon]}>
          📂
        </Text>
        <Text style={[tabStyles.navLabel, activeTab === 'categories' && tabStyles.activeNavLabel]}>
          Categories
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('wishlist')}
        activeOpacity={0.7}
      >
        <View style={tabStyles.iconWrapper}>
          <Text style={[tabStyles.navIcon, activeTab === 'wishlist' && tabStyles.activeNavIcon]}>
            💖
          </Text>
          {shop.wishlist.length > 0 && (
            <View style={tabStyles.badge}>
              <Text style={tabStyles.badgeText}>{shop.wishlist.length}</Text>
            </View>
          )}
        </View>
        <Text style={[tabStyles.navLabel, activeTab === 'wishlist' && tabStyles.activeNavLabel]}>
          Wishlist
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('cart')}
        activeOpacity={0.7}
      >
        <View style={tabStyles.iconWrapper}>
          <Text style={[tabStyles.navIcon, activeTab === 'cart' && tabStyles.activeNavIcon]}>
            🛒
          </Text>
          {shop.cartTotals.totalItems > 0 && (
            <View style={tabStyles.badge}>
              <Text style={tabStyles.badgeText}>{shop.cartTotals.totalItems}</Text>
            </View>
          )}
        </View>
        <Text style={[tabStyles.navLabel, activeTab === 'cart' && tabStyles.activeNavLabel]}>
          Cart
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tabStyles.navItem}
        onPress={() => handlePress('profile')}
        activeOpacity={0.7}
      >
        <Text style={[tabStyles.navIcon, activeTab === 'profile' && tabStyles.activeNavIcon]}>
          👤
        </Text>
        <Text style={[tabStyles.navLabel, activeTab === 'profile' && tabStyles.activeNavLabel]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ==========================================
// 2. MAIN SINGLE-FILE TAB CONTAINER
// ==========================================
export default function UserTabsScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [currentTab, setCurrentTab] = useState<UserTabType>('home');

  useEffect(() => {
    if (params.tab && ['home', 'categories', 'wishlist', 'cart', 'profile'].includes(params.tab)) {
      setCurrentTab(params.tab as UserTabType);
    }
  }, [params.tab]);

  return (
    <SafeAreaView style={tabStyles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Dynamic Tab Content */}
      <View style={tabStyles.contentArea}>
        {currentTab === 'home' && <HomeScreen />}
        {currentTab === 'categories' && <CategoriesScreen />}
        {currentTab === 'wishlist' && <WishlistScreen />}
        {currentTab === 'cart' && <CartScreen />}
        {currentTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Unified Tab Bar from this single file */}
      <UserTabBar activeTab={currentTab} onTabPress={(tab) => setCurrentTab(tab)} />
    </SafeAreaView>
  );
}

const tabStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 8,
    flex: 1,
  },
  iconWrapper: {
    position: 'relative',
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
