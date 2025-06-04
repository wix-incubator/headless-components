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
import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

export const variantSelectorServiceDefinition = defineService<{
  selectedOptions: Signal<Record<string, string>>;
  selectedVariantId: Signal<string>;
  variants: Signal<
    {
      id: string;
      attributes: Record<string, string>;
      stock: number;
      price: number;
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
  selectedVariant: () => {
    id: string;
    attributes: Record<string, string>;
    stock: number;
    price: number;
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
      attributes: Record<string, string>;
      stock: number;
      price: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  ) => void;
  resetSelections: () => void;
}>("variantSelector");

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
      attributes: Record<string, string>;
      stock: number;
      price: number;
      ribbon: string | null;
      isPreOrder: boolean | null;
    }[]
  >([
    {
      id: "v1",
      attributes: { color: "blue", size: "S" },
      stock: 10,
      price: 100,
      ribbon: null,
      isPreOrder: false,
    },
    {
      id: "v2",
      attributes: { color: "red", size: "M" },
      stock: 5,
      price: 110,
      ribbon: "Sale",
      isPreOrder: false,
    },
    {
      id: "v3",
      attributes: { color: "blue", size: "L" },
      stock: 0,
      price: 120,
      ribbon: null,
      isPreOrder: true,
    },
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
    return {
      id: "",
      attributes: {},
      stock: 0,
      price: 0,
      ribbon: null,
      isPreOrder: null,
    };
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
      const match = variants
        .get()
        .find((v) =>
          Object.entries(newOptions).every(
            ([key, val]) => v.attributes[key] === val
          )
        );
      if (match) selectedVariantId.set(match.id);
    },
    selectVariantById: (id) => selectedVariantId.set(id),
    loadProductVariants: (data) => variants.set(data),
    resetSelections: () => {
      selectedOptions.set({ color: "blue", size: "S" });
      selectedVariantId.set("v1");
    },
  };
});
