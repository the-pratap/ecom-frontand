import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useShop, NotificationItem } from '../ShopStore';

type NotifFilter = 'all' | 'order' | 'promo' | 'offer' | 'system';

export default function NotificationsScreen() {
  const shop = useShop();
  const [activeFilter, setActiveFilter] = useState<NotifFilter>('all');

  const filteredNotifs = shop.notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return '🚚';
      case 'promo':
        return '🔥';
      case 'offer':
        return '🎁';
      case 'system':
        return '🛡️';
      default:
        return '🔔';
    }
  };

  const handlePressNotif = (notif: NotificationItem) => {
    shop.markNotificationAsRead(notif.id);
    if (notif.orderId) {
      router.push({
        pathname: '/(user)/OrderDetailsScreen',
        params: { orderId: notif.orderId },
      });
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          onPress={shop.markAllNotificationsAsRead}
          activeOpacity={0.7}
        >
          <Text style={styles.markAllText}>Read All</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            All ({shop.notifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'order' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('order')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'order' && styles.filterChipTextActive,
            ]}
          >
            Orders 🚚
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'promo' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('promo')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'promo' && styles.filterChipTextActive,
            ]}
          >
            Promotions 🔥
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'offer' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('offer')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'offer' && styles.filterChipTextActive,
            ]}
          >
            Coupons 🎁
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'system' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('system')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'system' && styles.filterChipTextActive,
            ]}
          >
            System 🛡️
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Notifications List */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔕</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySub}>
              You're all caught up! Promotional alerts and order updates will appear here.
            </Text>
          </View>
        ) : (
          filteredNotifs.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.notifCard,
                !notif.isRead && styles.unreadNotifCard,
              ]}
              onPress={() => handlePressNotif(notif)}
              activeOpacity={0.85}
            >
              {/* Type icon */}
              <View
                style={[
                  styles.iconCircle,
                  !notif.isRead && styles.iconCircleUnread,
                ]}
              >
                <Text style={{ fontSize: 18 }}>{getNotifIcon(notif.type)}</Text>
              </View>

              {/* Text content */}
              <View style={styles.notifContent}>
                <View style={styles.notifHeaderRow}>
                  <Text
                    style={[
                      styles.notifTitle,
                      !notif.isRead && styles.unreadTitle,
                    ]}
                  >
                    {notif.title}
                  </Text>
                  <Text style={styles.notifTime}>{notif.createdAt}</Text>
                </View>

                <Text style={styles.notifMessage}>{notif.message}</Text>

                {notif.orderId && (
                  <Text style={styles.viewOrderLink}>
                    View Order Details →
                  </Text>
                )}
              </View>

              {/* Unread indicator dot */}
              {!notif.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        )}
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
  markAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F7F7FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterChipActive: {
    backgroundColor: '#5B4BFF',
    borderColor: '#5B4BFF',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollList: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F7F7FA',
    minHeight: '100%',
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  unreadNotifCard: {
    backgroundColor: '#FAF9FF',
    borderColor: '#D4CEFF',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconCircleUnread: {
    backgroundColor: '#F0EEFF',
  },
  notifContent: {
    flex: 1,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    color: '#171717',
    fontWeight: '800',
  },
  notifTime: {
    fontSize: 11,
    color: '#8E8E93',
  },
  notifMessage: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 4,
  },
  viewOrderLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5B4BFF',
    marginLeft: 6,
    marginTop: 6,
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
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
