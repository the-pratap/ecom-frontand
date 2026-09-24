import React, { useState } from 'react';
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
import { useShop, Review } from '../ShopStore';

export default function AdminReviewsScreen() {
  const shop = useShop();
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | 'critical'>('all');

  const filteredReviews = shop.reviews.filter((r) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === '5') return r.rating === 5;
    if (selectedFilter === '4') return r.rating === 4;
    if (selectedFilter === 'critical') return r.rating <= 3;
    return true;
  });

  const handleDeleteReview = (id: string) => {
    Alert.alert('Remove Review', 'Are you sure you want to moderate and remove this review?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => Alert.alert('Removed', 'Review was removed from the product page.') },
    ]);
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
        <Text style={styles.headerTitle}>Review Moderation</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.chip, selectedFilter === 'all' && styles.chipActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.chipText, selectedFilter === 'all' && styles.chipTextActive]}>
            All ({shop.reviews.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, selectedFilter === '5' && styles.chipActive]}
          onPress={() => setSelectedFilter('5')}
        >
          <Text style={[styles.chipText, selectedFilter === '5' && styles.chipTextActive]}>
            5 Stars ⭐
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chip, selectedFilter === 'critical' && styles.chipActive]}
          onPress={() => setSelectedFilter('critical')}
        >
          <Text style={[styles.chipText, selectedFilter === 'critical' && styles.chipTextActive]}>
            Critical (≤ 3★)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtext}>
          Moderate customer feedback, check helpful votes, and verify product compliance.
        </Text>

        {filteredReviews.map((rev) => (
          <View key={rev.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={{ uri: rev.avatar }} style={styles.avatar} />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{rev.user}</Text>
                <Text style={styles.dateText}>
                  Product ID: {rev.productId} • {rev.createdAt}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {rev.rating}</Text>
              </View>
            </View>

            <Text style={styles.reviewTitle}>{rev.title}</Text>
            <Text style={styles.reviewComment}>{rev.comment}</Text>

            <View style={styles.footerRow}>
              <Text style={styles.helpfulText}>👍 {rev.helpfulCount} people found helpful</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteReview(rev.id)}
              >
                <Text style={styles.deleteText}>Moderate 🗑️</Text>
              </TouchableOpacity>
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F7F7FA',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  chipActive: {
    backgroundColor: '#5B4BFF',
    borderColor: '#5B4BFF',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777777',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollList: {
    padding: 16,
    paddingBottom: 40,
  },
  subtext: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0EEFF',
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
  },
  dateText: {
    fontSize: 10,
    color: '#8E8E93',
  },
  ratingBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  reviewTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 17,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F7',
    paddingTop: 8,
  },
  helpfulText: {
    fontSize: 11,
    color: '#777777',
  },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
});
