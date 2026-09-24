import React, { useState, useEffect, useSyncExternalStore } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

export interface ProductVariant {
  colors?: string[];
  sizes?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number;
  images: string[];
  thumbnail: string;
  stock: number;
  shippingCharge: number;
  averageRating: number;
  totalReviews: number;
  soldCount: number;
  isActive: boolean;
  variants: ProductVariant;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: {
    color?: string;
    size?: string;
  };
  quantity: number;
  price: number;
  discountPrice: number;
  shippingCharge: number;
}

export interface WishlistItem {
  id: string;
  product: Product;
  variant: {
    color?: string;
    size?: string;
  };
  price: number;
  addedAt: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  description: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  couponDiscount: number;
  couponCode?: string;
  total: number;
  savings: number;
  address: Address;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Cash on Delivery';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingId: string;
  courier: string;
  estimatedDelivery: string;
}

export interface Review {
  id: string;
  productId: string;
  user: string;
  avatar: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  status: 'approved';
  replies?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'offer' | 'system';
  createdAt: string;
  isRead: boolean;
  orderId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'user' | 'admin';
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  description: string;
}

// ==========================================
// 2. DEMO DATA DEFINITIONS
// ==========================================

export const DEMO_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Electronics', icon: '⚡', productCount: 8, description: 'Gadgets, audio, smart watches & accessories' },
  { id: '2', name: 'Fashion', icon: '👕', productCount: 4, description: 'Trendy apparel, hoodies, t-shirts & streetwear' },
  { id: '3', name: 'Shoes', icon: '👟', productCount: 3, description: 'Running sneakers, sport shoes & casuals' },
  { id: '4', name: 'Beauty', icon: '✨', productCount: 2, description: 'Skincare, organic oils & wellness' },
  { id: '5', name: 'Home', icon: '🏠', productCount: 3, description: 'Smart bulbs, minimal lamps & modern decor' },
  { id: '6', name: 'Sports', icon: '⚽', productCount: 2, description: 'Yoga mats, gym bottles & fitness gear' },
  { id: '7', name: 'Accessories', icon: '🕶️', productCount: 3, description: 'Leather backpacks, travel bags & sunglasses' },
  { id: '8', name: 'Grocery', icon: '🍎', productCount: 2, description: 'Artisanal coffee, pantry staples & organic treats' },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Pro Wireless Headphones',
    slug: 'pro-wireless-headphones',
    description: 'Industry-leading noise canceling wireless over-ear headphones with 40-hour battery life, spatial audio, and ultra-soft memory foam earcups.',
    brand: 'Sony',
    category: 'Electronics',
    price: 4999,
    discountPrice: 2999,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    stock: 18,
    shippingCharge: 50,
    averageRating: 4.8,
    totalReviews: 320,
    soldCount: 1420,
    isActive: true,
    variants: {
      colors: ['Midnight Black', 'Platinum Silver', 'Deep Navy'],
    },
  },
  {
    id: 'p2',
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    description: 'Always-On Retina display, ECG sensor, advanced workout tracking, sleep score, and 50m water resistance.',
    brand: 'Apple',
    category: 'Electronics',
    price: 8999,
    discountPrice: 5499,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    stock: 14,
    shippingCharge: 60,
    averageRating: 4.7,
    totalReviews: 210,
    soldCount: 890,
    isActive: true,
    variants: {
      colors: ['Space Gray', 'Starlight', 'Product Red'],
      sizes: ['41mm', '45mm'],
    },
  },
  {
    id: 'p3',
    name: 'Mechanical Keyboard RGB',
    slug: 'mechanical-keyboard-rgb',
    description: 'Wireless 75% compact mechanical keyboard with hot-swappable switches, PBT keycaps, and custom RGB backlighting.',
    brand: 'Keychron',
    category: 'Electronics',
    price: 5999,
    discountPrice: 3899,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80',
    stock: 22,
    shippingCharge: 70,
    averageRating: 4.9,
    totalReviews: 145,
    soldCount: 620,
    isActive: true,
    variants: {
      colors: ['Retro Grey', 'Stealth Black'],
      sizes: ['Red Switch', 'Brown Switch', 'Blue Switch'],
    },
  },
  {
    id: 'p4',
    name: 'Wireless Ergonomic Mouse',
    slug: 'wireless-ergonomic-mouse',
    description: 'Precision scroll wheel, 4000 DPI Darkfield sensor, thumb gesture button, and multi-device Bluetooth pairing.',
    brand: 'Logitech',
    category: 'Electronics',
    price: 2499,
    discountPrice: 1499,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
    stock: 35,
    shippingCharge: 40,
    averageRating: 4.6,
    totalReviews: 98,
    soldCount: 510,
    isActive: true,
    variants: {
      colors: ['Graphite', 'Pale Grey', 'Rose'],
    },
  },
  {
    id: 'p5',
    name: 'Bluetooth Bass Speaker',
    slug: 'bluetooth-bass-speaker',
    description: '360-degree immersive sound, IP67 waterproof & dustproof, 20 hours playtime, and powerbank function.',
    brand: 'JBL',
    category: 'Electronics',
    price: 3999,
    discountPrice: 2299,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80',
    stock: 25,
    shippingCharge: 50,
    averageRating: 4.7,
    totalReviews: 180,
    soldCount: 1120,
    isActive: true,
    variants: {
      colors: ['Camo Green', 'Matte Black', 'Ocean Blue'],
    },
  },
  {
    id: 'p6',
    name: 'Ultralight Running Shoes',
    slug: 'ultralight-running-shoes',
    description: 'Engineered mesh upper for breathability, responsive foam cushioning, and high-traction rubber outsole.',
    brand: 'Nike',
    category: 'Shoes',
    price: 4599,
    discountPrice: 2799,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    stock: 19,
    shippingCharge: 80,
    averageRating: 4.8,
    totalReviews: 410,
    soldCount: 2300,
    isActive: true,
    variants: {
      colors: ['Neon Crimson', 'Stealth Black', 'Pure White'],
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    },
  },
  {
    id: 'p7',
    name: 'Classic Cotton Crew T-Shirt',
    slug: 'classic-cotton-tshirt',
    description: '100% combed ringspun organic cotton, pre-shrunk fabric, tailored modern cut with reinforced collar.',
    brand: 'Zara',
    category: 'Fashion',
    price: 1299,
    discountPrice: 699,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80',
    stock: 50,
    shippingCharge: 30,
    averageRating: 4.5,
    totalReviews: 340,
    soldCount: 3100,
    isActive: true,
    variants: {
      colors: ['Crisp White', 'Olive Green', 'Charcoal Grey'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
  },
  {
    id: 'p8',
    name: 'Premium Fleece Hoodie',
    slug: 'premium-fleece-hoodie',
    description: 'Heavyweight brushed fleece hoodie with kangaroo pocket, double-lined hood, and ribbed cuffs.',
    brand: 'H&M',
    category: 'Fashion',
    price: 2999,
    discountPrice: 1899,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&q=80',
    stock: 28,
    shippingCharge: 50,
    averageRating: 4.6,
    totalReviews: 280,
    soldCount: 1840,
    isActive: true,
    variants: {
      colors: ['Jet Black', 'Dusty Rose', 'Heather Grey'],
      sizes: ['M', 'L', 'XL', 'XXL'],
    },
  },
  {
    id: 'p9',
    name: 'Handcrafted Leather Backpack',
    slug: 'handcrafted-leather-backpack',
    description: 'Full-grain vintage crazy horse leather backpack with 15.6" laptop compartment, brass buckles, and water-resistant lining.',
    brand: 'Fossil',
    category: 'Accessories',
    price: 6499,
    discountPrice: 4299,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    stock: 12,
    shippingCharge: 90,
    averageRating: 4.9,
    totalReviews: 115,
    soldCount: 430,
    isActive: true,
    variants: {
      colors: ['Cognac Tan', 'Vintage Brown', 'Classic Black'],
    },
  },
  {
    id: 'p10',
    name: 'All-Weather Travel Backpack',
    slug: 'all-weather-travel-backpack',
    description: '40L expandable carry-on backpack with waterproof zippers, hidden anti-theft pocket, and USB charging pass-through.',
    brand: 'Wildcraft',
    category: 'Accessories',
    price: 4299,
    discountPrice: 2699,
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80',
    stock: 20,
    shippingCharge: 60,
    averageRating: 4.7,
    totalReviews: 190,
    soldCount: 970,
    isActive: true,
    variants: {
      colors: ['Urban Grey', 'Forest Green', 'Midnight Blue'],
    },
  },
  {
    id: 'p11',
    name: 'Minimal Nordic Table Lamp',
    slug: 'minimal-nordic-table-lamp',
    description: 'Sculptural matte ceramic base with warm linen shade, touch-dimmable warm light, and braided cord.',
    brand: 'Ikea',
    category: 'Home',
    price: 2899,
    discountPrice: 1699,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
    stock: 16,
    shippingCharge: 60,
    averageRating: 4.6,
    totalReviews: 82,
    soldCount: 360,
    isActive: true,
    variants: {
      colors: ['Sand Beige', 'Matte White', 'Charcoal'],
    },
  },
  {
    id: 'p12',
    name: 'Smart WiFi LED Bulb 9W',
    slug: 'smart-wifi-led-bulb',
    description: '16 million colors, tunable white (2200K-6500K), app control, Alexa & Google Assistant compatible.',
    brand: 'Philips',
    category: 'Home',
    price: 1199,
    discountPrice: 599,
    images: [
      'https://images.unsplash.com/photo-1550524514-9b88939c3e29?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1550524514-9b88939c3e29?w=400&q=80',
    stock: 60,
    shippingCharge: 30,
    averageRating: 4.5,
    totalReviews: 520,
    soldCount: 4200,
    isActive: true,
    variants: {
      sizes: ['9W Base B22', '12W Base E27'],
    },
  },
  {
    id: 'p13',
    name: 'Polarized Aviator Sunglasses',
    slug: 'polarized-aviator-sunglasses',
    description: 'Classic teardrop frame, UV400 polarized crystal lenses with anti-reflective coating and premium leather case.',
    brand: 'Ray-Ban',
    category: 'Accessories',
    price: 3499,
    discountPrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80',
    stock: 24,
    shippingCharge: 40,
    averageRating: 4.8,
    totalReviews: 160,
    soldCount: 780,
    isActive: true,
    variants: {
      colors: ['Gold / G-15 Green', 'Gunmetal / Grey', 'Black / Polarized Blue'],
    },
  },
  {
    id: 'p14',
    name: 'Insulated Sports Bottle',
    slug: 'insulated-sports-bottle',
    description: 'Double-wall vacuum insulation keeps cold 24 hours or hot 12 hours. BPA-free 18/8 food-grade stainless steel with leakproof spout.',
    brand: 'HydroFlask',
    category: 'Sports',
    price: 1499,
    discountPrice: 899,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    stock: 45,
    shippingCharge: 40,
    averageRating: 4.7,
    totalReviews: 230,
    soldCount: 1560,
    isActive: true,
    variants: {
      colors: ['Pacific Blue', 'Lava Red', 'Sage Green'],
      sizes: ['750 ml', '1000 ml'],
    },
  },
  {
    id: 'p15',
    name: 'Eco-Friendly Non-Slip Yoga Mat',
    slug: 'eco-friendly-yoga-mat',
    description: 'Natural tree rubber with textured grip surface, alignment lines, extra thick 6mm cushioning, and carrying strap included.',
    brand: 'Lululemon',
    category: 'Sports',
    price: 2199,
    discountPrice: 1299,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80',
    stock: 30,
    shippingCharge: 60,
    averageRating: 4.8,
    totalReviews: 140,
    soldCount: 690,
    isActive: true,
    variants: {
      colors: ['Teal Green', 'Plum Purple', 'Slate Grey'],
      sizes: ['6mm Standard', '8mm Extra Thick'],
    },
  },
  {
    id: 'p16',
    name: 'Ultra-Fast Gaming Mouse 16000 DPI',
    slug: 'ultra-fast-gaming-mouse',
    description: 'Optical focus+ 16K sensor, optical mouse switches rated for 70M clicks, and ultra-flexible speedflex cable.',
    brand: 'Razer',
    category: 'Electronics',
    price: 3199,
    discountPrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80',
    stock: 26,
    shippingCharge: 40,
    averageRating: 4.7,
    totalReviews: 175,
    soldCount: 880,
    isActive: true,
    variants: {
      colors: ['Classic Black', 'Mercury White'],
    },
  },
  {
    id: 'p17',
    name: 'RGB Compact Gaming Keyboard',
    slug: 'rgb-compact-gaming-keyboard',
    description: 'Tenkeyless design, detachable braided USB-C cable, dynamic per-key RGB backlighting, and tournament lock switch.',
    brand: 'Corsair',
    category: 'Electronics',
    price: 4499,
    discountPrice: 2799,
    images: [
      'https://images.unsplash.com/photo-1541140532154-b024d705b909?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1541140532154-b024d705b909?w=400&q=80',
    stock: 15,
    shippingCharge: 60,
    averageRating: 4.8,
    totalReviews: 130,
    soldCount: 540,
    isActive: true,
    variants: {
      colors: ['Matte Black', 'Glacier White'],
    },
  },
  {
    id: 'p18',
    name: '20000mAh 65W Fast Power Bank',
    slug: 'fast-power-bank-20000mah',
    description: 'Triple port output (2x USB-C PD 65W + 1x USB-A 22.5W), charges laptops and smartphones at maximum speed with smart digital LED percentage screen.',
    brand: 'Anker',
    category: 'Electronics',
    price: 3999,
    discountPrice: 2499,
    images: [
      'https://images.unsplash.com/photo-1609592424300-88099e46a782?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1609592424300-88099e46a782?w=400&q=80',
    stock: 32,
    shippingCharge: 50,
    averageRating: 4.9,
    totalReviews: 380,
    soldCount: 2800,
    isActive: true,
    variants: {
      colors: ['Space Grey', 'Arctic White'],
    },
  },
  {
    id: 'p19',
    name: 'Streetwear Casual Sneakers',
    slug: 'streetwear-casual-sneakers',
    description: 'Clean low-profile silhouette with perforated toe box, genuine suede overlays, and durable gum rubber sole.',
    brand: 'Puma',
    category: 'Shoes',
    price: 3899,
    discountPrice: 2199,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80',
    stock: 21,
    shippingCharge: 70,
    averageRating: 4.6,
    totalReviews: 290,
    soldCount: 1450,
    isActive: true,
    variants: {
      colors: ['Chalk White & Tan', 'Triple White', 'Black & Gum'],
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    },
  },
  {
    id: 'p20',
    name: '4K Compact Vlogging Camera',
    slug: '4k-compact-vlogging-camera',
    description: '1-inch Exmor RS CMOS sensor, 24-70mm f/1.8-2.8 Zeiss lens, flip-out touchscreen LCD, and directional 3-capsule mic with windscreen.',
    brand: 'Sony',
    category: 'Electronics',
    price: 28999,
    discountPrice: 21499,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
    stock: 8,
    shippingCharge: 120,
    averageRating: 4.9,
    totalReviews: 74,
    soldCount: 210,
    isActive: true,
    variants: {
      colors: ['Classic Black', 'Silver Limited Edition'],
    },
  },
  {
    id: 'p21',
    name: 'Cold Pressed Organic Argan Oil',
    slug: 'organic-argan-oil',
    description: '100% pure Moroccan argan oil rich in Vitamin E and essential fatty acids for hair hydration, skin nourishment, and nail strength.',
    brand: 'Forest Essentials',
    category: 'Beauty',
    price: 1299,
    discountPrice: 799,
    images: [
      'https://images.unsplash.com/photo-1608248597359-0097787034c7?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1608248597359-0097787034c7?w=400&q=80',
    stock: 40,
    shippingCharge: 30,
    averageRating: 4.7,
    totalReviews: 140,
    soldCount: 650,
    isActive: true,
    variants: {
      sizes: ['50 ml', '100 ml'],
    },
  },
  {
    id: 'p22',
    name: 'Estate Arabica Coffee Beans 500g',
    slug: 'estate-arabica-coffee-beans',
    description: 'Single-origin washed medium roast Arabica coffee beans with notes of dark chocolate, toasted almond, and sweet orange zest.',
    brand: 'Blue Tokai',
    category: 'Grocery',
    price: 899,
    discountPrice: 549,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80',
    stock: 55,
    shippingCharge: 30,
    averageRating: 4.8,
    totalReviews: 310,
    soldCount: 1890,
    isActive: true,
    variants: {
      sizes: ['Whole Beans 500g', 'French Press Grind 500g', 'Pour Over Grind 500g'],
    },
  },
];

export const DEMO_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Rahul Das',
    phone: '9876543210',
    street: '21 College Road',
    city: 'Bolpur',
    state: 'West Bengal',
    pincode: '731204',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'Rahul Das',
    phone: '9876543210',
    street: '12 College Street, 2nd Floor',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700001',
    country: 'India',
    isDefault: false,
  },
  {
    id: 'addr-3',
    name: 'Rahul Das',
    phone: '9876543210',
    street: 'Flat 4B, Silver Oak Residency, Sector 5',
    city: 'Salt Lake, Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    country: 'India',
    isDefault: false,
  },
];

export const DEMO_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 1000,
    description: '10% OFF on all orders above ₹1,000',
  },
  {
    code: 'SAVE200',
    discountType: 'fixed',
    discountValue: 200,
    minOrder: 2000,
    description: 'Flat ₹200 OFF on orders above ₹2,000',
  },
];

export const DEMO_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'p1',
    user: 'Ananya Sen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    rating: 5,
    title: 'Outstanding Sound Quality & ANC',
    comment: 'The active noise cancellation is world class. Blocks out all metro and cafe noise easily. Battery lasts nearly a week on moderate usage!',
    createdAt: '2026-09-18',
    helpfulCount: 24,
    status: 'approved',
  },
  {
    id: 'rev-2',
    productId: 'p1',
    user: 'Vikram Roy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    rating: 4,
    title: 'Super comfortable for long hours',
    comment: 'Wore it for an 8-hour workday without any ear fatigue. Microphone is crystal clear for Zoom calls. Slight bass heaviness but easily EQ-able.',
    createdAt: '2026-09-14',
    helpfulCount: 12,
    status: 'approved',
  },
  {
    id: 'rev-3',
    productId: 'p1',
    user: 'Sneha Mukherjee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    rating: 5,
    title: 'Value for money deal!',
    comment: 'Got it on sale price. Best headphones in this segment without doubt. Premium unboxing experience and case.',
    createdAt: '2026-09-10',
    helpfulCount: 8,
    status: 'approved',
  },
  {
    id: 'rev-4',
    productId: 'p2',
    user: 'Amitava Bose',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    rating: 5,
    title: 'Perfect fitness and health companion',
    comment: 'The display is super bright outdoors under direct sunlight. Step counting and heart rate monitor match medical devices.',
    createdAt: '2026-09-16',
    helpfulCount: 19,
    status: 'approved',
  },
  {
    id: 'rev-5',
    productId: 'p3',
    user: 'Dev Kumar',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&q=80',
    rating: 5,
    title: 'Heaven for programmers & writers',
    comment: 'Typing feel on the brown switches is tactile and satisfying without being loud. Wireless connection switch between Mac and PC is instantaneous.',
    createdAt: '2026-09-17',
    helpfulCount: 15,
    status: 'approved',
  },
  {
    id: 'rev-6',
    productId: 'p6',
    user: 'Pooja Ghosh',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
    rating: 5,
    title: 'Super light and springy!',
    comment: 'Clocked a 10K marathon personal best in these. Fits true to size and the neon colour looks even better in person.',
    createdAt: '2026-09-12',
    helpfulCount: 31,
    status: 'approved',
  },
  {
    id: 'rev-7',
    productId: 'p7',
    user: 'Rohan Banerjee',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&q=80',
    rating: 4,
    title: 'Great fabric thickness',
    comment: 'Pure combed cotton. Did not shrink after the first gentle wash. Very comfortable regular fit.',
    createdAt: '2026-09-11',
    helpfulCount: 7,
    status: 'approved',
  },
  {
    id: 'rev-8',
    productId: 'p9',
    user: 'Subhashish Paul',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    rating: 5,
    title: 'Heirloom quality genuine leather',
    comment: 'The scent of raw leather is authentic. It develops a rich patina over time. Fits my 15-inch laptop and charger neatly.',
    createdAt: '2026-09-08',
    helpfulCount: 18,
    status: 'approved',
  },
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Order Shipped 🚚',
    message: 'Your order SN-20260921-1001 with Pro Wireless Headphones has been dispatched via ShopNest Express.',
    type: 'order',
    createdAt: '2 hours ago',
    isRead: false,
    orderId: 'SN-20260921-1001',
  },
  {
    id: 'notif-2',
    title: 'Mega Festive Sale is Live! 🔥',
    message: 'Enjoy up to 50% OFF on top electronics, fashion & sports gear. Use coupon WELCOME10 for extra savings!',
    type: 'promo',
    createdAt: '5 hours ago',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Special Coupon Unlocked 🎁',
    message: 'Use code SAVE200 on orders above ₹2,000 and get instant ₹200 discount at checkout.',
    type: 'offer',
    createdAt: '1 day ago',
    isRead: true,
  },
  {
    id: 'notif-4',
    title: 'Order Delivered Successfully 🎉',
    message: 'Your order SN-20260920-1002 was handed over to Rahul Das. Please leave your product review!',
    type: 'order',
    createdAt: '1 day ago',
    isRead: true,
    orderId: 'SN-20260920-1002',
  },
  {
    id: 'notif-5',
    title: 'Price Drop Alert 📉',
    message: 'Smart Watch Pro from your wishlist dropped price by ₹500 today.',
    type: 'offer',
    createdAt: '2 days ago',
    isRead: true,
  },
  {
    id: 'notif-6',
    title: 'Account Security Verified 🛡️',
    message: 'Your ShopNest profile is secured with 2-factor protection.',
    type: 'system',
    createdAt: '3 days ago',
    isRead: true,
  },
  {
    id: 'notif-7',
    title: 'Order Confirmed 📦',
    message: 'Your order SN-20260918-1003 is currently being packed in our Bolpur fulfillment hub.',
    type: 'order',
    createdAt: '4 days ago',
    isRead: true,
    orderId: 'SN-20260918-1003',
  },
  {
    id: 'notif-8',
    title: 'Welcome to ShopNest! ✨',
    message: 'Explore over 20+ premium products and curated categories with free express delivery options.',
    type: 'system',
    createdAt: '1 week ago',
    isRead: true,
  },
];

