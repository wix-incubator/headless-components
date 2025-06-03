import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import { getCheckoutUrlForProduct } from "../utils";
import {
  variantSelectorServiceDefinition,
  productGalleryServiceDefinition,
  currentCartServiceDefinition,
} from "./new";

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

export * from "./new";

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
