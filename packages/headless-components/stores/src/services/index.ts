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


export const variantSelectorServiceDefinition = defineService<{
  // State
  productId: string;
  sku: string;
  basePrice: number;
  discountPrice?: number;
  isOnSale?: boolean;
  ribbonLabel?: string;
  options: Record<string, string[]>;
  selectedOptions: Record<string, string>;
  variants: Array<{
    id: string;
    label: string;
    stock: number;
    ribbon?: string;
    isPreOrder?: boolean;
  }>;
  selectedVariantId: string;
  quantityAvailable: number;

  // Getters
  selectedVariant: () => {
    id: string;
    label: string;
    stock: number;
    ribbon?: string;
    isPreOrder?: boolean;
  };
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;

  // Actions
  setOption: (group: string, value: string) => void;
  selectVariantById: (id: string) => void;
  loadProductVariants: (
    data: Array<{
      id: string;
      label: string;
      stock: number;
      ribbon?: string;
      isPreOrder?: boolean;
    }>
  ) => void;
  resetSelections: () => void;
}>("variantSelector");

export const productGalleryServiceDefinition = defineService<{
  // State
  images: string[];
  selectedImageIndex: number;
  variantImageMap: Record<string, number>;

  // Getters
  currentImage: () => string;
  variantMappedImage: (variantId: string) => string;

  // Actions
  setImageIndex: (index: number) => void;
  resetGallery: () => void;
  mapVariantToImage: (variantId: string, index: number) => void;
  loadImages: (images: string[]) => void;
}>("productGallery");

export const cartServiceDefinition = defineService<{
  // State
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
    isPreOrder?: boolean;
  }>;
  wishlist: Array<{
    productId: string;
    variantId: string;
  }>;

  // Getters
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
        isPreOrder?: boolean;
      }
    | undefined;

  // Actions
  addItem: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clearCart: () => void;
  buyNow: (productId: string, variantId: string, quantity: number) => void;
  toggleWishlist: (productId: string, variantId: string) => void;
}>("cart");