export const DEMO_ORDERS: Order[] = [
  {
    id: 'SN-20260921-1001',
    date: '2026-09-21',
    items: [
      {
        id: 'ci-ord-1',
        product: DEMO_PRODUCTS[0], // Headphones
        variant: { color: 'Midnight Black' },
        quantity: 1,
        price: 4999,
        discountPrice: 2999,
        shippingCharge: 50,
      },
      {
        id: 'ci-ord-2',
        product: DEMO_PRODUCTS[3], // Mouse
        variant: { color: 'Graphite' },
        quantity: 1,
        price: 2499,
        discountPrice: 1499,
        shippingCharge: 40,
      },
    ],
    subtotal: 4498,
    discount: 3000,
    shipping: 90,
    couponDiscount: 200,
    couponCode: 'SAVE200',
    total: 4388,
    savings: 3200,
    address: DEMO_ADDRESSES[0],
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'Paid',
    status: 'Shipped',
    trackingId: 'SNX78451290',
    courier: 'ShopNest Express',
    estimatedDelivery: '2026-09-23',
  },
  {
    id: 'SN-20260920-1002',
    date: '2026-09-20',
    items: [
      {
        id: 'ci-ord-3',
        product: DEMO_PRODUCTS[5], // Shoes
        variant: { color: 'Neon Crimson', size: 'UK 9' },
        quantity: 1,
        price: 4599,
        discountPrice: 2799,
        shippingCharge: 80,
      },
    ],
    subtotal: 2799,
    discount: 1800,
    shipping: 80,
    couponDiscount: 0,
    total: 2879,
    savings: 1800,
    address: DEMO_ADDRESSES[1],
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
    status: 'Delivered',
    trackingId: 'SNX78411002',
    courier: 'ShopNest Express',
    estimatedDelivery: '2026-09-21',
  },
  {
    id: 'SN-20260918-1003',
    date: '2026-09-18',
    items: [
      {
        id: 'ci-ord-4',
        product: DEMO_PRODUCTS[2], // Keyboard
        variant: { color: 'Retro Grey', size: 'Brown Switch' },
        quantity: 1,
        price: 5999,
        discountPrice: 3899,
        shippingCharge: 70,
      },
    ],
    subtotal: 3899,
    discount: 2100,
    shipping: 70,
    couponDiscount: 389.9,
    couponCode: 'WELCOME10',
    total: 3579.1,
    savings: 2489.9,
    address: DEMO_ADDRESSES[0],
    paymentMethod: 'Card (Visa ending in 4242)',
    paymentStatus: 'Paid',
    status: 'Processing',
    trackingId: 'SNX78399812',
    courier: 'ShopNest Express',
    estimatedDelivery: '2026-09-24',
  },
  {
    id: 'SN-20260915-1004',
    date: '2026-09-15',
    items: [
      {
        id: 'ci-ord-5',
        product: DEMO_PRODUCTS[6], // T-Shirt
        variant: { color: 'Olive Green', size: 'L' },
        quantity: 2,
        price: 1299,
        discountPrice: 699,
        shippingCharge: 30,
      },
      {
        id: 'ci-ord-6',
        product: DEMO_PRODUCTS[13], // Bottle
        variant: { color: 'Pacific Blue', size: '1000 ml' },
        quantity: 1,
        price: 1499,
        discountPrice: 899,
        shippingCharge: 40,
      },
    ],
    subtotal: 2297,
    discount: 1800,
    shipping: 100,
    couponDiscount: 200,
    couponCode: 'SAVE200',
    total: 2197,
    savings: 2000,
    address: DEMO_ADDRESSES[2],
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'Paid',
    status: 'Delivered',
    trackingId: 'SNX78200115',
    courier: 'ShopNest Express',
    estimatedDelivery: '2026-09-17',
  },
  {
    id: 'SN-20260910-1005',
    date: '2026-09-10',
    items: [
      {
        id: 'ci-ord-7',
        product: DEMO_PRODUCTS[1], // Smart Watch
        variant: { color: 'Space Gray', size: '45mm' },
        quantity: 1,
        price: 8999,
        discountPrice: 5499,
        shippingCharge: 60,
      },
    ],
    subtotal: 5499,
    discount: 3500,
    shipping: 60,
    couponDiscount: 0,
    total: 5559,
    savings: 3500,
    address: DEMO_ADDRESSES[0],
    paymentMethod: 'Demo Online Payment',
    paymentStatus: 'Cash on Delivery',
    status: 'Cancelled',
    trackingId: 'SNX78119904',
    courier: 'ShopNest Express',
    estimatedDelivery: '2026-09-14',
  },
];

