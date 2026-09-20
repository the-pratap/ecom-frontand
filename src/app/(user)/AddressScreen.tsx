import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useShop, Address } from '../ShopStore';

export default function AddressScreen() {
  const shop = useShop();

  // Modal for Add / Edit Address
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('West Bengal');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setName(shop.user?.name || 'Rahul Das');
    setPhone(shop.user?.phone || '9876543210');
    setStreet('');
    setCity('Bolpur');
    setState('West Bengal');
    setPincode('731204');
    setIsDefault(false);
    setFormError('');
    setModalVisible(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingId(addr.id);
    setName(addr.name);
    setPhone(addr.phone);
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setIsDefault(addr.isDefault);
    setFormError('');
    setModalVisible(true);
  };

  const handleSaveAddress = () => {
    if (!name.trim() || !phone.trim() || !street.trim() || !city.trim() || !pincode.trim()) {
      setFormError('Please fill in all address details.');
      return;
    }

    if (editingId) {
      shop.editAddress(editingId, {
        name,
        phone,
        street,
        city,
        state,
        pincode,
        isDefault,
      });
    } else {
      shop.addAddress({
        name,
        phone,
        street,
        city,
        state,
        pincode,
        country: 'India',
        isDefault,
      });
    }
    setModalVisible(false);
  };

  const handleDeleteAddress = (id: string) => {
    if (shop.addresses.length <= 1) {
      Alert.alert('Cannot Delete', 'At least one delivery address is required.');
      return;
    }
    Alert.alert(
      'Delete Address',
      'Are you sure you want to remove this delivery address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => shop.deleteAddress(id),
        },
      ]
    );
  };

  const handleSelectAndReturn = (id: string) => {
    shop.selectAddress(id);
    router.back();
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
        <Text style={styles.headerTitle}>Delivery Addresses</Text>
        <TouchableOpacity onPress={openAddModal} activeOpacity={0.7}>
          <Text style={styles.addHeaderBtn}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtext}>
          Choose your active shipping destination or manage saved addresses.
        </Text>

        {shop.addresses.map((addr: Address) => {
          const isSelected = shop.selectedAddressId === addr.id;

          return (
            <TouchableOpacity
              key={addr.id}
              style={[styles.addressCard, isSelected && styles.addressCardSelected]}
              onPress={() => shop.selectAddress(addr.id)}
              activeOpacity={0.85}
            >
              {/* Radio and Name */}
              <View style={styles.cardTopRow}>
                <View style={styles.radioRow}>
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.recipientName}>{addr.name}</Text>
                  {addr.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                    </View>
                  )}
                </View>

                {/* Edit Icon */}
                <TouchableOpacity
                  onPress={() => openEditModal(addr)}
                  style={styles.actionIconBtn}
                >
                  <Text style={styles.actionIconText}>✏️</Text>
                </TouchableOpacity>
              </View>

              {/* Address content */}
              <Text style={styles.streetLine}>{addr.street}</Text>
              <Text style={styles.cityStateLine}>
                {addr.city}, {addr.state} - {addr.pincode}
              </Text>
              <Text style={styles.phoneLine}>📞 Phone: {addr.phone}</Text>

              {/* Card Footer Actions */}
              <View style={styles.cardFooter}>
                <View style={styles.footerLeft}>
                  {!addr.isDefault && (
                    <TouchableOpacity
                      style={styles.setDefaultBtn}
                      onPress={() => shop.setDefaultAddress(addr.id)}
                    >
                      <Text style={styles.setDefaultText}>Set as Default</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.footerRight}>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteAddress(addr.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deliverHereBtn}
                    onPress={() => handleSelectAndReturn(addr.id)}
                  >
                    <Text style={styles.deliverHereText}>Deliver Here ✓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Add New Address Large Button */}
        <TouchableOpacity
          style={styles.addNewCardBtn}
          onPress={openAddModal}
          activeOpacity={0.8}
        >
          <Text style={styles.addNewCardPlus}>＋</Text>
          <Text style={styles.addNewCardText}>Add New Delivery Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add / Edit Address Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {formError ? (
              <Text style={styles.errorBanner}>{formError}</Text>
            ) : null}

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Recipient Name"
                  placeholderTextColor="#8E8E93"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mobile Phone (10 digits)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 9876543210"
                  placeholderTextColor="#8E8E93"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Flat, House No., Street Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 21 College Road"
                  placeholderTextColor="#8E8E93"
                  value={street}
                  onChangeText={setStreet}
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Bolpur"
                    placeholderTextColor="#8E8E93"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 731204"
                    placeholderTextColor="#8E8E93"
                    keyboardType="numeric"
                    value={pincode}
                    onChangeText={setPincode}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="West Bengal"
                  placeholderTextColor="#8E8E93"
                  value={state}
                  onChangeText={setState}
                />
              </View>

              {/* Set Default Toggle */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setIsDefault(!isDefault)}
              >
                <Text style={{ fontSize: 18, marginRight: 8 }}>
                  {isDefault ? '☑️' : '⬜'}
                </Text>
                <Text style={styles.checkboxLabel}>Make this my default address</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveAddress}
              >
                <Text style={styles.modalSaveText}>Save Address</Text>
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
  addHeaderBtn: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  subtext: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
  },
  addressCardSelected: {
    borderColor: '#5B4BFF',
    backgroundColor: '#FAF9FF',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#5B4BFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5B4BFF',
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#E0DDFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: '#5B4BFF',
    fontSize: 9,
    fontWeight: '800',
  },
  actionIconBtn: {
    padding: 4,
  },
  actionIconText: {
    fontSize: 15,
  },
  streetLine: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginLeft: 30,
  },
  cityStateLine: {
    fontSize: 13,
    color: '#555555',
    marginLeft: 30,
    marginTop: 2,
  },
  phoneLine: {
    fontSize: 12,
    color: '#171717',
    fontWeight: '600',
    marginLeft: 30,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F2',
    marginLeft: 30,
  },
  footerLeft: {
    flexDirection: 'row',
  },
  setDefaultBtn: {
    paddingVertical: 4,
  },
  setDefaultText: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '600',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  deleteText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  deliverHereBtn: {
    backgroundColor: '#5B4BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deliverHereText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  addNewCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#5B4BFF',
    marginTop: 6,
  },
  addNewCardPlus: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5B4BFF',
    marginRight: 8,
  },
  addNewCardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B4BFF',
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
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#171717',
  },
  modalCloseIcon: {
    fontSize: 18,
    color: '#777777',
    fontWeight: '700',
  },
  errorBanner: {
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F7F7FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#171717',
  },
  twoColRow: {
    flexDirection: 'row',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#171717',
    fontWeight: '600',
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
  modalSaveBtn: {
    width: '64%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#5B4BFF',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
