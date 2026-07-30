import { Product } from '../types';
import blueHoodieImg from '../assets/images/real_fox_blue_hoodie_1785432660354.jpg';
import blackHoodieImg from '../assets/images/real_fox_black_hoodie_1785432673748.jpg';
import streetModelImg from '../assets/images/real_fox_street_model_1785432688731.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'rf-001',
    sku: 'RF-HD-001',
    name: 'Real Fox Classic Blue Hoodie',
    category: 'Hoodies',
    price: 85.00,
    costPrice: 38.00,
    originalPrice: 105.00,
    stockQuantity: 24,
    image: blueHoodieImg,
    colors: [
      { name: 'Royal Blue', hex: '#1E60D5' },
      { name: 'Stealth Black', hex: '#111111' },
      { name: 'Heather Gray', hex: '#999999' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'The iconic Real Fox heavy-cotton streetwear pullover hoodie in signature royal blue. Crafted with 450GSM organic French terry cotton for superior warmth and structured drop-shoulder fit.',
    details: [
      '100% Heavyweight French Terry Cotton (450 GSM)',
      'High-density raised print logo across chest',
      'Double-lined hood with custom metal aglet drawstrings',
      'Ribbed cuffs and waistband for structural shape retention',
      'Pre-shrunk finish'
    ],
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 128,
    inStock: true
  },
  {
    id: 'rf-002',
    sku: 'RF-HD-002',
    name: 'Real Fox Script Stealth Black Hoodie',
    category: 'Hoodies',
    price: 88.00,
    costPrice: 40.00,
    stockQuantity: 4,
    image: blackHoodieImg,
    colors: [
      { name: 'Stealth Black', hex: '#111111' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Royal Blue', hex: '#1E60D5' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Minimalist stealth aesthetic meets urban street style. Features the hand-scripted Real Fox logo on a plush, relaxed-fit blackout pullover.',
    details: [
      '480 GSM ultra-dense heavyweight fleece',
      'Embroidered white script logo across chest',
      'Hidden interior stash pocket inside pouch',
      'Reinforced double-stitched seams throughout'
    ],
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 94,
    inStock: true
  },
  {
    id: 'rf-003',
    sku: 'RF-JK-003',
    name: 'Real Fox Tactical Bomber & Cap Combo',
    category: 'Jackets',
    price: 145.00,
    costPrice: 65.00,
    originalPrice: 175.00,
    stockQuantity: 12,
    image: streetModelImg,
    colors: [
      { name: 'Matte Black', hex: '#18181B' },
      { name: 'Olive Tactical', hex: '#3F4E3A' }
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    description: 'Engineered for chilly urban nights. High-density water-resistant nylon jacket featuring branded sleeve typography and matching Real Fox low-profile cap.',
    details: [
      'Water-repellent nylon shell with satin thermal lining',
      'Custom Real Fox printed sleeve typography',
      'Utility sleeve zip pocket and dual hand pockets',
      'Includes structured 6-panel embroidered baseball cap'
    ],
    isNewArrival: true,
    isBestSeller: false,
    rating: 5.0,
    reviewsCount: 42,
    inStock: true
  },
  {
    id: 'rf-004',
    sku: 'RF-HW-004',
    name: 'Real Fox Minimalist Embroidered Beanie',
    category: 'Caps & Headwear',
    price: 32.00,
    costPrice: 10.00,
    stockQuantity: 30,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Royal Blue', hex: '#1E60D5' },
      { name: 'Charcoal', hex: '#444444' }
    ],
    sizes: ['One Size'],
    description: 'Ribbed knit beanie with signature Real Fox micro-patch embroidery. Warm, stretchable, and designed for tight roll styling.',
    details: [
      '100% Soft acrylic fine rib knit',
      'Woven Real Fox emblem patch on front fold',
      'Fitted cuff design for thermal insulation'
    ],
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.7,
    reviewsCount: 67,
    inStock: true
  },
  {
    id: 'rf-005',
    sku: 'RF-TS-005',
    name: 'Real Fox Heavyweight Oversized Graphic Tee',
    category: 'T-Shirts',
    price: 45.00,
    costPrice: 18.00,
    originalPrice: 55.00,
    stockQuantity: 18,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Vintage Black', hex: '#262626' },
      { name: 'Off White', hex: '#F3F4F6' },
      { name: 'Cobalt Blue', hex: '#1D4ED8' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Boxy, oversized silhouette cut from 280GSM combed cotton. Features screenprinted Real Fox geometric artwork on back.',
    details: [
      '280 GSM 100% Combed ring-spun cotton',
      'Drop shoulder vintage streetwear silhouette',
      'Distressed screen-printed logo graphic',
      'Ribbed collar that holds shape after washing'
    ],
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.9,
    reviewsCount: 51,
    inStock: true
  },
  {
    id: 'rf-006',
    sku: 'RF-PT-006',
    name: 'Real Fox Urban Camo Cargo Pants',
    category: 'Pants',
    price: 110.00,
    costPrice: 48.00,
    stockQuantity: 0,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Urban Camo', hex: '#4B5563' },
      { name: 'Stealth Black', hex: '#111111' }
    ],
    sizes: ['30', '32', '34', '36'],
    description: 'Multi-pocket tactical cargo trousers made from durable cotton ripstop canvas. Features adjustable ankle toggles and branded strap details.',
    details: [
      'Cotton ripstop fabric for heavy-duty wear',
      '6 storage utility pockets with snap buttons',
      'Adjustable drawstrings at waist and hem',
      'Subtle Real Fox tonal patch on side cargo flap'
    ],
    isNewArrival: false,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 88,
    inStock: false
  },
  {
    id: 'rf-007',
    sku: 'RF-HW-007',
    name: 'Real Fox Geometric Snapback Cap',
    category: 'Caps & Headwear',
    price: 38.00,
    costPrice: 14.00,
    stockQuantity: 15,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Black / Blue', hex: '#111111' },
      { name: 'All Black', hex: '#000000' }
    ],
    sizes: ['One Size'],
    description: 'Structured 6-panel snapback hat featuring 3D embroidered geometric Real Fox silhouette logo in vibrant electric blue.',
    details: [
      'Premium wool blend construction',
      'High density 3D embroidery emblem',
      'Adjustable snap closure for custom fit',
      'Branded interior taped seams'
    ],
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.6,
    reviewsCount: 39,
    inStock: true
  },
  {
    id: 'rf-008',
    sku: 'RF-JK-008',
    name: 'Real Fox Trackside Waterproof Windbreaker',
    category: 'Jackets',
    price: 135.00,
    costPrice: 55.00,
    originalPrice: 160.00,
    stockQuantity: 8,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    colors: [
      { name: 'Electric Blue / Black', hex: '#1E60D5' },
      { name: 'All Black', hex: '#111111' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Lightweight weather-proof track jacket with bold color-blocking, reflective Real Fox prints, and mesh breathable lining.',
    details: [
      '100% Ripstop waterproof shell',
      '3M Reflective Real Fox sleeve lettering',
      'Packable hood into collar',
      'Custom matte black hardware zippers'
    ],
    isNewArrival: false,
    isBestSeller: false,
    rating: 4.9,
    reviewsCount: 29,
    inStock: true
  }
];
