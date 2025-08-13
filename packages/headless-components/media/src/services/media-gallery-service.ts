import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
  type ReadOnlySignal,
} from "@wix/services-definitions/core-services/signals";

export interface MediaGalleryServiceAPI {
  selectedMediaIndex: Signal<number>;

  mediaToDisplay: ReadOnlySignal<MediaItem[]>;
  setMediaToDisplay: (media: MediaItem[]) => void;

  totalMedia: ReadOnlySignal<number>;

  setSelectedMediaIndex: (index: number) => void;
  nextMedia: () => void;
  hasNextMedia: () => boolean;
  hasPreviousMedia: () => boolean;
  previousMedia: () => void;
  stopAutoPlay: () => void;
}

export const MediaGalleryServiceDefinition =
  defineService<MediaGalleryServiceAPI>("mediaGallery");

export type MediaItem = {
  image?: string | null;
  altText?: string | null;
};

export interface MediaGalleryServiceConfig {
  media?: MediaItem[];
  infinite?: boolean; // default - false - if true, the gallery will loop back to the first item when the user reaches the end
  autoPlay?: {
    direction?: 'forward' | 'backward'; // default - 'forward' - the direction of the gallery (removed top/bottom, has no meaning, we call next/prev, the actual advancement is a style issue.)
    intervalMs?: number; // default - 5000 - the interval in milliseconds between auto-advances
 } // if falsy, no autplay
}

export const MediaGalleryService =
  implementService.withConfig<MediaGalleryServiceConfig>()(
    MediaGalleryServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const mediaToDisplay = signalsService.signal<MediaItem[]>(
        config?.media ?? [],
      );

      const selectedMediaIndex: Signal<number> = signalsService.signal(
        0 as any,
      );

      const totalMedia: ReadOnlySignal<number> = signalsService.computed(
        () => mediaToDisplay.get().length,
      );

      const setSelectedMediaIndex = (index: number) => {
        const images = mediaToDisplay.get();
        if (!images.length) return;

        const maxIndex = images.length - 1;
        const validIndex = Math.max(0, Math.min(index, maxIndex));
        selectedMediaIndex.set(validIndex);
      };

      const nextMedia = () => {
        const images = mediaToDisplay.get();
        const currentIndex = selectedMediaIndex.get();

        if (!hasNextMedia()) return;

        const nextIndex =
          (currentIndex + 1) % images.length;
        selectedMediaIndex.set(nextIndex);
      };

      const hasNextMedia = () => {
        const images = mediaToDisplay.get();
        const currentIndex = selectedMediaIndex.get();
        return config?.infinite || currentIndex < images.length - 1;
      };

      const previousMedia = () => {
        const images = mediaToDisplay.get();
        const currentIndex = selectedMediaIndex.get();

        if (!hasPreviousMedia()) return;

        const prevIndex =
          currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
        selectedMediaIndex.set(prevIndex);
      };

      const hasPreviousMedia = () => {
        const currentIndex = selectedMediaIndex.get();
        return config?.infinite || currentIndex > 0;
      };

      const setMediaToDisplay = (media: MediaItem[]) => {
        mediaToDisplay.set(media);
        selectedMediaIndex.set(0);
      };

      let autoplayInterval: NodeJS.Timeout | null = null;
      if (config?.autoPlay) {
        const { direction = 'forward', intervalMs = 5000 } = config.autoPlay;
        autoplayInterval = setInterval(() => {
          direction === 'forward' ? nextMedia() : previousMedia();
        }, intervalMs);
      }

      const stopAutoPlay = () => {
        if (autoplayInterval) {
          clearInterval(autoplayInterval);
          autoplayInterval = null;
        }
      };

      return {
        selectedMediaIndex,
        mediaToDisplay,

        setMediaToDisplay,
        setSelectedMediaIndex,
        nextMedia,
        previousMedia,
        hasNextMedia,
        hasPreviousMedia,

        totalMedia,

        stopAutoPlay,
      };
    },
  );
