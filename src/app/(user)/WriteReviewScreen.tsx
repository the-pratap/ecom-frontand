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
  Alert,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useShop, Product } from '../ShopStore';

export default function WriteReviewScreen() {
  const params = useLocalSearchParams<{ productId?: string }>();
  const shop = useShop();

  const productId = params.productId || 'p1';
  const product: Product =
    shop.products.find((p) => p.id === productId) || shop.products[0];

  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [demoPhotos, setDemoPhotos] = useState<string[]>([]);
  const [validationError, setValidationError] = useState('');

  const handleAddDemoPhoto = () => {
    if (demoPhotos.length >= 3) {
      Alert.alert('Limit Reached', 'You can attach up to 3 photos.');
      return;
    }
    const samplePhotos = [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    ];
    setDemoPhotos((prev) => [...prev, samplePhotos[prev.length % samplePhotos.length]]);
  };

  const handleSubmit = () => {
    setValidationError('');

    if (!rating || rating === 0) {
      setValidationError('Please select a rating between 1 and 5 stars.');
      return;
    }
    if (!title.trim()) {
      setValidationError('Please enter a review title.');
      return;
    }
    if (!comment.trim()) {
      setValidationError('Please enter your review feedback.');
      return;
    }

    shop.addReview(product.id, rating, title, comment);

    Alert.alert(
      'Review Submitted! 🎉',
      'Thank you! Your feedback has been verified and published to the product page.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const getRatingDescriptor = (r: number) => {
    switch (r) {
      case 5:
        return 'Outstanding! Loved it! ⭐⭐⭐⭐⭐';
      case 4:
        return 'Very Good, met expectations! ⭐⭐⭐⭐';
      case 3:
        return 'Average, decent quality. ⭐⭐⭐';
      case 2:
        return 'Below Average, had issues. ⭐⭐';
      case 1:
        return 'Poor quality, not satisfied. ⭐';
      default:
        return '';
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
        <Text style={styles.headerTitle}>Write Review</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Product mini card */}
        <View style={styles.productCard}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.productThumb}
            resizeMode="cover"
          />
          <View style={styles.productInfo}>
            <Text style={styles.brandText}>{product.brand}</Text>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.categoryBadge}>Category: {product.category}</Text>
          </View>
        </View>

        {/* Validation Error Alert */}
        {validationError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{validationError}</Text>
          </View>
        ) : null}

        {/* 1. Rating Selector */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Overall Rating</Text>
          <Text style={styles.sectionSub}>
            Tap a star to rate your experience:
          </Text>

          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => {
                  setRating(star);
                  setValidationError('');
                }}
                style={styles.starTouch}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.starIcon,
                    star <= rating ? styles.starFilled : styles.starEmpty,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingDescriptor}>
            {getRatingDescriptor(rating)}
          </Text>
        </View>

        {/* 2. Review Title Input */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Review Headline</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Great sound quality & sleek design"
            placeholderTextColor="#8E8E93"
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              setValidationError('');
            }}
          />
        </View>

        {/* 3. Detailed Feedback Input */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Detailed Review</Text>
          <TextInput
            style={styles.textArea}
            placeholder="What did you like or dislike? How does it fit into your daily routine? Share your honest impressions..."
            placeholderTextColor="#8E8E93"
            multiline
            numberOfLines={5}
            value={comment}
            onChangeText={(t) => {
              setComment(t);
              setValidationError('');
            }}
          />
        </View>

        {/* 4. Attach Customer Photos (Demo picker) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Attach Photos (Optional)</Text>
          <Text style={styles.sectionSub}>
            Show other buyers how this item looks in real life.
          </Text>

          <View style={styles.photosRow}>
            {demoPhotos.map((photo, idx) => (
              <View key={idx} style={styles.photoThumbWrapper}>
                <Image source={{ uri: photo }} style={styles.photoThumb} />
                <TouchableOpacity
                  style={styles.removePhotoBtn}
                  onPress={() =>
                    setDemoPhotos((prev) => prev.filter((_, i) => i !== idx))
                  }
                >
                  <Text style={styles.removePhotoIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {demoPhotos.length < 3 && (
              <TouchableOpacity
                style={styles.addPhotoBtn}
                onPress={handleAddDemoPhoto}
                activeOpacity={0.8}
              >
                <Text style={styles.addPhotoIcon}>📷</Text>
                <Text style={styles.addPhotoText}>+ Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Submit Review Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>Submit Customer Review ✓</Text>
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
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  productThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  brandText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 2,
  },
  categoryBadge: {
    fontSize: 11,
    color: '#5B4BFF',
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
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
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 12,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  starTouch: {
    paddingHorizontal: 8,
  },
  starIcon: {
    fontSize: 38,
  },
  starFilled: {
    color: '#F59E0B',
  },
  starEmpty: {
    color: '#E5E5E5',
  },
  ratingDescriptor: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#5B4BFF',
    marginTop: 6,
  },
  input: {
    backgroundColor: '#F7F7FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#171717',
  },
  textArea: {
    backgroundColor: '#F7F7FA',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#171717',
    minHeight: 110,
    textAlignVertical: 'top',
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoThumbWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  photoThumb: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#171717',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  addPhotoBtn: {
    width: 80,
    height: 70,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#5B4BFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0EEFF',
  },
  addPhotoIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  addPhotoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5B4BFF',
  },
  submitBtn: {
    backgroundColor: '#5B4BFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#5B4BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
