import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

// VariantSelectorStore
// 🔗 Covers:
// - Product Options: via `options`, `setOption`, `selectedOptions`
// - Product Variants: via `variants`, `selectVariantById`, `selectedVariant`
// - Product discount: via `finalPrice`, `discountPrice`, `isOnSale`
// - SKU: via `sku`
// - Ribbons: via `ribbonLabel` and `variant.ribbon`
// - Low stock message: via `isLowStock()`
// - Pre-order logic: via `variant.isPreOrder`
export interface VariantSelectorStore {
  productId: string;
  sku: string;
  basePrice: number;
  discountPrice?: number;
  isOnSale?: boolean;
  ribbonLabel?: string;
  options: Record<string, string[]>;
  selectedOptions: Record<string, string>;
  variants: {
    id: string;
    label: string;
    stock: number;
    ribbon?: string;
    isPreOrder?: boolean;
  }[];
  selectedVariantId: string;
  quantityAvailable: number;

  selectedVariant: () => VariantSelectorStore["variants"][0];
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;

  setOption: (group: string, value: string) => void;
  selectVariantById: (id: string) => void;
  loadProductVariants: (data: VariantSelectorStore["variants"]) => void;
  resetSelections: () => void;
}

// ProductGalleryStore
// 🔗 Covers:
// - Main Product Image: via `currentImage()`
// - Image Gallery: via `images`, `selectedImageIndex`, `loadImages()`
// - Variant display rules: handled via `variantImageMap` and `variantMappedImage()`
export interface ProductGalleryStore {
  images: string[];
  selectedImageIndex: number;
  variantImageMap: Record<string, number>;

  currentImage: () => string;
  variantMappedImage: (variantId: string) => string;

  setImageIndex: (index: number) => void;
  resetGallery: () => void;
  mapVariantToImage: (variantId: string, index: number) => void;
  loadImages: (images: string[]) => void;
}

// CurrentCartStore
// 🔗 Covers:
// - Action Buttons: 'Add to Cart' and 'Buy Now' → `addItem()`, `buyNow()`
// - Quantity: tracked in each cart item → `quantity`
// - Pre-order logic: via `isPreOrder` in `items[]`
// - Wishlist: via `wishlist`, `toggleWishlist()`
// - Cart icon summary: via `totalQuantity()`, `itemCount()`
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  isPreOrder?: boolean;
}

export interface CurrentCartStore {
  items: CartItem[];
  wishlist: { productId: string; variantId: string }[];

  totalQuantity: () => number;
  itemCount: () => number;
  getItem: (productId: string, variantId: string) => CartItem | undefined;

  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  buyNow: (productId: string, variantId: string, quantity: number) => void;
  toggleWishlist: (productId: string, variantId: string) => void;
}

// ❌ External logic not covered by these services:
// - Navigation (prev/next product): should be handled via router or page-level service
// - Custom text (e.g., promotional banner): usually CMS or layout-specific state
// - Currency converter: should be implemented as a pricing/currency context service
// - Reviews & Ratings: typically requires async data and its own ReviewsStore
// - Related Products: fetched externally or provided via ProductProvider context
