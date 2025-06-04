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
import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

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
}>("currentCart");

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
  return {
    items,
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
  };
});
