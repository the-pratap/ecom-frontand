import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useShop, Order } from '../ShopStore';

interface TimelineStep {
  title: string;
  description: string;
  time: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export default function TrackOrderScreen() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const shop = useShop();

  const orderId = params.orderId;
  const order: Order =
    shop.orders.find((o) => o.id === orderId) || shop.orders[0];

  // Determine timeline state based on order status
  const getTimelineSteps = (): TimelineStep[] => {
    const isDelivered = order.status === 'Delivered';
    const isShipped = isDelivered || order.status === 'Shipped';
    const isProcessing = isShipped || order.status === 'Processing';

    return [
      {
        title: 'Order Placed',
        description: `Order #${order.id} received and payment verified via ${order.paymentMethod}.`,
        time: `${order.date} 10:30 AM`,
        isCompleted: true,
        isCurrent: false,
      },
      {
        title: 'Order Confirmed',
        description: 'Seller accepted order and packed items with protective bubble cushioning.',
        time: `${order.date} 01:15 PM`,
        isCompleted: true,
        isCurrent: false,
      },
      {
        title: 'Processing in Fulfillment Hub',
        description: 'Quality inspected and assigned to local logistics facility.',
        time: `${order.date} 04:45 PM`,
        isCompleted: isProcessing,
        isCurrent: order.status === 'Processing',
      },
      {
        title: 'Shipped & In Transit',
        description: `Dispatched with ${order.courier}. Tracking ID: ${order.trackingId}`,
        time: isShipped ? '2026-09-21 08:00 AM' : 'Pending',
        isCompleted: isShipped,
        isCurrent: order.status === 'Shipped',
      },
      {
        title: 'Out for Delivery',
        description: `Assigned to delivery agent (Bikash Roy). Courier will verify OTP at destination.`,
        time: isDelivered ? '2026-09-21 11:30 AM' : 'Expected soon',
        isCompleted: isDelivered,
        isCurrent: false,
      },
      {
        title: 'Delivered',
        description: `Handed over directly to ${order.address.name} at ${order.address.city}.`,
        time: isDelivered ? '2026-09-21 02:15 PM' : order.estimatedDelivery,
        isCompleted: isDelivered,
        isCurrent: isDelivered,
      },
    ];
  };

  const steps = getTimelineSteps();

  const handleCallCourier = () => {
    Alert.alert(
      'Contact Courier Service',
      `ShopNest Express Support Desk is active for parcel #${order.trackingId}. Call Helpline: 1800-200-NEST?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Simulate Call', onPress: () => Alert.alert('Connected', 'Speaking to ShopNest delivery dispatch center.') },
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
        <Text style={styles.headerTitle}>Package Tracking</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Info Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <Text style={styles.trackingHeaderLabel}>COURIER PARTNER</Text>
              <Text style={styles.courierName}>{order.courier}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{order.status}</Text>
            </View>
          </View>

          <View style={styles.trackingRow}>
            <Text style={styles.trackingIdLabel}>Tracking Number:</Text>
            <Text style={styles.trackingIdVal}>{order.trackingId}</Text>
          </View>

          <View style={styles.deliveryEstimateBox}>
            <Text style={styles.estimateTitle}>Estimated Delivery</Text>
            <Text style={styles.estimateDate}>{order.estimatedDelivery}</Text>
          </View>
        </View>

        {/* Courier Support Card */}
        <View style={styles.courierCard}>
          <View style={styles.courierIconCircle}>
            <Text style={{ fontSize: 22 }}>🚚</Text>
          </View>
          <View style={styles.courierInfo}>
            <Text style={styles.courierDriver}>Assigned Hub: Bolpur Express</Text>
            <Text style={styles.courierContact}>Dispatched on time</Text>
          </View>
          <TouchableOpacity
            style={styles.callBtn}
            onPress={handleCallCourier}
            activeOpacity={0.8}
          >
            <Text style={styles.callBtnText}>📞 Help</Text>
          </TouchableOpacity>
        </View>

        {/* Vertical Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineCardTitle}>Live Tracking Timeline</Text>

          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;

            return (
              <View key={index} style={styles.stepContainer}>
                {/* Left Step Indicator Column */}
                <View style={styles.stepLeftCol}>
                  <View
                    style={[
                      styles.stepCircle,
                      step.isCompleted && styles.stepCircleCompleted,
                      step.isCurrent && styles.stepCircleCurrent,
                    ]}
                  >
                    {step.isCompleted ? (
                      <Text style={styles.stepCheck}>✓</Text>
                    ) : (
                      <View style={styles.stepDotPending} />
                    )}
                  </View>

                  {!isLast && (
                    <View
                      style={[
                        styles.connectorLine,
                        step.isCompleted && styles.connectorLineActive,
                      ]}
                    />
                  )}
                </View>

                {/* Right Step Content */}
                <View style={styles.stepRightCol}>
                  <View style={styles.stepTitleRow}>
                    <Text
                      style={[
                        styles.stepTitle,
                        step.isCompleted && styles.stepTitleCompleted,
                      ]}
                    >
                      {step.title}
                    </Text>
                    <Text style={styles.stepTime}>{step.time}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{step.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Delivery Address Details */}
        <View style={styles.destCard}>
          <Text style={styles.destTitle}>📍 Delivery Address</Text>
          <Text style={styles.destName}>{order.address.name}</Text>
          <Text style={styles.destAddress}>
            {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
          </Text>
        </View>

        {/* Back to Home Button */}
        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={() => router.push('/(user)/HomeScreen')}
          activeOpacity={0.85}
        >
          <Text style={styles.backHomeText}>Return to Home →</Text>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trackingHeaderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  courierName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#5B4BFF',
  },
  statusPill: {
    backgroundColor: '#E0EEFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '800',
  },
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackingIdLabel: {
    fontSize: 13,
    color: '#777777',
    marginRight: 6,
  },
  trackingIdVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#171717',
  },
  deliveryEstimateBox: {
    backgroundColor: '#F0EEFF',
    borderRadius: 12,
    padding: 12,
  },
  estimateTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B4BFF',
    textTransform: 'uppercase',
  },
  estimateDate: {
    fontSize: 16,
    fontWeight: '800',
    color: '#171717',
    marginTop: 2,
  },
  courierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  courierIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courierInfo: {
    flex: 1,
  },
  courierDriver: {
    fontSize: 13,
    fontWeight: '700',
    color: '#171717',
  },
  courierContact: {
    fontSize: 11,
    color: '#777777',
    marginTop: 1,
  },
  callBtn: {
    backgroundColor: '#F7F7FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  timelineCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  stepLeftCol: {
    alignItems: 'center',
    width: 30,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepCircleCompleted: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  stepCircleCurrent: {
    borderColor: '#5B4BFF',
    backgroundColor: '#5B4BFF',
  },
  stepCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  stepDotPending: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C7C7CC',
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 2,
  },
  connectorLineActive: {
    backgroundColor: '#16A34A',
  },
  stepRightCol: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 22,
  },
  stepTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  stepTitleCompleted: {
    fontWeight: '800',
    color: '#171717',
  },
  stepTime: {
    fontSize: 10,
    color: '#8E8E93',
  },
  stepDesc: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 16,
  },
  destCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  destTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  destName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  destAddress: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  backHomeBtn: {
    backgroundColor: '#5B4BFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backHomeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
