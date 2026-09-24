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
import { useShop, WishlistItem } from '../ShopStore';

export default function WishlistScreen() {
  const shop = useShop();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === shop.wishlist.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(shop.wishlist.map((w) => w.id));
    }
  };

  const handleRemoveSelected = () => {
    if (selectedIds.length === 0) return;
    Alert.alert(
      'Remove Selected Items',
      `Are you sure you want to remove ${selectedIds.length} items from your wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            shop.removeSelectedWishlist(selectedIds);
            setSelectedIds([]);
          },
        },
      ]
    );
  };

  const handleClearWishlist = () => {
    Alert.alert(
      'Clear Wishlist',
      'Are you sure you want to remove all items from your wishlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            shop.clearWishlist();
            setSelectedIds([]);
          },
        },
      ]
    );
  };

  const handleMoveAllToCart = () => {
    if (shop.wishlist.length === 0) return;
    shop.moveAllWishlistToCart();
    setSelectedIds([]);
    Alert.alert(
      'Moved to Cart! 🛒',
      'All wishlist items have been transferred to your shopping cart.',
      [
        {
          text: 'View Cart',
          onPress: () =>
            router.push({
              pathname: '/(user)/(tabs)',
              params: { tab: 'cart' },
            }),
        },
        { text: 'Continue Shopping' },
      ]
    );
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

        <View style={styles.titleBox}>
          <Text style={styles.headerTitle}>My Wishlist</Text>
          <Text style={styles.headerCount}>{shop.wishlist.length} items</Text>
        </View>

        {shop.wishlist.length > 0 ? (
          <TouchableOpacity onPress={handleClearWishlist} activeOpacity={0.7}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Empty State */}
      {shop.wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyHeartCircle}>
            <Text style={styles.emptyHeartEmoji}>💔</Text>
          </View>
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore thousands of products and save your favorite electronics, shoes, and fashion items here.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() =>
              router.push({
                pathname: '/(user)/(tabs)',
                params: { tab: 'home' },
              })
            }
            activeOpacity={0.85}
          >
            <Text style={styles.exploreBtnText}>Explore Products →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Multi-action bar */}
          <View style={styles.multiActionBar}>
            <TouchableOpacity
              style={styles.selectAllBtn}
              onPress={selectAll}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>
                {selectedIds.length === shop.wishlist.length ? '☑️' : '⬜'}
              </Text>
              <Text style={styles.selectAllText}>
                {selectedIds.length === shop.wishlist.length
                  ? 'Deselect All'
                  : 'Select All'}
              </Text>
            </TouchableOpacity>

            <View style={styles.multiActionRight}>
              {selectedIds.length > 0 && (
                <TouchableOpacity
                  style={styles.removeSelectedBtn}
                  onPress={handleRemoveSelected}
                >
                  <Text style={styles.removeSelectedText}>
                    Delete ({selectedIds.length})
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.moveAllBtn}
                onPress={handleMoveAllToCart}
                activeOpacity={0.8}
              >
                <Text style={styles.moveAllText}>Move All to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollList}
            showsVerticalScrollIndicator={false}
          >
            {shop.wishlist.map((item: WishlistItem) => {
              const isSelected = selectedIds.includes(item.id);
              const variantDesc = [item.variant.color, item.variant.size]
                .filter(Boolean)
                .join(' • ');

              return (
                <View key={item.id} style={styles.wishCard}>
                  <TouchableOpacity
                    style={styles.checkWrapper}
                    onPress={() => toggleSelect(item.id)}
                  >
                    <Text style={{ fontSize: 18 }}>
                      {isSelected ? '☑️' : '⬜'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/(user)/ProductDetailsScreen',
                        params: { productId: item.product.id },
                      })
                    }
                  >
                    <Image
                      source={{ uri: item.product.thumbnail }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <View style={styles.cardInfo}>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: '/(user)/ProductDetailsScreen',
                          params: { productId: item.product.id },
                        })
                      }
                    >
                      <Text style={styles.brandText}>{item.product.brand}</Text>
                      <Text style={styles.productTitle} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                    </TouchableOpacity>

                    {variantDesc ? (
                      <Text style={styles.variantBadge}>
                        Variant: {variantDesc}
                      </Text>
                    ) : null}

                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>
                        ₹{item.price.toLocaleString()}
                      </Text>
                      <Text style={styles.dateAdded}>
                        Added {item.addedAt}
                      </Text>
                    </View>

                    <View style={styles.cardActionRow}>
                      <TouchableOpacity
                        style={styles.moveToCartBtn}
                        onPress={() => shop.moveWishlistToCart(item.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.moveToCartText}>Move to Cart</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => shop.removeFromWishlist(item.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.deleteIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
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
  titleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  headerCount: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '500',
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyHeartCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyHeartEmoji: {
    fontSize: 38,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  multiActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F7F7FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171717',
  },
  multiActionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeSelectedBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  removeSelectedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  moveAllBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  moveAllText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollList: {
    padding: 16,
    paddingBottom: 90,
  },
  wishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    elevation: 1,
  },
  checkWrapper: {
    paddingRight: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  variantBadge: {
    fontSize: 11,
    color: '#5B4BFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
  },
  dateAdded: {
    fontSize: 10,
    color: '#8E8E93',
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moveToCartBtn: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  moveToCartText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  deleteBtn: {
    padding: 6,
  },
  deleteIcon: {
    fontSize: 16,
  },
});
