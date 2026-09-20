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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useShop } from '../ShopStore';

export default function PaymentScreen() {
  const shop = useShop();

  // Payment Methods
  const [selectedMethod, setSelectedMethod] = useState<
    'upi' | 'card' | 'cod' | 'netbanking'
  >('upi');

  // UPI inputs
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');

  // Card inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Rahul Das');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('888');

  // Simulation test mode
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const currentAddress =
    shop.addresses.find((a) => a.id === shop.selectedAddressId) ||
    shop.addresses[0];

  const handlePayNow = () => {
    setPaymentError('');
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);

      if (simulateFailure) {
        setPaymentError(
          'Payment Gateway Error: Transaction declined by issuing bank (Demo Simulation). Please try again or switch payment method.'
        );
        return;
      }

      // Success
      let methodLabel = 'UPI (Google Pay)';
      if (selectedMethod === 'card') methodLabel = `Card (${cardNumber.slice(-4)})`;
      else if (selectedMethod === 'cod') methodLabel = 'Cash on Delivery';
      else if (selectedMethod === 'netbanking') methodLabel = 'Demo Net Banking';
      else {
        methodLabel = `UPI (${selectedUpiApp.toUpperCase()})`;
      }

      const createdOrder = shop.createOrder(methodLabel);

      router.replace({
        pathname: '/(user)/OrderSuccessScreen',
        params: { orderId: createdOrder.id },
      });
    }, 1500);
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
        <Text style={styles.headerTitle}>Select Payment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Payable Banner */}
        <View style={styles.amountBanner}>
          <Text style={styles.amountLabel}>Total Amount Payable</Text>
          <Text style={styles.amountVal}>
            ₹{shop.cartTotals.grandTotal.toFixed(0)}
          </Text>
          <Text style={styles.amountNotice}>
            Includes ₹{shop.cartTotals.totalShipping} shipping • Saved ₹
            {shop.cartTotals.totalSavings.toFixed(0)}
          </Text>
        </View>

        {/* Error alert if failed */}
        {paymentError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{paymentError}</Text>
          </View>
        ) : null}

        {/* 1. UPI Payment Option */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            selectedMethod === 'upi' && styles.methodCardActive,
          ]}
          onPress={() => setSelectedMethod('upi')}
          activeOpacity={0.9}
        >
          <View style={styles.methodHeader}>
            <View style={styles.radioRow}>
              <View
                style={[
                  styles.radio,
                  selectedMethod === 'upi' && styles.radioActive,
                ]}
              >
                {selectedMethod === 'upi' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.methodTitle}>UPI (Instant & Zero Fee)</Text>
            </View>
            <Text style={styles.methodTag}>RECOMMENDED</Text>
          </View>

          {selectedMethod === 'upi' && (
            <View style={styles.methodDetails}>
              <View style={styles.upiAppsRow}>
                <TouchableOpacity
                  style={[
                    styles.upiAppChip,
                    selectedUpiApp === 'gpay' && styles.upiAppChipActive,
                  ]}
                  onPress={() => setSelectedUpiApp('gpay')}
                >
                  <Text style={styles.upiAppName}>Google Pay</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.upiAppChip,
                    selectedUpiApp === 'phonepe' && styles.upiAppChipActive,
                  ]}
                  onPress={() => setSelectedUpiApp('phonepe')}
                >
                  <Text style={styles.upiAppName}>PhonePe</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.upiAppChip,
                    selectedUpiApp === 'paytm' && styles.upiAppChipActive,
                  ]}
                  onPress={() => setSelectedUpiApp('paytm')}
                >
                  <Text style={styles.upiAppName}>Paytm UPI</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>UPI ID / VPA</Text>
              <TextInput
                style={styles.input}
                placeholder="yourname@upi"
                placeholderTextColor="#8E8E93"
                value={upiId}
                onChangeText={setUpiId}
              />
            </View>
          )}
        </TouchableOpacity>

        {/* 2. Credit / Debit Cards */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            selectedMethod === 'card' && styles.methodCardActive,
          ]}
          onPress={() => setSelectedMethod('card')}
          activeOpacity={0.9}
        >
          <View style={styles.methodHeader}>
            <View style={styles.radioRow}>
              <View
                style={[
                  styles.radio,
                  selectedMethod === 'card' && styles.radioActive,
                ]}
              >
                {selectedMethod === 'card' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.methodTitle}>Credit or Debit Card</Text>
            </View>
            <Text style={styles.cardBrands}>Visa • MC • RuPay</Text>
          </View>

          {selectedMethod === 'card' && (
            <View style={styles.methodDetails}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  value={cardHolder}
                  onChangeText={setCardHolder}
                />
              </View>

              <View style={styles.twoCol}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                  <TextInput
                    style={styles.input}
                    value={expiry}
                    onChangeText={setExpiry}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry
                    maxLength={3}
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* 3. Cash On Delivery */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            selectedMethod === 'cod' && styles.methodCardActive,
          ]}
          onPress={() => setSelectedMethod('cod')}
          activeOpacity={0.9}
        >
          <View style={styles.methodHeader}>
            <View style={styles.radioRow}>
              <View
                style={[
                  styles.radio,
                  selectedMethod === 'cod' && styles.radioActive,
                ]}
              >
                {selectedMethod === 'cod' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.methodTitle}>Cash on Delivery (COD)</Text>
            </View>
            <Text style={styles.codIcon}>💵</Text>
          </View>

          {selectedMethod === 'cod' && (
            <View style={styles.methodDetails}>
              <Text style={styles.codNotice}>
                Pay cash or scan courier QR at the time of delivery at your doorstep ({currentAddress?.city}).
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 4. Demo Online Payment */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            selectedMethod === 'netbanking' && styles.methodCardActive,
          ]}
          onPress={() => setSelectedMethod('netbanking')}
          activeOpacity={0.9}
        >
          <View style={styles.methodHeader}>
            <View style={styles.radioRow}>
              <View
                style={[
                  styles.radio,
                  selectedMethod === 'netbanking' && styles.radioActive,
                ]}
              >
                {selectedMethod === 'netbanking' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.methodTitle}>Demo Online Net Banking</Text>
            </View>
            <Text style={styles.codIcon}>🏦</Text>
          </View>
        </TouchableOpacity>

        {/* Simulation Failure Toggle (for grading and testing error states) */}
        <View style={styles.testModeCard}>
          <Text style={styles.testModeTitle}>⚙️ Demo Testing Options</Text>
          <TouchableOpacity
            style={styles.testToggleRow}
            onPress={() => setSimulateFailure(!simulateFailure)}
          >
            <Text style={styles.testToggleLabel}>
              Simulate Failed Payment Transaction
            </Text>
            <Text style={{ fontSize: 18 }}>{simulateFailure ? '☑️' : '⬜'}</Text>
          </TouchableOpacity>
        </View>

        {/* Payment CTA Button */}
        <TouchableOpacity
          style={[styles.payButton, processing && styles.payButtonDisabled]}
          onPress={handlePayNow}
          disabled={processing}
          activeOpacity={0.85}
        >
          {processing ? (
            <View style={styles.processingRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.processingText}>Processing Payment...</Text>
            </View>
          ) : (
            <Text style={styles.payButtonText}>
              Pay ₹{shop.cartTotals.grandTotal.toFixed(0)} Securely 🔒
            </Text>
          )}
        </TouchableOpacity>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  amountBanner: {
    backgroundColor: '#5B4BFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E0DDFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  amountVal: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  amountNotice: {
    fontSize: 11,
    color: '#E0DDFF',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
  },
  methodCardActive: {
    borderColor: '#5B4BFF',
    backgroundColor: '#FAF9FF',
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioActive: {
    borderColor: '#5B4BFF',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5B4BFF',
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
  },
  methodTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardBrands: {
    fontSize: 11,
    color: '#777777',
    fontWeight: '500',
  },
  codIcon: {
    fontSize: 16,
  },
  methodDetails: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F2',
  },
  upiAppsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  upiAppChip: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  upiAppChipActive: {
    borderColor: '#5B4BFF',
    backgroundColor: '#F0EEFF',
  },
  upiAppName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#171717',
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777777',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#171717',
  },
  twoCol: {
    flexDirection: 'row',
  },
  codNotice: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  testModeCard: {
    backgroundColor: '#F0F0F5',
    borderRadius: 14,
    padding: 12,
    marginVertical: 10,
  },
  testModeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555555',
    marginBottom: 6,
  },
  testToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testToggleLabel: {
    fontSize: 12,
    color: '#171717',
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#5B4BFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 14,
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
});
