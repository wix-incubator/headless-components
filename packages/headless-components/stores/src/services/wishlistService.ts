import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

export const wishlistServiceDefinition = defineService<{
  // --- State ---
  wishlist: Signal<{ productId: string; variantId: string }[]>;

  // --- Getters ---
  isInWishlist: (productId: string, variantId: string) => boolean;

  // --- Actions ---
  addToWishlist: (productId: string, variantId: string) => void;
  removeFromWishlist: (productId: string, variantId: string) => void;
  toggleWishlist: (productId: string, variantId: string) => void;
  clearWishlist: () => void;
}>("wishlist");

export const wishlistService = implementService.withConfig<{
  userId?: string;
}>()(wishlistServiceDefinition, ({ getService }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const wishlist = signalsService.signal<
    {
      productId: string;
      variantId: string;
    }[]
  >([]);

  return {
    wishlist,
    isInWishlist: (productId, variantId) =>
      wishlist
        .get()
        .some(
          (item) => item.productId === productId && item.variantId === variantId
        ),
    addToWishlist: (productId, variantId) => {
      if (
        !wishlist
          .get()
          .some(
            (item) =>
              item.productId === productId && item.variantId === variantId
          )
      ) {
        wishlist.set([...wishlist.get(), { productId, variantId }]);
      }
    },
    removeFromWishlist: (productId, variantId) => {
      wishlist.set(
        wishlist
          .get()
          .filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          )
      );
    },
    toggleWishlist: (productId, variantId) => {
      if (
        wishlist
          .get()
          .some(
            (item) =>
              item.productId === productId && item.variantId === variantId
          )
      ) {
        wishlist.set(
          wishlist
            .get()
            .filter(
              (item) =>
                !(item.productId === productId && item.variantId === variantId)
            )
        );
      } else {
        wishlist.set([...wishlist.get(), { productId, variantId }]);
      }
    },
    clearWishlist: () => wishlist.set([]),
  };
});
