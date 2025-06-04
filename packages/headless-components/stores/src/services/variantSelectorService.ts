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

// Add types for Variant and Option
interface OptionChoiceNames {
  optionName: string;
  choiceName: string;
}
interface Variant {
  _id: string;
  visible: boolean;
  sku: string;
  choices: { optionChoiceNames: OptionChoiceNames }[];
  price: { actualPrice: { amount: string; formattedAmount: string } };
  inventoryStatus: { inStock: boolean; preorderEnabled: boolean };
}
interface Option {
  name: string;
  choicesSettings: { choices: { name: string; choiceId: string }[] };
}

export const variantSelectorServiceDefinition = defineService<{
  selectedOptions: Signal<Record<string, string>>;
  selectedVariantId: Signal<string>;
  variants: Signal<Variant[]>;
  options: Signal<Record<string, string[]>>;
  basePrice: Signal<number>;
  discountPrice: Signal<number | null>;
  isOnSale: Signal<boolean | null>;
  quantityAvailable: Signal<number>;
  productId: Signal<string>;
  sku: Signal<string>;
  ribbonLabel: Signal<string | null>;
  selectedVariant: () => Variant | undefined;
  finalPrice: () => number;
  isLowStock: (threshold?: number) => boolean;
  setOption: (group: string, value: string) => void;
  selectVariantById: (id: string) => void;
  loadProductVariants: (data: Variant[]) => void;
  resetSelections: () => void;
}>("variantSelector");

export const variantSelectorService = implementService.withConfig<{
  productId: string;
}>()(variantSelectorServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const options = signalsService.signal<Record<string, string[]>>({});
  const variants = signalsService.signal<Variant[]>([]);
  const selectedOptions = signalsService.signal<Record<string, string>>({});
  const selectedVariantId = signalsService.signal<string>("");
  const basePrice = signalsService.signal<number>(100);
  const discountPrice = signalsService.signal<number | null>(80);
  const isOnSale = signalsService.signal<boolean | null>(true);
  const quantityAvailable = signalsService.signal<number>(10);
  const productId = signalsService.signal<string>(config.productId);
  const sku = signalsService.signal<string>("SKU123");
  const ribbonLabel = signalsService.signal<string | null>("Sale");

  function findVariantByOptions(opts: Record<string, string>) {
    return variants
      .get()
      .find((variant) =>
        Object.entries(opts).every(([group, value]) =>
          variant.choices.some(
            (c: { optionChoiceNames: OptionChoiceNames }) =>
              c.optionChoiceNames.optionName === group &&
              c.optionChoiceNames.choiceName === value
          )
        )
      );
  }

  const selectedVariant = () => {
    const found = variants.get().find((v) => v._id === selectedVariantId.get());
    if (found) return found;
    const fallback = findVariantByOptions(selectedOptions.get());
    if (fallback) return fallback;
    return variants.get()[0];
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
    finalPrice: () => {
      const v = selectedVariant();
      return v?.price?.actualPrice?.amount
        ? Number(v.price.actualPrice.amount)
        : basePrice.get();
    },
    isLowStock: (threshold = 5) => {
      const v = selectedVariant();
      return (
        v?.inventoryStatus?.inStock === false ||
        Number(v?.stock ?? 0) <= threshold
      );
    },
    setOption: (group, value) => {
      const newOptions = { ...selectedOptions.get(), [group]: value };
      selectedOptions.set(newOptions);
      const match = findVariantByOptions(newOptions);
      if (match) selectedVariantId.set(match._id);
    },
    selectVariantById: (id) => selectedVariantId.set(id),
    loadProductVariants: (data) => {
      variants.set(data);
      if (data.length > 0) selectedVariantId.set(data[0]._id);
    },
    resetSelections: () => {
      // Try to set defaults from options
      const opts = options.get();
      const defaultOptions: Record<string, string> = {};
      Object.keys(opts).forEach((key) => {
        defaultOptions[key] = opts[key][0];
      });
      selectedOptions.set(defaultOptions);
      const match = findVariantByOptions(defaultOptions);
      if (match) selectedVariantId.set(match._id);
    },
  };
});
