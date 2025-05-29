import { defineService, Signal } from "@wix/services-definitions";

// VariantSelectorService
// 🔗 Covers:
// - Product Options: via `options`, `setOption`, `selectedOptions`
// - Product Variants: via `variants`, `selectVariantById`, `selectedVariant`
// - Product discount: via `finalPrice`, `discountPrice`, `isOnSale`
// - SKU: via `sku`
// - Ribbons: via `ribbonLabel` and `variant.ribbon`
// - Low stock message: via `isLowStock()`
// - Pre-order logic: via `variant.isPreOrder`
export const variantSelectorServiceDefinition = defineService<{
  productId: Signal<string>;
  sku: Signal<string>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  ribbonLabel: Signal<string | null>;
  options: Signal<Record<string, string[]>>;
  selectedOptions: Signal<Record<string, string>>;
  variants: Signal<
    {
      id: string;
      label: string;
      stock: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  >;
  selectedVariantId: Signal<string>;
  quantityAvailable: Signal<number>;

  selectedVariant: () => {
    id: string;
    label: string;
    stock: number;
    ribbon: string | null;
    isPreOrder: boolean | null;
  };
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;

  setOption: (group: string, value: string) => void;
  selectVariantById: (id: string) => void;
  loadProductVariants: (
    data: {
      id: string;
      label: string;
      stock: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  ) => void;
  resetSelections: () => void;
}>("variantSelector");

// ProductGalleryService
// 🔗 Covers:
// - Main Product Image: via `currentImage()`
// - Image Gallery: via `images`, `selectedImageIndex`, `loadImages()`
// - Variant display rules: handled via `variantImageMap` and `variantMappedImage()`
export const productGalleryServiceDefinition = defineService<{
  images: Signal<string[]>;
  selectedImageIndex: Signal<number>;
  variantImageMap: Signal<Record<string, number>>;

  currentImage: () => string;
  variantMappedImage: (variantId: string) => string;

  setImageIndex: (index: number) => void;
  resetGallery: () => void;
  mapVariantToImage: (variantId: string, index: number) => void;
  loadImages: (images: string[]) => void;
}>("productGallery");

// CurrentCartService
// 🔗 Covers:
// - Action Buttons: 'Add to Cart' and 'Buy Now' → `addItem()`, `buyNow()`
// - Quantity: tracked in each cart item → `quantity`
// - Pre-order logic: via `isPreOrder` in `items[]`
// - Wishlist: via `wishlist`, `toggleWishlist()`
// - Cart icon summary: via `totalQuantity()`, `itemCount()`
export const currentCartServiceDefinition = defineService<{
  items: Signal<
    {
      productId: string;
      variantId: string;
      quantity: number;
      isPreOrder: boolean | null;
    }[]
  >;
  wishlist: Signal<{ productId: string; variantId: string }[]>;

  totalQuantity: () => number;
  itemCount: () => number;
  getItem: (
    productId: string,
    variantId: string
  ) =>
    | {
        productId: string;
        variantId: string;
        quantity: number;
        isPreOrder: boolean | null;
      }
    | undefined;

  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  buyNow: (productId: string, variantId: string, quantity: number) => void;
  toggleWishlist: (productId: string, variantId: string) => void;
}>("currentCart");

// ❌ External logic not covered by these services:
// - Navigation (prev/next product): should be handled via router or page-level service
// - Custom text (e.g., promotional banner): usually CMS or layout-specific state
// - Currency converter: should be implemented as a pricing/currency context service
// - Reviews & Ratings: typically requires async data and its own ReviewsStore
// - Related Products: fetched externally or provided via ProductProvider context
