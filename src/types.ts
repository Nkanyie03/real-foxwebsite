export type Category = 'All' | 'Hoodies' | 'Jackets' | 'Caps & Headwear' | 'T-Shirts' | 'Pants';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: Category;
  price: number;
  costPrice?: number;
  originalPrice?: number;
  stockQuantity: number;
  image: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  details: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface FilterState {
  category: Category;
  searchQuery: string;
  maxPrice: number;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating';
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  timestamp?: number;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping?: number;
  discount?: number;
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  status: 'Completed' | 'Processing' | 'Refunded';
}

export interface StoreSettings {
  storeName: string;
  currencySymbol: string;
  taxRate: number; // e.g. 8 for 8%
  lowStockThreshold: number; // e.g. 5
  ownerPin: string;
  isPinRequired: boolean;
}

