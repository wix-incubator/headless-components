/**
 * @fileoverview MediaGallery Primitive Components
 *
 * This module provides unstyled, composable components for building media galleries.
 * These components follow the Radix UI primitive pattern, offering:
 *
 * - **Unstyled**: No default styling, only functional behavior
 * - **Composable**: Support for the `asChild` pattern for flexible DOM structure
 * - **Accessible**: Built-in keyboard navigation and ARIA attributes
 * - **Flexible**: Render props pattern for maximum customization
 *
 * ## Architecture
 *
 * These components are the **primitive layer** that sits between:
 * 1. **Core components** (pure logic, no DOM)
 * 2. **Styled components** (project-specific styling)
 *
 * ## Usage
 *
 * ```tsx
 * import { MediaGallery } from '@wix/headless-media/react';
 *
 * function ProductGallery({ productMedia }) {
 *   return (
 *     <MediaGallery.Root mediaGalleryServiceConfig={{ media: productMedia }}>
 *       <MediaGallery.Viewport />
 *       <MediaGallery.Previous />
 *       <MediaGallery.Next />
 *       <MediaGallery.Indicator />
 *       <MediaGallery.Thumbnails>
 *         <MediaGallery.ThumbnailRepeater>
 *           <MediaGallery.ThumbnailItem />
 *         </MediaGallery.ThumbnailRepeater>
 *       </MediaGallery.Thumbnails>
 *     </MediaGallery.Root>
 *   );
 * }
 * ```
 *
 * @module MediaGallery
 */

import { Root as CoreRoot, Next as CoreNext, Previous as CorePrevious, Viewport as CoreViewport, Indicator as CoreIndicator, ThumbnailList as CoreThumbnailList, ThumbnailItem as CoreThumbnailItem } from "./core/MediaGallery.js";
import React, { createContext, useContext } from "react";
import type { MediaItem } from "../services/media-gallery-service.js";
import type { MediaGalleryServiceConfig } from "../services/media-gallery-service.js";
import { Slot } from "@radix-ui/react-slot";
import { WixMediaImage } from "./WixMediaImage.js";

// Components that render actual DOM elements get test IDs on their rendered elements
// Components that only provide context/logic don't introduce new DOM elements
export enum TestIds {
  mediaGalleryRoot = "media-gallery-root",
  mediaGalleryNext = "media-gallery-next",
  mediaGalleryPrevious = "media-gallery-previous",
  mediaGalleryViewport = "media-gallery-viewport",
  mediaGalleryIndicator = "media-gallery-indicator",
  mediaGalleryThumbnailItem = "media-gallery-thumbnail-item",
}


/**
 * Props for button-like components that support the asChild pattern
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
}

/**
 * Props for the Root component
 */
export interface RootProps {
  /** Child components that will have access to the media gallery context */
  children: React.ReactNode;
  /** Configuration for the media gallery service */
  mediaGalleryServiceConfig: MediaGalleryServiceConfig;
}

/**
 * Root component that provides media gallery service context to its children.
 * This is a primitive wrapper around the core Root component that maintains
 * the same API while providing a foundation for composition patterns.
 *
 * @component
 * @example
 * ```tsx
 * import { MediaGallery } from '@wix/headless-media/react';
 *
 * function ProductGallery({ productMedia }) {
 *   return (
 *     <MediaGallery.Root mediaGalleryServiceConfig={{ media: productMedia }}>
 *       <MediaGallery.Viewport className="main-viewer" />
 *       <MediaGallery.Thumbnails>
 *         <MediaGallery.ThumbnailRepeater>
 *           <MediaGallery.ThumbnailItem />
 *         </MediaGallery.ThumbnailRepeater>
 *       </MediaGallery.Thumbnails>
 *     </MediaGallery.Root>
 *   );
 * }
 * ```
 */
export const Root = ({ children, mediaGalleryServiceConfig }: RootProps) => {
  return (
    <CoreRoot mediaGalleryServiceConfig={mediaGalleryServiceConfig} data-testid={TestIds.mediaGalleryRoot}>
      {children}
    </CoreRoot>
  );
};

/**
 * Next button component that navigates to the next media item.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default button
 * <MediaGallery.Next />
 *
 * // Custom button with asChild
 * <MediaGallery.Next asChild>
 *   <button className="custom-next-btn">
 *     <ChevronRightIcon />
 *   </button>
 * </MediaGallery.Next>
 *
 * // With custom content
 * <MediaGallery.Next className="nav-button">
 *   Next Image →
 * </MediaGallery.Next>
 * ```
 */
