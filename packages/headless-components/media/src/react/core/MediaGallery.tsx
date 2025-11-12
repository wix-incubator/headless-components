import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  MediaGalleryServiceDefinition,
  MediaGalleryService,
} from '../../services/index.js';
import { MediaGalleryServiceConfig } from '../../services/media-gallery-service.js';
import { createServicesMap } from '@wix/services-manager';

export interface RootProps {
  children: React.ReactNode;
  mediaGalleryServiceConfig: MediaGalleryServiceConfig;
}

/**
 * Root component that provides the MediaGallery service context to its children.
 * This component sets up the necessary services for rendering and managing media gallery functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { MediaGallery } from '@wix/media/components';
 *
 * function ProductMediaGallery({ productMedia }) {
 *   return (
 *     <MediaGallery.Root mediaGalleryServiceConfig={{ media: productMedia }}>
 *       <div className="media-gallery">
 *         <MediaGallery.Viewport>
 *           {({ src, alt }) => (
 *             <img
 *               src={src || '/placeholder.jpg'}
 *               alt={alt}
 *               className="main-media"
 *             />
 *           )}
 *         </MediaGallery.Viewport>
 *         <MediaGallery.ThumbnailList>
 *           {({ items }) => (
 *             <div className="thumbnail-grid">
 *               {items.map((item, index) => (
 *                 <MediaGallery.ThumbnailItem key={index} index={index}>
 *                   {({ src, isActive, onSelect, alt }) => (
 *                     <button
 *                       onClick={onSelect}
 *                       className={`thumbnail ${isActive ? 'active' : ''}`}
 *                     >
 *                       <img src={src} alt={alt} />
 *                     </button>
 *                   )}
 *                 </MediaGallery.ThumbnailItem>
 *               ))}
 *             </div>
 *           )}
 *         </MediaGallery.ThumbnailList>
 *       </div>
 *     </MediaGallery.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        MediaGalleryServiceDefinition,
        MediaGalleryService,
        props.mediaGalleryServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for Viewport headless component
 */
export interface ViewportProps {
  /** Render prop function that receives viewport data */
  children: (props: ViewportRenderProps) => React.ReactNode;
}

/**
 * Render props for Viewport component
 */
export interface ViewportRenderProps {
  /** Media URL */
  src: string | null;
  /** Alt text for media */
  alt: string;
}

/**
 * Headless component for displaying the main viewport media
 *
 * @component
 * @example
 * ```tsx
 * import { MediaGallery } from '@wix/media/components';
 *
 * function MediaViewer() {
 *   return (
 *     <MediaGallery.Viewport>
 *       {({ src, alt }) => (
 *         <img
 *           src={src || '/placeholder.jpg'}
 *           alt={alt}
 *           className="main-media"
 *         />
 *       )}
 *     </MediaGallery.Viewport>
 *   );
 * }
 * ```
 */
export const Viewport = (props: ViewportProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const currentIndex = mediaService.selectedMediaIndex.get();
  const mediaToDisplay = mediaService.mediaToDisplay.get();

  if (mediaToDisplay.length === 0) {
    return null;
  }

  // Get the current media from the relevant media array
  const src = mediaToDisplay[currentIndex]!.image!;
  const alt = mediaToDisplay[currentIndex]!.altText!;

  return props.children({
    src,
    alt,
  });
};

/**
 * Props for ThumbnailList headless component
 */
export interface ThumbnailListProps {
  /** Render prop function that receives thumbnail list data */
  children: (props: ThumbnailListRenderProps) => React.ReactNode;
}

/**
 * Render props for ThumbnailList component
 */
export interface ThumbnailListRenderProps {
  /** Array of media items */
  items: any[];
}

/**
 * Headless component for managing a list of thumbnails
 *
 * @component
 * @example
 * ```tsx
 * import { MediaGallery } from '@wix/media/components';
 *
 * function ThumbnailGrid() {
 *   return (
 *     <MediaGallery.ThumbnailList>
 *       {({ items }) => (
 *         <div className="thumbnail-grid">
 *           {items.map((item, index) => (
 *             <MediaGallery.ThumbnailItem key={index} index={index}>
 *               {({ src, isActive, onSelect, alt }) => (
 *                 <button
 *                   onClick={onSelect}
 *                   className={`thumbnail ${isActive ? 'active' : ''}`}
 *                 >
 *                   <img src={src} alt={alt} />
 *                 </button>
 *               )}
 *             </MediaGallery.ThumbnailItem>
 *           ))}
 *         </div>
 *       )}
 *     </MediaGallery.ThumbnailList>
 *   );
 * }
 * ```
 */
export const ThumbnailList = (props: ThumbnailListProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const mediaToDisplay = mediaService.mediaToDisplay.get();

  if (mediaToDisplay.length <= 1) {
    return null;
  }

  return props.children({
    items: mediaToDisplay,
  });
};

/**
 * Props for ThumbnailItem headless component
 */
export interface ThumbnailItemProps {
  /** Index of the media item */
  index: number;
  /** Render prop function that receives thumbnail data */
  children: (props: ThumbnailItemRenderProps) => React.ReactNode;
}

/**
 * Render props for ThumbnailItem component
 */
