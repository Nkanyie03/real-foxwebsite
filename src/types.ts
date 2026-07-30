export type Category = 'All' | 'Hoodies' | 'Jackets' | 'Caps & Headwear' | 'T-Shirts' | 'Pants';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
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