export const Next = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
  const Comp = props.asChild ? Slot : "button";

  return <CoreNext>
    {({ next, canGoNext }) => (
      <Comp
        ref={ref}
        onClick={next}
        disabled={!canGoNext}
        data-testid={TestIds.mediaGalleryNext}
        {...props}
      >
        {children}
      </Comp>
    )}
  </CoreNext>
});

/**
 * Previous button component that navigates to the previous media item.
 * Supports the asChild pattern for flexible composition.
 *
 * @component
 * @example
 * ```tsx
 * // Default button
 * <MediaGallery.Previous />
 *
 * // Custom button with asChild
 * <MediaGallery.Previous asChild>
 *   <button className="custom-prev-btn">
 *     <ChevronLeftIcon />
 *   </button>
 * </MediaGallery.Previous>
 *
 * // With custom content
 * <MediaGallery.Previous className="nav-button">
 *   ← Previous Image
 * </MediaGallery.Previous>
 * ```
 */
export const Previous = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
  const Comp = props.asChild ? Slot : "button";
  return <CorePrevious>
    {({ previous, canGoPrevious }) => (
      <Comp
        ref={ref}
        onClick={previous}
        disabled={!canGoPrevious}
        data-testid={TestIds.mediaGalleryPrevious}
        {...props}
      >
        {children}
      </Comp>
    )}
  </CorePrevious>
});

/**
 * Props for the Viewport component
 */
export interface ViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional children to render instead of the default image. Renders default media image if not provided */
  children?: React.ReactNode;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Custom empty state content to display when no media is available */
  emptyState?: React.ReactNode;
}

/**
 * Viewport component that displays the currently selected media item.
 * Automatically renders the active media using WixMediaImage for optimization.
 * Supports the asChild pattern and custom empty states.
 *
 * @component
 * @example
 * ```tsx
 * // Default viewport
 * <MediaGallery.Viewport />
 *
 * // With custom styling
 * <MediaGallery.Viewport className="rounded-lg border" />
 *
 * // With custom empty state
 * <MediaGallery.Viewport
 *   emptyState={<div>No images available</div>}
 * />
 *
 * // Using asChild for custom wrapper
 * <MediaGallery.Viewport asChild>
 *   <div className="custom-viewport-wrapper">
 *     Content will be rendered here
 *   </div>
 * </MediaGallery.Viewport>
 *
 * // With completely custom children
 * <MediaGallery.Viewport>
 *   <CustomImageComponent />
 * </MediaGallery.Viewport>
 * ```
 */
export const Viewport = React.forwardRef<HTMLDivElement, ViewportProps>(
  ({ children, asChild, emptyState, ...props }, ref) => {
    return (
      <CoreViewport>
        {({ src, alt }) => {
          const Comp = asChild ? Slot : "div";
          return (
            <Comp
              ref={ref}
              data-src={src}
              data-alt={alt}
              data-testid={TestIds.mediaGalleryViewport}
              {...props}
            >
              {children ?? (
                src ? (
                  <WixMediaImage media={{ image: src }} alt={alt} />
                ) : (
                  emptyState ?? <div>No image</div>
                )
              )}
            </Comp>
          );
        }}
      </CoreViewport>
    );
  }
);

/**
 * Props for the Indicator component
 */
export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional children to render instead of the default "current / total" format */
  children?: React.ReactNode;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
}

/**
 * Indicator component that displays the current media position (e.g., "1 / 5").
 * Automatically tracks the current and total media count.
 * Supports the asChild pattern for flexible styling.
 *
 * @component
 * @example
 * ```tsx
 * // Default indicator
 * <MediaGallery.Indicator />
 *
 * // With custom styling
 * <MediaGallery.Indicator className="text-sm opacity-80" />
 *
 * // Using asChild for custom wrapper
 * <MediaGallery.Indicator asChild>
 *   <span className="badge">
 *    "1 / 5" will be rendered here
 *   </span>
 * </MediaGallery.Indicator>
 *
 * // With completely custom children
 * <MediaGallery.Indicator>
 *   <CustomIndicatorComponent />
 * </MediaGallery.Indicator>
 * ```
 */
export const Indicator = React.forwardRef<HTMLDivElement, IndicatorProps>(
  ({ children, asChild, ...props }, ref) => {
    return (
      <CoreIndicator>
        {({ current, total }) => {
          const Comp = asChild ? Slot : "div";
          return (
            <Comp
              ref={ref}
              data-current={current}
              data-total={total}
              data-testid={TestIds.mediaGalleryIndicator}
              {...props}
            >
              {children ?? (
                <div>{current} / {total}</div>
              )}
            </Comp>
          );
        }}
      </CoreIndicator>
    );
  }
);