export const DEMO_USER: UserProfile = {
  id: 'u-user-1',
  name: 'Rahul Das',
  email: 'user@shopnest.demo',
  phone: '9876543210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
  role: 'user',
};

export const DEMO_ADMIN: UserProfile = {
  id: 'u-admin-1',
  name: 'ShopNest Administrator',
  email: 'admin@shopnest.demo',
  phone: '9876540000',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
  role: 'admin',
};

// ==========================================
// 3. REACTIVE IN-MEMORY STORE & STATE
// ==========================================

interface StoreState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  products: Product[];
  categories: CategoryItem[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  addresses: Address[];
  selectedAddressId: string;
  appliedCoupon: Coupon | null;
  orders: Order[];
  reviews: Review[];
  notifications: NotificationItem[];
  recentSearches: string[];
}

let storeState: StoreState = {
  user: null,
  isAuthenticated: false,
  products: DEMO_PRODUCTS,
  categories: DEMO_CATEGORIES,
  cart: [
    {
      id: 'cart-init-1',
      product: DEMO_PRODUCTS[0], // Headphones
      variant: { color: 'Midnight Black' },
      quantity: 1,
      price: 4999,
      discountPrice: 2999,
      shippingCharge: 50,
    },
    {
      id: 'cart-init-2',
      product: DEMO_PRODUCTS[6], // T-Shirt
      variant: { color: 'Olive Green', size: 'M' },
      quantity: 2,
      price: 1299,
      discountPrice: 699,
      shippingCharge: 30,
    },
  ],
  wishlist: [
    {
      id: 'w-init-1',
      product: DEMO_PRODUCTS[1], // Smart Watch
      variant: { color: 'Space Gray', size: '45mm' },
      price: 5499,
      addedAt: '2026-09-19',
    },
    {
      id: 'w-init-2',
      product: DEMO_PRODUCTS[5], // Running shoes
      variant: { color: 'Neon Crimson', size: 'UK 9' },
      price: 2799,
      addedAt: '2026-09-20',
    },
    {
      id: 'w-init-3',
      product: DEMO_PRODUCTS[8], // Leather backpack
      variant: { color: 'Cognac Tan' },
      price: 4299,
      addedAt: '2026-09-18',
    },
  ],
  addresses: DEMO_ADDRESSES,
  selectedAddressId: DEMO_ADDRESSES[0].id,
  appliedCoupon: null,
  orders: DEMO_ORDERS,
  reviews: DEMO_REVIEWS,
  notifications: DEMO_NOTIFICATIONS,
  recentSearches: ['Headphones', 'Smart Watch', 'Nike Shoes', 'Hoodie', 'Backpack'],
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function updateStore(updater: (prev: StoreState) => StoreState) {
  storeState = updater(storeState);
  emitChange();
}

function getSnapshot(): StoreState {
  return storeState;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ==========================================
// 4. CART CALCULATION LOGIC
// ==========================================

export function calculateCartTotals(cart: CartItem[], appliedCoupon: Coupon | null) {
  let totalItems = 0;
  let subtotal = 0;
  let totalOriginalPrice = 0;
  let totalShipping = 0;

  for (const item of cart) {
    totalItems += item.quantity;
    subtotal += item.discountPrice * item.quantity;
    totalOriginalPrice += item.price * item.quantity;
    totalShipping += item.shippingCharge * item.quantity;
  }

  const totalDiscount = totalOriginalPrice - subtotal;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrder) {
      if (appliedCoupon.discountType === 'percentage') {
        couponDiscount = (subtotal * appliedCoupon.discountValue) / 100;
      } else {
        couponDiscount = appliedCoupon.discountValue;
      }
    }
  }

  // Ensure coupon discount does not exceed subtotal
  if (couponDiscount > subtotal) {
    couponDiscount = subtotal;
  }

  const grandTotal = Math.max(0, subtotal + totalShipping - couponDiscount);
  const totalSavings = totalDiscount + couponDiscount;

  return {
    totalItems,
    subtotal,
    totalDiscount,
    totalShipping,
    couponDiscount,
    grandTotal,
    totalSavings,
  };
}

