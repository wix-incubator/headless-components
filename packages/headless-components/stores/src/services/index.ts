import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import { getCheckoutUrlForProduct } from "../utils";

export const buynowserviceDefinition = defineService<{
  redirectToCheckout: () => Promise<void>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
}>("buynow");

export const buynowService = implementService.withConfig<{
  productId: string;
  variantId: string;
}>()(buynowserviceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const loadingSignal = signalsService.signal(false) as Signal<boolean>;
  const errorSignal = signalsService.signal<string | null>(null) as Signal<
    string | null
  >;

  return {
    redirectToCheckout: async () => {
      loadingSignal.set(true);
      try {
        const checkoutUrl = await getCheckoutUrlForProduct(
          config.productId,
          config.variantId
        );
        window.location.href = checkoutUrl;
      } catch (error) {
        errorSignal.set(error as string);
      } finally {
        loadingSignal.set(false);
      }
    },
    loading: loadingSignal,
    error: errorSignal,
  };
});

// VariantSelectorService
// 🧠 Purpose: Handles the entire product configuration and selection flow.
// Enables users to select from available options (e.g., size, color), resolve the appropriate variant, and retrieve associated data such as SKU, price, availability, ribbons, and stock level.
// Supports pre-order state logic and calculates dynamic pricing based on variant and discount status.
// Core to enabling all other product-related behaviors on the page — gallery, cart, stock messages, and price display rely on this selection state.
// 📄 Covers the following logic from the spec sheet:
// - Product Options (Must): stored in `options`, selected via `setOption`, tracked in `selectedOptions`
// - Product Variants (Must): available in `variants`, selected via `selectedVariantId` and `selectVariantById`, accessed using `selectedVariant()`
// - Product discount (High): calculated via `basePrice`, `discountPrice`, `isOnSale`, and derived `finalPrice()`
// - SKU (Mid): managed in `sku`
// - Ribbons (Low): exposed via `ribbonLabel` and also `selectedVariant().ribbon`
// - Low stock message (Low): derived from `selectedVariant().stock` using `isLowStock()`
// - Pre-order logic (Mid): indicated by `selectedVariant().isPreOrder`
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
  selectedOptions: Signal<Record<string, string>>;
  selectedVariantId: Signal<string>;
  variants: Signal<
    {
      id: string;
      label: string;
      stock: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  >;
  options: Signal<Record<string, string[]>>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  quantityAvailable: Signal<number>;
  productId: Signal<string>;
  sku: Signal<string>;
  ribbonLabel: Signal<string | null>;

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
// 🧠 Purpose: Manages dynamic image gallery behavior, including syncing selected product variant with specific images and allowing user-driven image navigation.
// Enables image selection either manually or programmatically based on variant selection.
// Maintains state of currently displayed image and allows fine-grained control over how variants are visually represented.
// 📄 Covers the following logic from the spec sheet:
// - Image Gallery (High): stored in `images`, selected with `setImageIndex()`, reset with `resetGallery()`
// - Main Product Image (Must): resolved using `currentImage()`
// - Variant display rules (Mid): mapped via `variantImageMap`, resolved via `variantMappedImage()`
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
  loadImages: (images: string[]) => void;
  setImageIndex: (index: number) => void;
  resetGallery: () => void;
  mapVariantToImage: (variantId: string, index: number) => void;
}>("productGallery");

// CurrentCartService
// 🧠 Purpose: Handles all cart interactions — including item state, quantity management, wishlist toggling, and immediate checkout.
// Tracks pre-order flags and provides derived totals to reflect cart state globally.
// Supports both persistent wishlist behavior and rapid purchasing flows like Buy Now.
// 📄 Covers the following logic from the spec sheet:
// - Action Buttons (Must): performed via `addItem()` and `buyNow()`
// - Quantity (High): stored per item in `items[].quantity`
// - Pre-order logic (Mid): flagged in `items[].isPreOrder`
// - Wishlist (Mid): handled using `wishlist`, `toggleWishlist()`
// - Cart icon summary (Low): shown using `totalQuantity()` and `itemCount()`
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
  buyNow: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, variantId: string) => void;
}>("currentCart");