const ThumbnailsContext = createContext<{ items: MediaItem[] } | null>(null);
const ThumbnailItemContext = createContext<{ index: number } | null>(null);

/**
 * Props for the Thumbnails component
 */
export interface ThumbnailsProps {
  /** Child components that will have access to the thumbnail context */
  children: React.ReactNode;
}

/**
 * Thumbnails container component that provides thumbnail context to its children.
 * Only renders when there are multiple media items to display.
 *
 * @component
 * @example
 * ```tsx
 * <MediaGallery.Thumbnails>
 *   <MediaGallery.ThumbnailRepeater>
 *     <MediaGallery.ThumbnailItem />
 *   </MediaGallery.ThumbnailRepeater>
 * </MediaGallery.Thumbnails>
 * ```
 */
export const Thumbnails = ({ children }: ThumbnailsProps) => (
  <CoreThumbnailList>
    {({ items }) => (
      <ThumbnailsContext.Provider value={{ items: items as MediaItem[] }}>
        {children}
      </ThumbnailsContext.Provider>
    )}
  </CoreThumbnailList>
);

/**
 * Props for the ThumbnailRepeater component
 */
export interface ThumbnailRepeaterProps {
  /** Template to repeat for each thumbnail item */
  children: React.ReactNode;
}

/**
 * ThumbnailRepeater component that renders a template for each media item.
 * Provides index context to each thumbnail item. Only renders when there are
 * multiple media items available.
 *
 * @component
 * @example
 * ```tsx
 * <MediaGallery.ThumbnailRepeater>
 *   <MediaGallery.ThumbnailItem className="thumbnail" />
 * </MediaGallery.ThumbnailRepeater>
 * ```
 */
export const ThumbnailRepeater = ({ children }: ThumbnailRepeaterProps) => {
  const ctx = useContext(ThumbnailsContext);
  if (!ctx || !ctx.items || ctx.items.length <= 1) return null;
  return (
    <>
      {ctx.items.map((_, i) => (
        <ThumbnailItemContext.Provider key={i} value={{ index: i }}>
          {children}
        </ThumbnailItemContext.Provider>
      ))}
    </>
  );
};

/**
 * Props for the ThumbnailItem component
 */
export interface ThumbnailItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Custom empty state content to display when the thumbnail has no media */
  emptyState?: React.ReactNode;
}

/**
 * ThumbnailItem component that renders an individual thumbnail for media selection.
 * Automatically handles selection state, click events, and renders the thumbnail image.
 * Must be used within a ThumbnailRepeater context.
 *
 * @component
 * @example
 * ```tsx
 * // Default thumbnail item
 * <MediaGallery.ThumbnailItem />
 *
 * // With custom styling
 * <MediaGallery.ThumbnailItem className="border rounded-lg hover:shadow-lg" />
 *
 * // With custom empty state
 * <MediaGallery.ThumbnailItem
 *   emptyState={<div className="placeholder">No preview</div>}
 * />
 *
 * // Using asChild for custom wrapper
 * <MediaGallery.ThumbnailItem asChild>
 *   <button className="custom-thumbnail-button">
 *    Thumbnail content will be rendered here
 *   </button>
 * </MediaGallery.ThumbnailItem>
 *
 * // With completely custom children
 * <MediaGallery.ThumbnailItem>
 *   <CustomThumbnailComponent />
 * </MediaGallery.ThumbnailItem>
 * ```
 */
export const ThumbnailItem = React.forwardRef<HTMLDivElement, ThumbnailItemProps>(
  ({ children, asChild, emptyState, ...props }, ref) => {
    const itemCtx = useContext(ThumbnailItemContext);
    if (!itemCtx) return null;
    const { index } = itemCtx;

    return (
      <CoreThumbnailItem index={index}>
        {({ src, isActive, select, alt }) => {
          const Comp = asChild ? Slot : "div";
          return (
            <Comp
              ref={ref}
              onClick={select}
              data-active={isActive}
              data-src={src}
              data-alt={alt}
              data-index={index}
              data-available={true} /* TODO: need get this from variant or something */
              data-testid={TestIds.mediaGalleryThumbnailItem}
              {...props}
            >
              {children ?? (
                src ? (
                  <WixMediaImage media={{ image: src }} alt={alt} />
                ) : (
                  emptyState ?? <div>No image</div>
                )
              )}
            </Comp>
          );
        }}
      </CoreThumbnailItem>
    );
  }
);