// ==========================================
// 5. REACT CUSTOM HOOK FOR SCREENS
// ==========================================

export function useShop() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Cart calculation
  const cartTotals = calculateCartTotals(state.cart, state.appliedCoupon);

  // Authentication Actions
  const login = (email: string, pass: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    // User login: 'user' / 'user' (also backward-compatible with demo email)
    if (
      (trimmedEmail === 'user' || trimmedEmail === 'user@shopnest.demo') &&
      (pass === 'user' || pass === '123456')
    ) {
      updateStore((prev) => ({
        ...prev,
        user: DEMO_USER,
        isAuthenticated: true,
      }));
      return { success: true, message: 'Welcome back, Rahul!' };
    }

    // Admin login: 'admin' / 'admin' (also backward-compatible with demo email)
    if (
      (trimmedEmail === 'admin' || trimmedEmail === 'admin@shopnest.demo') &&
      (pass === 'admin' || pass === 'admin123')
    ) {
      updateStore((prev) => ({
        ...prev,
        user: DEMO_ADMIN,
        isAuthenticated: true,
      }));
      return { success: true, message: 'Welcome Administrator!' };
    }

    return {
      success: false,
      message: 'Invalid credentials. Use "user" / "user" for customer or "admin" / "admin" for administrator.',
    };
  };

  const logout = () => {
    updateStore((prev) => ({
      ...prev,
      user: null,
      isAuthenticated: false,
    }));
  };

  const updateUserProfile = (name: string, email: string, phone: string, avatar?: string) => {
    updateStore((prev) => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          avatar: avatar || prev.user.avatar,
        },
      };
    });
  };

  // Cart Actions
  const addToCart = (
    product: Product,
    variant: { color?: string; size?: string } = {},
    quantity = 1
  ): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      return { success: false, message: 'Sorry, this product is currently out of stock!' };
    }

    let added = false;
    updateStore((prev) => {
      // Find if item with same variant already exists
      const existingIndex = prev.cart.findIndex(
        (ci) =>
          ci.product.id === product.id &&
          ci.variant.color === variant.color &&
          ci.variant.size === variant.size
      );

      if (existingIndex > -1) {
        const existingItem = prev.cart[existingIndex];
        const newQty = existingItem.quantity + quantity;
        if (newQty > product.stock) {
          added = false;
          return prev;
        }
        const updatedCart = [...prev.cart];
        updatedCart[existingIndex] = {
          ...existingItem,
          quantity: newQty,
        };
        added = true;
        return { ...prev, cart: updatedCart };
      }

      // Add new item
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product,
        variant,
        quantity: Math.min(quantity, product.stock),
        price: product.price,
        discountPrice: product.discountPrice,
        shippingCharge: product.shippingCharge,
      };
      added = true;
      return {
        ...prev,
        cart: [newItem, ...prev.cart],
      };
    });

    return added
      ? { success: true, message: `${product.name} added to cart!` }
      : { success: false, message: `Cannot add more than available stock (${product.stock}).` };
  };

  const updateCartQuantity = (cartItemId: string, delta: number): { success: boolean; message?: string } => {
    let result = { success: true, message: '' };
    updateStore((prev) => {
      const updated = prev.cart
        .map((ci) => {
          if (ci.id === cartItemId) {
            const nextQty = ci.quantity + delta;
            if (nextQty < 1) {
              result = { success: false, message: 'Quantity cannot be less than 1.' };
              return ci;
            }
            if (nextQty > ci.product.stock) {
              result = { success: false, message: `Maximum available stock is ${ci.product.stock}.` };
              return ci;
            }
            return { ...ci, quantity: nextQty };
          }
          return ci;
        })
        .filter(Boolean);
      return { ...prev, cart: updated };
    });
    return result;
  };

  const removeFromCart = (cartItemId: string) => {
    updateStore((prev) => ({
      ...prev,
      cart: prev.cart.filter((ci) => ci.id !== cartItemId),
    }));
  };

  const clearCart = () => {
    updateStore((prev) => ({
      ...prev,
      cart: [],
      appliedCoupon: null,
    }));
  };

  // Wishlist Actions
  const isInWishlist = (productId: string, variant?: { color?: string; size?: string }) => {
    return state.wishlist.some(
      (wi) =>
        wi.product.id === productId &&
        (!variant || (wi.variant.color === variant.color && wi.variant.size === variant.size))
    );
  };

  const toggleWishlist = (product: Product, variant: { color?: string; size?: string } = {}) => {
    let message = '';
    updateStore((prev) => {
      const existsIndex = prev.wishlist.findIndex(
        (wi) =>
          wi.product.id === product.id &&
          wi.variant.color === variant.color &&
          wi.variant.size === variant.size
      );

      if (existsIndex > -1) {
        message = 'Removed from wishlist';
        return {
          ...prev,
          wishlist: prev.wishlist.filter((_, idx) => idx !== existsIndex),
        };
      } else {
        message = 'Saved to wishlist';
        const newItem: WishlistItem = {
          id: `w-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          product,
          variant,
          price: product.discountPrice,
          addedAt: new Date().toISOString().split('T')[0],
        };
        return {
          ...prev,
          wishlist: [newItem, ...prev.wishlist],
        };
      }
    });
    return message;
  };

  const removeFromWishlist = (wishlistId: string) => {
    updateStore((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((wi) => wi.id !== wishlistId),
    }));
  };

  const removeSelectedWishlist = (selectedIds: string[]) => {
    updateStore((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((wi) => !selectedIds.includes(wi.id)),
    }));
  };

  const clearWishlist = () => {
    updateStore((prev) => ({
      ...prev,
      wishlist: [],
    }));
  };

  const moveWishlistToCart = (wishlistId: string) => {
    const item = state.wishlist.find((wi) => wi.id === wishlistId);
    if (!item) return;
    addToCart(item.product, item.variant, 1);
    removeFromWishlist(wishlistId);
  };

  const moveAllWishlistToCart = () => {
    state.wishlist.forEach((wi) => {
      addToCart(wi.product, wi.variant, 1);
    });
    clearWishlist();
  };

  // Coupon Actions
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = DEMO_COUPONS.find((c) => c.code === cleanCode);

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try WELCOME10 or SAVE200.' };
    }

    if (cartTotals.subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrder} required for ${cleanCode}.`,
      };
    }

    updateStore((prev) => ({
      ...prev,
      appliedCoupon: coupon,
    }));

    return {
      success: true,
      message: `Coupon ${cleanCode} applied! Saved extra on your order.`,
    };
  };

  const removeCoupon = () => {
    updateStore((prev) => ({
      ...prev,
      appliedCoupon: null,
    }));
  };

  // Address Actions
  const selectAddress = (addressId: string) => {
    updateStore((prev) => ({
      ...prev,
      selectedAddressId: addressId,
    }));
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      ...addr,
      isDefault: addr.isDefault || state.addresses.length === 0,
    };
    updateStore((prev) => {
      const updatedList = prev.addresses.map((a) =>
        newAddr.isDefault ? { ...a, isDefault: false } : a
      );
      return {
        ...prev,
        addresses: [newAddr, ...updatedList],
        selectedAddressId: newAddr.isDefault ? newAddr.id : prev.selectedAddressId,
      };
    });
  };

  const editAddress = (addressId: string, updatedData: Partial<Address>) => {
    updateStore((prev) => {
      const updated = prev.addresses.map((a) => {
        if (a.id === addressId) {
          return { ...a, ...updatedData };
        }
        if (updatedData.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });
      return { ...prev, addresses: updated };
    });
  };

  const deleteAddress = (addressId: string) => {
    updateStore((prev) => {
      const remaining = prev.addresses.filter((a) => a.id !== addressId);
      const newSelected =
        prev.selectedAddressId === addressId && remaining.length > 0
          ? remaining[0].id
          : prev.selectedAddressId;
      return {
        ...prev,
        addresses: remaining,
        selectedAddressId: newSelected,
      };
    });
  };

  const setDefaultAddress = (addressId: string) => {
    updateStore((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      })),
      selectedAddressId: addressId,
    }));
  };

  // Order Actions
  const createOrder = (paymentMethod: string, orderNotes?: string): Order => {
    const orderId = `SN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const trackingId = `SNX${Math.floor(10000000 + Math.random() * 90000000)}`;
    const currentAddress =
      state.addresses.find((a) => a.id === state.selectedAddressId) || state.addresses[0];

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: [...state.cart],
      subtotal: cartTotals.subtotal,
      discount: cartTotals.totalDiscount,
      shipping: cartTotals.totalShipping,
      couponDiscount: cartTotals.couponDiscount,
      couponCode: state.appliedCoupon?.code,
      total: cartTotals.grandTotal,
      savings: cartTotals.totalSavings,
      address: currentAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Cash on Delivery' : 'Paid',
      status: 'Processing',
      trackingId,
      courier: 'ShopNest Express',
      estimatedDelivery: '3 to 5 business days',
    };

    // Also add an automated confirmation notification
    const orderNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Order Placed Successfully! 📦',
      message: `Your order #${orderId} for ₹${newOrder.total.toLocaleString()} has been confirmed.`,
      type: 'order',
      createdAt: 'Just now',
      isRead: false,
      orderId,
    };

    updateStore((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      cart: [],
      appliedCoupon: null,
      notifications: [orderNotif, ...prev.notifications],
    }));

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    updateStore((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, status: 'Cancelled' as const } : o
      ),
    }));
  };

  // Review Actions
  const addReview = (
    productId: string,
    rating: number,
    title: string,
    comment: string
  ): Review => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      user: state.user?.name || 'Rahul Das',
      avatar: state.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      rating,
      title: title.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      status: 'approved',
    };

    updateStore((prev) => {
      // Re-calculate product ratings
      const updatedProducts = prev.products.map((p) => {
        if (p.id === productId) {
          const productReviews = [newRev, ...prev.reviews.filter((r) => r.productId === productId)];
          const avg =
            productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
          return {
            ...p,
            totalReviews: p.totalReviews + 1,
            averageRating: parseFloat(avg.toFixed(1)),
          };
        }
        return p;
      });

      return {
        ...prev,
        reviews: [newRev, ...prev.reviews],
        products: updatedProducts,
      };
    });

    return newRev;
  };

  const markReviewHelpful = (reviewId: string) => {
    updateStore((prev) => ({
      ...prev,
      reviews: prev.reviews.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      ),
    }));
  };

  // Notification Actions
  const markNotificationAsRead = (id: string) => {
    updateStore((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  };

  const markAllNotificationsAsRead = () => {
    updateStore((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  };

  const unreadNotificationCount = state.notifications.filter((n) => !n.isRead).length;

  // Search History Actions
  const addRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    updateStore((prev) => {
      const filtered = prev.recentSearches.filter(
        (s) => s.toLowerCase() !== clean.toLowerCase()
      );
      return {
        ...prev,
        recentSearches: [clean, ...filtered].slice(0, 8),
      };
    });
  };

  const clearRecentSearches = () => {
    updateStore((prev) => ({
      ...prev,
      recentSearches: [],
    }));
  };

  return {
    ...state,
    cartTotals,
    unreadNotificationCount,
    // Methods
    login,
    logout,
    updateUserProfile,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    removeSelectedWishlist,
    clearWishlist,
    moveWishlistToCart,
    moveAllWishlistToCart,
    applyCoupon,
    removeCoupon,
    selectAddress,
    addAddress,
    editAddress,
    deleteAddress,
    setDefaultAddress,
    createOrder,
    cancelOrder,
    addReview,
    markReviewHelpful,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addRecentSearch,
    clearRecentSearches,
  };
}

// ==========================================
// 6. DEFAULT EXPORT: STORE MANAGEMENT & DEMO HUB SCREEN
// ==========================================

export default function ShopStoreScreen() {
  const shop = useShop();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logoBadge}>ShopNest Engine</Text>
          <Text style={styles.title}>System State & Demo Hub</Text>
          <Text style={styles.subtitle}>
            Central reactive state & live counters across all 22+ TSX screens.
          </Text>
        </View>

        {/* Live Counters */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shop.products.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shop.cartTotals.totalItems}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shop.wishlist.length}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shop.orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* Quick Navigation Shortcuts */}
        <Text style={styles.sectionHeader}>Quick Screen Launcher</Text>
        <View style={styles.btnGrid}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/(user)/(tabs)')}
          >
            <Text style={styles.navBtnText}>🏠 Home (Tabs)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push({ pathname: '/(user)/(tabs)', params: { tab: 'categories' } })}
          >
            <Text style={styles.navBtnText}>📂 Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push({ pathname: '/(user)/(tabs)', params: { tab: 'cart' } })}
          >
            <Text style={styles.navBtnText}>🛒 Cart ({shop.cartTotals.totalItems})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push({ pathname: '/(user)/(tabs)', params: { tab: 'wishlist' } })}
          >
            <Text style={styles.navBtnText}>💖 Wishlist ({shop.wishlist.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/(user)/OrdersScreen')}
          >
            <Text style={styles.navBtnText}>📦 Orders ({shop.orders.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push({ pathname: '/(user)/(tabs)', params: { tab: 'profile' } })}
          >
            <Text style={styles.navBtnText}>👤 Profile ({shop.user?.name || 'Guest'})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/(admin)/(tabs)')}
          >
            <Text style={styles.navBtnText}>🛡️ Admin (Tabs)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/(auth)/LoginScreen')}
          >
            <Text style={styles.navBtnText}>🔐 Login Screen</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Current Session</Text>
          <Text style={styles.infoLine}>User: {shop.user?.name || 'Guest'}</Text>
          <Text style={styles.infoLine}>Email: {shop.user?.email || 'N/A'}</Text>
          <Text style={styles.infoLine}>Role: {shop.user?.role || 'N/A'}</Text>
          <Text style={styles.infoLine}>
            Unread Notifications: {shop.unreadNotificationCount}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7FA',
  },
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    marginBottom: 20,
  },
  logoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#5B4BFF',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#171717',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#5B4BFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#777777',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 12,
  },
  btnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  navBtn: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#171717',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 8,
  },
  infoLine: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 4,
  },
});