export interface ThumbnailItemRenderProps {
  /** Media item data */
  item: any | null; // V3 media item structure
  /** Thumbnail image URL */
  src: string | null;
  /** Whether this thumbnail is currently active */
  isActive: boolean;
  /** Function to select this media */
  select: () => void;
  /** Index of this thumbnail */
  index: number;
  /** Alt text for thumbnail */
  alt: string;
}

/**
 * Headless component for individual media thumbnail
 *
 * @component
 * @example
 * ```tsx
 * import { MediaGallery } from '@wix/media/components';
 *
 * function ThumbnailButton({ index }) {
 *   return (
 *     <MediaGallery.ThumbnailItem index={index}>
 *       {({ src, isActive, select, alt }) => (
 *         <button
 *           onClick={select}
 *           className={`thumbnail-btn ${isActive ? 'active' : ''}`}
 *         >
 *           <img src={src} alt={alt} />
 *           {isActive && <div className="active-indicator" />}
 *         </button>
 *       )}
 *     </MediaGallery.ThumbnailItem>
 *   );
 * }
 * ```
 */
export const ThumbnailItem = (props: ThumbnailItemProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const currentIndex = mediaService.selectedMediaIndex.get();
  const mediaToDisplay = mediaService.mediaToDisplay.get();

  if (mediaToDisplay.length === 0) {
    return null;
  }

  // Get the image source from the centralized relevant images
  const src = mediaToDisplay[props.index]!.image!;
  const alt = mediaToDisplay[props.index]!.altText!;

  const isActive = currentIndex === props.index;

  const select = () => {
    mediaService.setSelectedMediaIndex(props.index);
  };

  return props.children({
    item: mediaToDisplay[props.index],
    src,
    isActive,
    select,
    index: props.index,
    alt,
  });
};

/**
 * Props for Next headless component
 */
export interface NextProps {
  /** Render prop function that receives next navigation data */
  children: (props: NextRenderProps) => React.ReactNode;
}

/**
 * Render props for Next component
 */
export interface NextRenderProps {
  /** Function to go to next media */
  next: () => void;
  /** Whether there is a next media available */
  canGoNext: boolean;
}

/**
 * Headless component for next media navigation
 *
 * @component
 * @example
 * ```tsx
 * import { MediaGallery } from '@wix/media/components';
 *
 * function NextButton() {
 *   return (
 *     <MediaGallery.Next>
 *       {({ next, canGoNext }) => (
 *         <button
 *           onClick={next}
 *           disabled={!canGoNext}
 *           className="nav-btn next-btn"
 *         >
 *           Next →
 *         </button>
 *       )}
 *     </MediaGallery.Next>
 *   );
 * }
 * ```
 */
export const Next = (props: NextProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  return props.children({
    next: mediaService.nextMedia,
    canGoNext: mediaService.hasNextMedia(),
  });
};

/**
 * Props for Previous headless component
 */
export interface PreviousProps {
  /** Render prop function that receives previous navigation data */
  children: (props: PreviousRenderProps) => React.ReactNode;
}

/**
 * Render props for Previous component
 */
export interface PreviousRenderProps {
  /** Function to go to previous media */
  previous: () => void;
  /** Whether there is a previous media available */
  canGoPrevious: boolean;
}

/**
 * Headless component for previous media navigation
 *
 * @component
 * @example
 * ```tsx
 * import { MediaGallery } from '@wix/media/components';
 *
 * function PreviousButton() {
 *   return (
 *     <MediaGallery.Previous>
 *       {({ previous, canGoPrevious }) => (
 *         <button
 *           onClick={previous}
 *           disabled={!canGoPrevious}
 *           className="nav-btn prev-btn"
 *         >
 *           ← Previous
 *         </button>
 *       )}
 *     </MediaGallery.Previous>
 *   );
 * }
 * ```
 */
export const Previous = (props: PreviousProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  return props.children({
    previous: mediaService.previousMedia,
    canGoPrevious: mediaService.hasPreviousMedia(),
  });
};

/**
 * Props for Indicator headless component
 */
export interface IndicatorProps {
  /** Render prop function that receives indicator data */
  children: (props: IndicatorRenderProps) => React.ReactNode;
}

/**
 * Render props for Indicator component
 */
export interface IndicatorRenderProps {
  /** Current media index (1-based for display) */
  current: number;
  /** Total number of media */
  total: number;
}

/**
 * Headless component for media gallery indicator/counter
 *
 * @component
 * @example
 * ```tsx
 * import { MediaGallery } from '@wix/media/components';
 *
 * function MediaCounter() {
 *   return (
 *     <MediaGallery.Indicator>
 *       {({ current, total }) => (
 *         <div className="media-indicator">
 *           {current} of {total}
 *         </div>
 *       )}
 *     </MediaGallery.Indicator>
 *   );
 * }
 * ```
 */
export const Indicator = (props: IndicatorProps) => {
  const mediaService = useService(MediaGalleryServiceDefinition) as ServiceAPI<
    typeof MediaGalleryServiceDefinition
  >;

  const currentIndex = mediaService.selectedMediaIndex.get();
  const totalMedia = mediaService.totalMedia.get();

  if (totalMedia <= 1) {
    return null;
  }

  return props.children({
    current: currentIndex + 1,
    total: totalMedia,
  });
};
