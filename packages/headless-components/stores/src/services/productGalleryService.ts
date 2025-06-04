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
import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

export const productGalleryServiceDefinition = defineService<{
  images: Signal<string[]>;
  selectedImageIndex: Signal<number>;
  variantImageMap: Signal<Record<string, number>>;
  currentImage: () => string;
  variantMappedImage: (variantId: string) => string;
  loadImages: (images: string[]) => void;
  setImageIndex: (index: number) => void;
  resetGallery: () => void;
  mapVariantToImage: (variantId: string, index: number) => void;
}>("productGallery");

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
