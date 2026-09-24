import React, { useState, useMemo } from 'react';
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
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useShop, Review, Product } from '../ShopStore';

export default function ReviewsScreen() {
  const params = useLocalSearchParams<{ productId?: string }>();
  const shop = useShop();

  const productId = params.productId || 'p1';
  const product: Product =
    shop.products.find((p) => p.id === productId) || shop.products[0];

  // Filters and sorting
  const [selectedStar, setSelectedStar] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Filtered reviews for this product
  const productReviews = useMemo(() => {
    // Collect all reviews for this product or general demo reviews
    let list = shop.reviews.filter((r) => r.productId === product.id);
    if (list.length === 0) {
      list = shop.reviews;
    }

    if (selectedStar !== 'all') {
      list = list.filter((r) => r.rating === selectedStar);
    }

    if (sortBy === 'newest') {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating);
    }

    return list;
  }, [shop.reviews, product.id, selectedStar, sortBy]);

  // Star rating distribution counts
  const allReviewsForProduct = shop.reviews.filter(
    (r) => r.productId === product.id
  ).length > 0
    ? shop.reviews.filter((r) => r.productId === product.id)
    : shop.reviews;

  const totalReviewsCount = allReviewsForProduct.length;
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allReviewsForProduct.forEach((r) => {
    if (starCounts[r.rating] !== undefined) {
      starCounts[r.rating]++;
    }
  });

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
        <Text style={styles.headerTitle}>Ratings & Reviews</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/(user)/WriteReviewScreen',
              params: { productId: product.id },
            })
          }
          style={styles.writeHeaderBtn}
        >
          <Text style={styles.writeHeaderText}>Write +</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product mini header */}
        <View style={styles.productBanner}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.productThumb}
            resizeMode="cover"
          />
          <View style={styles.productBannerDetails}>
            <Text style={styles.productBannerBrand}>{product.brand}</Text>
            <Text style={styles.productBannerName} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.productBannerPrice}>
              ₹{product.discountPrice.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Overall Rating & Breakdown Card */}
        <View style={styles.ratingSummaryCard}>
          <View style={styles.scoreCol}>
            <Text style={styles.scoreNumber}>{product.averageRating}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Text key={s} style={styles.goldStar}>
                  ★
                </Text>
              ))}
            </View>
            <Text style={styles.totalReviewsText}>
              {product.totalReviews} verified ratings
            </Text>
          </View>

          {/* Distribution Progress Bars */}
          <View style={styles.barsCol}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starCounts[star] || 0;
              const percent = totalReviewsCount
                ? Math.round((count / totalReviewsCount) * 100)
                : 0;

              return (
                <View key={star} style={styles.barRow}>
                  <Text style={styles.barStarLabel}>{star}★</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[styles.barFill, { width: `${Math.max(percent, 8)}%` }]}
                    />
                  </View>
                  <Text style={styles.barPercent}>{percent}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Filter by Stars */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by Star Rating</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            <TouchableOpacity
              style={[
                styles.chip,
                selectedStar === 'all' && styles.chipActive,
              ]}
              onPress={() => setSelectedStar('all')}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedStar === 'all' && styles.chipTextActive,
                ]}
              >
                All Stars
              </Text>
            </TouchableOpacity>

            {[5, 4, 3, 2, 1].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.chip,
                  selectedStar === s && styles.chipActive,
                ]}
                onPress={() => setSelectedStar(s)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedStar === s && styles.chipTextActive,
                  ]}
                >
                  {s} ★ ({starCounts[s] || 0})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sort Chips */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort By:</Text>
          <TouchableOpacity
            style={[
              styles.sortBtn,
              sortBy === 'newest' && styles.sortBtnActive,
            ]}
            onPress={() => setSortBy('newest')}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortBy === 'newest' && styles.sortBtnTextActive,
              ]}
            >
              Newest
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortBtn,
              sortBy === 'highest' && styles.sortBtnActive,
            ]}
            onPress={() => setSortBy('highest')}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortBy === 'highest' && styles.sortBtnTextActive,
              ]}
            >
              Highest ★
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortBtn,
              sortBy === 'lowest' && styles.sortBtnActive,
            ]}
            onPress={() => setSortBy('lowest')}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortBy === 'lowest' && styles.sortBtnTextActive,
              ]}
            >
              Lowest ★
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsList}>
          {productReviews.length === 0 ? (
            <View style={styles.emptyReviews}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>💬</Text>
              <Text style={styles.emptyTitle}>No reviews for this filter</Text>
              <Text style={styles.emptySub}>
                Be the first to share your experience with this item.
              </Text>
            </View>
          ) : (
            productReviews.map((rev: Review) => (
              <View key={rev.id} style={styles.reviewCard}>
                {/* Author Info */}
                <View style={styles.authorRow}>
                  <Image
                    source={{ uri: rev.avatar }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                  <View style={styles.authorDetails}>
                    <Text style={styles.authorName}>{rev.user}</Text>
                    <View style={styles.verifiedRow}>
                      <Text style={styles.verifiedCheck}>✓ Verified Buyer</Text>
                      <Text style={styles.reviewDate}>• {rev.createdAt}</Text>
                    </View>
                  </View>

                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingBadgeText}>★ {rev.rating}</Text>
                  </View>
                </View>

                {/* Review Body */}
                <Text style={styles.reviewTitle}>{rev.title}</Text>
                <Text style={styles.reviewComment}>{rev.comment}</Text>

                {/* Helpful Button */}
                <View style={styles.reviewFooter}>
                  <TouchableOpacity
                    style={styles.helpfulBtn}
                    onPress={() => shop.markReviewHelpful(rev.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.helpfulText}>
                      👍 Helpful ({rev.helpfulCount})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Write Review Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.writeReviewCta}
          onPress={() =>
            router.push({
              pathname: '/(user)/WriteReviewScreen',
              params: { productId: product.id },
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.writeReviewCtaText}>
            ✍️ Write a Customer Review
          </Text>
        </TouchableOpacity>
      </View>
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
  writeHeaderBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F0EEFF',
  },
  writeHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
    backgroundColor: '#F7F7FA',
  },
  productBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  productThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
    marginRight: 12,
  },
  productBannerDetails: {
    flex: 1,
  },
  productBannerBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  productBannerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
  },
  productBannerPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#5B4BFF',
    marginTop: 2,
  },
  ratingSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  scoreCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '38%',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F2',
    paddingRight: 12,
  },
  scoreNumber: {
    fontSize: 38,
    fontWeight: '900',
    color: '#171717',
  },
  starsRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  goldStar: {
    color: '#F59E0B',
    fontSize: 14,
    marginHorizontal: 1,
  },
  totalReviewsText: {
    fontSize: 10,
    color: '#777777',
    textAlign: 'center',
  },
  barsCol: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  barStarLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#555555',
    width: 22,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F0F0F2',
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#5B4BFF',
    borderRadius: 3,
  },
  barPercent: {
    fontSize: 10,
    color: '#8E8E93',
    width: 28,
    textAlign: 'right',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },
  chipsRow: {
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#5B4BFF',
    borderColor: '#5B4BFF',
  },
  chipText: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sortLabel: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '600',
    marginRight: 8,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sortBtnActive: {
    backgroundColor: '#F0EEFF',
    borderColor: '#5B4BFF',
  },
  sortBtnText: {
    fontSize: 11,
    color: '#777777',
    fontWeight: '600',
  },
  sortBtnTextActive: {
    color: '#5B4BFF',
    fontWeight: '700',
  },
  reviewsList: {},
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E5E5',
    marginRight: 10,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  verifiedCheck: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '700',
    marginRight: 4,
  },
  reviewDate: {
    fontSize: 10,
    color: '#8E8E93',
  },
  ratingBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 10,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F7',
    paddingTop: 8,
  },
  helpfulBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F7F7FA',
  },
  helpfulText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777777',
  },
  emptyReviews: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#777777',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    padding: 12,
  },
  writeReviewCta: {
    backgroundColor: '#5B4BFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  writeReviewCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