// ❌ Not Covered (out of scope for headless state logic):
// - Related Products (High) → should be handled by ProductContext or external fetch
// - Navigation (Mid) → should be handled by routing/navigation context
// - Custom Text (promotional) (Low) → CMS or layout-bound concern
// - Currency Converter (High) → external pricing or currency service
// - Reviews & Ratings (High) → requires async data and dedicated review service
// - Modifiers (Mid) → may require dedicated ModifiersService
// - Category (Low) → layout-bound or metadata-driven
// - Additional Info (Low) → typically CMS or static layout section
// - and stock availability. (uncategorized/likely duplicate)
// - price (uncategorized/likely duplicate)

// 🚫 Missing Widget Elements:
// - Related Products
// - Previous/Next Product Navigation
// - Promotional Banner
// - Currency Converter
// - Reviews Section
// - Modifier
// - Category
// - Additional Info
// - Product Variants (duplicated entry)

// --- VariantSelectorService (stub) ---
export const variantSelectorService = implementService.withConfig<{
  productId: string;
}>()(variantSelectorServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  // Use correct types for signals and return a valid variant object
  const selectedOptions = signalsService.signal({}) as Signal<
    Record<string, string>
  >;
  const selectedVariantId = signalsService.signal("") as Signal<string>;
  const variants = signalsService.signal<
    {
      id: string;
      label: string;
      stock: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  >([]);
  const options = signalsService.signal({}) as Signal<Record<string, string[]>>;
  const basePrice = signalsService.signal(0) as Signal<number>;
  const discountPrice = signalsService.signal(null) as Signal<number | null>;
  const isOnSale = signalsService.signal(false) as Signal<boolean | null>;
  const quantityAvailable = signalsService.signal(0) as Signal<number>;
  const productId = signalsService.signal(config.productId) as Signal<string>;
  const sku = signalsService.signal("") as Signal<string>;
  const ribbonLabel = signalsService.signal(null) as Signal<string | null>;
  // Return a valid variant object for selectedVariant
  const defaultVariant = {
    id: "",
    label: "",
    stock: 0,
    ribbon: null,
    isPreOrder: null,
  };
  return {
    selectedOptions,
    selectedVariantId,
    variants,
    options,
    basePrice,
    discountPrice,
    isOnSale,
    quantityAvailable,
    productId,
    sku,
    ribbonLabel,
    selectedVariant: () => defaultVariant,
    finalPrice: () => 0,
    isLowStock: () => false,
    setOption: () => {},
    selectVariantById: () => {},
    loadProductVariants: () => {},
    resetSelections: () => {},
  };
});

// --- ProductGalleryService (stub) ---
export const productGalleryService = implementService.withConfig<{
  productId: string;
}>()(productGalleryServiceDefinition, ({ getService }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const images = signalsService.signal<string[]>([]);
  const selectedImageIndex = signalsService.signal(0) as Signal<number>;
  const variantImageMap = signalsService.signal<Record<string, number>>({});
  return {
    images,
    selectedImageIndex,
    variantImageMap,
    currentImage: () => "",
    variantMappedImage: () => "",
    loadImages: () => {},
    setImageIndex: () => {},
    resetGallery: () => {},
    mapVariantToImage: () => {},
  };
});

// --- CurrentCartService (stub) ---
export const currentCartService = implementService.withConfig<{
  userId?: string;
}>()(currentCartServiceDefinition, ({ getService }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const items = signalsService.signal<
    {
      productId: string;
      variantId: string;
      quantity: number;
      isPreOrder: boolean | null;
    }[]
  >([]);
  const wishlist = signalsService.signal<
    { productId: string; variantId: string }[]
  >([]);
  return {
    items,
    wishlist,
    totalQuantity: () => 0,
    itemCount: () => 0,
    getItem: () => undefined,
    addItem: () => {},
    buyNow: () => {},
    removeItem: () => {},
    clearCart: () => {},
    toggleWishlist: () => {},
  };
});
