import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useShop, Product } from '../ShopStore';

export default function AdminProductsScreen() {
  const shop = useShop();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);

  // New product form states
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState('Electronics');
  const [pPrice, setPPrice] = useState('');
  const [pDiscountPrice, setPDiscountPrice] = useState('');
  const [pStock, setPStock] = useState('20');
  const [pDesc, setPDesc] = useState('');

  const filteredProducts = shop.products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCat === 'All' ||
      p.category.toLowerCase() === selectedCat.toLowerCase();
    return matchSearch && matchCat;
  });

  const handleCreateProduct = () => {
    if (!pName.trim() || !pPrice || !pDiscountPrice) {
      Alert.alert('Incomplete Form', 'Please provide product name and valid pricing.');
      return;
    }

    Alert.alert(
      'Product Created! 🎉',
      `"${pName}" has been added to the ShopNest live catalog with ${pStock} units in stock.`,
      [{ text: 'OK', onPress: () => setModalVisible(false) }]
    );
  };

  const handleDelete = (p: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to remove "${p.name}" from catalog?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Deleted', 'Product removed from store catalog.'),
        },
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
        <Text style={styles.headerTitle}>Catalog Management</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Category Filter Bar */}
      <View style={styles.filterBar}>
        <View style={styles.searchBox}>
          <Text style={{ fontSize: 14, marginRight: 6 }}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Filter by name or brand..."
            placeholderTextColor="#8E8E93"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catChipsRow}
        >
          {['All', 'Electronics', 'Fashion', 'Shoes', 'Beauty', 'Home', 'Sports', 'Accessories', 'Grocery'].map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.catChip,
                selectedCat === c && styles.catChipActive,
              ]}
              onPress={() => setSelectedCat(c)}
            >
              <Text
                style={[
                  styles.catChipText,
                  selectedCat === c && styles.catChipTextActive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products List */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.listHeaderCount}>
          Showing {filteredProducts.length} Products in Inventory
        </Text>

        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image
              source={{ uri: product.thumbnail }}
              style={styles.productThumb}
              resizeMode="cover"
            />

            <View style={styles.cardDetails}>
              <View style={styles.topLine}>
                <Text style={styles.brandTag}>{product.brand}</Text>
                <View
                  style={[
                    styles.stockBadge,
                    product.stock <= 15 ? styles.lowStockBadge : styles.inStockBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.stockText,
                      product.stock <= 15 ? styles.lowStockText : styles.inStockText,
                    ]}
                  >
                    {product.stock} in stock
                  </Text>
                </View>
              </View>

              <Text style={styles.productName} numberOfLines={1}>
                {product.name}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.discountPrice}>
                  ₹{product.discountPrice.toLocaleString()}
                </Text>
                <Text style={styles.originalPrice}>
                  ₹{product.price.toLocaleString()}
                </Text>
                <Text style={styles.soldInfo}>• {product.soldCount} sold</Text>
              </View>

              {/* Action Toolbar */}
              <View style={styles.actionToolbar}>
                <TouchableOpacity
                  style={styles.previewBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/(user)/ProductDetailsScreen',
                      params: { productId: product.id },
                    })
                  }
                >
                  <Text style={styles.previewText}>👁️ Store View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(product)}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Product Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Product</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Ultra Gaming Headset"
                  placeholderTextColor="#8E8E93"
                  value={pName}
                  onChangeText={setPName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Brand Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Razer / Sony"
                  placeholderTextColor="#8E8E93"
                  value={pBrand}
                  onChangeText={setPBrand}
                />
              </View>

              <View style={styles.twoCol}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>MRP Price (₹)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 4999"
                    placeholderTextColor="#8E8E93"
                    keyboardType="numeric"
                    value={pPrice}
                    onChangeText={setPPrice}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Sale Price (₹)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 2999"
                    placeholderTextColor="#8E8E93"
                    keyboardType="numeric"
                    value={pDiscountPrice}
                    onChangeText={setPDiscountPrice}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Opening Inventory Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Units available"
                  placeholderTextColor="#8E8E93"
                  keyboardType="numeric"
                  value={pStock}
                  onChangeText={setPStock}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Detailed Description</Text>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                  placeholder="Features, specifications and key benefits..."
                  placeholderTextColor="#8E8E93"
                  multiline
                  value={pDesc}
                  onChangeText={setPDesc}
                />
              </View>
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleCreateProduct}
              >
                <Text style={styles.modalSubmitText}>Publish Product ✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#171717',
    padding: 0,
  },
  catChipsRow: {
    paddingVertical: 2,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#F7F7FA',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  catChipActive: {
    backgroundColor: '#5B4BFF',
    borderColor: '#5B4BFF',
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777777',
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollList: {
    padding: 16,
    paddingBottom: 40,
  },
  listHeaderCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777777',
    marginBottom: 10,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  productThumb: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  brandTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  stockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inStockBadge: {
    backgroundColor: '#DCFCE7',
  },
  lowStockBadge: {
    backgroundColor: '#FEE2E2',
  },
  stockText: {
    fontSize: 10,
    fontWeight: '800',
  },
  inStockText: {
    color: '#16A34A',
  },
  lowStockText: {
    color: '#DC2626',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B4BFF',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 11,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  soldInfo: {
    fontSize: 11,
    color: '#777777',
  },
  actionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F7',
    paddingTop: 6,
  },
  previewBtn: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewText: {
    color: '#5B4BFF',
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  modalClose: {
    fontSize: 18,
    color: '#777777',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F7F7FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#171717',
  },
  twoCol: {
    flexDirection: 'row',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  modalCancelBtn: {
    width: '32%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F7F7FA',
  },
  modalCancelText: {
    color: '#777777',
    fontSize: 14,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    width: '64%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#5B4BFF',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
