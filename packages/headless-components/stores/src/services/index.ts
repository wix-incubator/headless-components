import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

export const buynowserviceDefinition = defineService<{
  redirectToCheckout: () => Promise<void>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
}>("buynow");

export const buynowService = implementService.withConfig<{
  productId: string;
  variantId: string;
}>()(buynowserviceDefinition, ({ getService }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const loadingSignal = signalsService.signal(false) as Signal<boolean>;
  const errorSignal = signalsService.signal<string | null>(null) as Signal<
    string | null
  >;

  // Mock checkout and redirect logic

  return {
    redirectToCheckout: async () => {
      loadingSignal.set(true);
      try {
        // Mock checkout creation
        const checkoutResult = { _id: "test-checkout-id" };
        if (!checkoutResult._id) {
          throw new Error("Failed to create checkout");
        }
        // Mock redirect session creation
        const redirectSession = { fullUrl: "http://mocked-redirect-url.com" };
        window.location.href = redirectSession.fullUrl;
      } catch (error: any) {
        errorSignal.set(error?.message || String(error));
        throw error;
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

// --- VariantSelectorService (minimal working logic, type-correct) ---
export const variantSelectorService = implementService.withConfig<{
  productId: string;
}>()(variantSelectorServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const options = signalsService.signal<Record<string, string[]>>({
    color: ["blue", "red"],
    size: ["S", "M", "L"],
  });
  const variants = signalsService.signal<
    {
      id: string;
      label: string;
      stock: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  >([
    { id: "v1", label: "Blue S", stock: 10, ribbon: null, isPreOrder: false },
    { id: "v2", label: "Red M", stock: 5, ribbon: "Sale", isPreOrder: false },
    { id: "v3", label: "Blue L", stock: 0, ribbon: null, isPreOrder: true },
  ]);
  const selectedOptions = signalsService.signal<Record<string, string>>({
    color: "blue",
    size: "S",
  });
  const selectedVariantId = signalsService.signal<string>("v1");
  const basePrice = signalsService.signal<number>(100);
  const discountPrice = signalsService.signal<number | null>(80);
  const isOnSale = signalsService.signal<boolean | null>(true);
  const quantityAvailable = signalsService.signal<number>(10);
  const productId = signalsService.signal<string>(config.productId);
  const sku = signalsService.signal<string>("SKU123");
  const ribbonLabel = signalsService.signal<string | null>("Sale");
  const selectedVariant = () => {
    const found = variants.get().find((v) => v.id === selectedVariantId.get());
    if (found) return found;
    // fallback: return a default variant object
    return { id: "", label: "", stock: 0, ribbon: null, isPreOrder: null };
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
    selectedVariant,
    finalPrice: () => discountPrice.get() || basePrice.get(),
    isLowStock: (threshold = 5) => selectedVariant().stock <= threshold,
    setOption: (group, value) => {
      const newOptions = { ...selectedOptions.get(), [group]: value };
      selectedOptions.set(newOptions);
    },
    selectVariantById: (id) => selectedVariantId.set(id),
    loadProductVariants: (data) => variants.set(data),
    resetSelections: () => {
      selectedOptions.set({ color: "blue", size: "S" });
      selectedVariantId.set("v1");
    },
  };
});

// --- ProductGalleryService (minimal working logic, type-correct) ---
export const productGalleryService = implementService.withConfig<{
  productId: string;
}>()(productGalleryServiceDefinition, ({ getService }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const images = signalsService.signal<string[]>([
    "https://dummyimage.com/600x400/000/fff&text=Blue+S",
    "https://dummyimage.com/600x400/ff0000/fff&text=Red+M",
    "https://dummyimage.com/600x400/0000ff/fff&text=Blue+L",
  ]);
  const selectedImageIndex = signalsService.signal<number>(0);
  const variantImageMap = signalsService.signal<Record<string, number>>({
    v1: 0,
    v2: 1,
    v3: 2,
  });
  return {
    images,
    selectedImageIndex,
    variantImageMap,
    currentImage: () => images.get()[selectedImageIndex.get()] || "",
    variantMappedImage: (variantId) => {
      const map = variantImageMap.get();
      const idx = map[variantId as keyof typeof map];
      return typeof idx === "number" ? images.get()[idx] || "" : "";
    },
    loadImages: (imgs) => images.set(imgs),
    setImageIndex: (index) => selectedImageIndex.set(index),
    resetGallery: () => selectedImageIndex.set(0),
    mapVariantToImage: (variantId, index) =>
      variantImageMap.set({ ...variantImageMap.get(), [variantId]: index }),
  };
});

// --- CurrentCartService (minimal working logic, type-correct) ---
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
    totalQuantity: () =>
      items.get().reduce((sum, item) => sum + item.quantity, 0),
    itemCount: () => items.get().length,
    getItem: (productId, variantId) =>
      items
        .get()
        .find(
          (item) => item.productId === productId && item.variantId === variantId
        ),
    addItem: (productId, variantId, quantity) => {
      const current = items.get();
      const idx = current.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (idx !== -1) {
        const updated = [...current];
        updated[idx] = {
          productId: updated[idx]!.productId,
          variantId: updated[idx]!.variantId,
          quantity: updated[idx]!.quantity + quantity,
          isPreOrder: updated[idx]!.isPreOrder ?? false,
        };
        items.set(updated);
      } else {
        items.set([
          ...current,
          { productId, variantId, quantity, isPreOrder: false },
        ]);
      }
    },
    buyNow: (productId, variantId, quantity) =>
      items.set([{ productId, variantId, quantity, isPreOrder: false }]),
    removeItem: (productId, variantId) =>
      items.set(
        items
          .get()
          .filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          )
      ),
    clearCart: () => items.set([]),
    toggleWishlist: (productId, variantId) => {
      const current = wishlist.get();
      const idx = current.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (idx !== -1)
        wishlist.set(
          current.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          )
        );
      else wishlist.set([...current, { productId, variantId }]);
    },
  };
});
