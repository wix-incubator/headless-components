// Signal-based service definitions with detailed logic and widget coverage from spec sheet
import { defineService, Signal } from "@wix/services-definitions";

// VariantSelectorService
// 📄 Covers the following logic from the spec sheet:
// - Product Options: stored in `options`, selected via `setOption`, tracked in `selectedOptions`
// - Product Variants: available in `variants`, current one selected via `selectedVariantId` and `selectVariantById`, accessed using `selectedVariant()`
// - Product discount: calculated using `basePrice`, `discountPrice`, `isOnSale`, and derived `finalPrice()`
// - SKU: managed in `sku`
// - Ribbons: exposed via `ribbonLabel` and also `selectedVariant().ribbon`
// - Low stock message: derived from `selectedVariant().stock` using `isLowStock()`
// - Pre-order logic: indicated by `selectedVariant().isPreOrder`
// 🧩 Covers the following widget elements:
// - Product Options
// - Product Variants
// - Price
// - SKU
// - Ribbon
// - Discount
// - Low Stock Message
export const variantSelectorServiceDefinition = defineService<{
  // --- State ---
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

  // --- Getters ---
  selectedVariant: () => {
    id: string;
    label: string;
    stock: number;
    ribbon: string | null;
    isPreOrder: boolean | null;
  };
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;

  // --- Actions ---
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
// 📄 Covers the following logic from the spec sheet:
// - Image Gallery: stored in `images`, selected with `setImageIndex()`, reset with `resetGallery()`
// - Main Product Image: resolved using `currentImage()`
// - Variant display rules: mapped via `variantImageMap`, resolved via `variantMappedImage()`
// 🧩 Covers the following widget elements:
// - Main Product Image
// - Image Gallery
export const productGalleryServiceDefinition = defineService<{
  // --- State ---
  images: Signal<string[]>;
  selectedImageIndex: Signal<number>;
  variantImageMap: Signal<Record<string, number>>;

  // --- Getters ---
  currentImage: () => string;
  variantMappedImage: (variantId: string) => string;

  // --- Actions ---
  setImageIndex: (index: number) => void;
  resetGallery: () => void;
  mapVariantToImage: (variantId: string, index: number) => void;
  loadImages: (images: string[]) => void;
}>("productGallery");

// CurrentCartService
// 📄 Covers the following logic from the spec sheet:
// - Action Buttons: performed via `addItem()` and `buyNow()`
// - Quantity: stored per item in `items[].quantity`
// - Pre-order logic: flagged in `items[].isPreOrder`
// - Wishlist: handled using `wishlist`, `toggleWishlist()`
// - Cart icon summary: shown using `totalQuantity()` and `itemCount()`
// 🧩 Covers the following widget elements:
// - Action Buttons
// - Quantity
// - Pre-order
// - Wishlist
// - Cart Icon
export const currentCartServiceDefinition = defineService<{
  // --- State ---
  items: Signal<
    {
      productId: string;
      variantId: string;
      quantity: number;
      isPreOrder: boolean | null;
    }[]
  >;
  wishlist: Signal<{ productId: string; variantId: string }[]>;

  // --- Getters ---
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

  // --- Actions ---
  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  buyNow: (productId: string, variantId: string, quantity: number) => void;
  toggleWishlist: (productId: string, variantId: string) => void;
}>("currentCart");

// ❌ Not Covered (out of scope for headless state logic):
// - Related Products → should be handled by ProductContext or external fetch
// - Navigation (prev/next) → should be handled by routing/navigation context
// - Custom Text (promotional) → CMS or layout-bound concern
// - Currency Converter → external pricing or currency service
// - Reviews & Ratings → requires async data and dedicated review service
// 🚫 Missing Widget Elements:
// - Related Products
// - Previous/Next Product Navigation
// - Promotional Banner
// - Currency Switcher
// - Reviews Section
