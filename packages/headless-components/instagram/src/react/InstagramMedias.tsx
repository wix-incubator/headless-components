import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

/**
 * Context for sharing Instagram media state between components
 */
interface InstagramMediasContextValue {
  hasItems: boolean;
  mediaItems: any[];
}

const InstagramMediasContext = React.createContext<InstagramMediasContextValue | null>(null);

/**
 * Hook to access Instagram medias context
 */
export function useInstagramMediasContext(): InstagramMediasContextValue {
  const context = React.useContext(InstagramMediasContext);
  if (!context) {
    throw new Error(
      'useInstagramMediasContext must be used within an InstagramFeed.InstagramMedias component',
    );
  }
  return context;
}

/**
 * Props for InstagramFeed InstagramMedias component (Container Level)
 */
export interface InstagramMediasProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ hasItems: boolean; mediaItems: any[] }> | React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

enum TestIds {
  instagramMedias = 'instagram-medias',
}

/**
 * Container for Instagram media items following the 3-level List, Options, Repeater pattern.
 * Does not render when there are no media items.
 * This is the Container Level that provides context and conditional rendering.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.InstagramMedias>
 *   <InstagramFeed.InstagramMediaItems>
 *     <InstagramFeed.InstagramMediaRepeater>
 *       <MediaGallery.Root mediaGalleryServiceConfig={{ media: [] }} />
 *     </InstagramFeed.InstagramMediaRepeater>
 *   </InstagramFeed.InstagramMediaItems>
 * </InstagramFeed.InstagramMedias>
 *
 * // asChild with custom container
 * <InstagramFeed.InstagramMedias asChild>
 *   <section className="medias-section">
 *     <InstagramFeed.InstagramMediaItems>
 *       // media content
 *     </InstagramFeed.InstagramMediaItems>
 *   </section>
 * </InstagramFeed.InstagramMedias>
 * ```
 */
export const InstagramMedias = React.forwardRef<HTMLElement, InstagramMediasProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const instagramFeedService = useService(InstagramFeedServiceDefinition);
    const feedData = instagramFeedService.feedData.get();

    const hasItems = feedData.mediaItems.length > 0;

    // Don't render if no items (following the Container Level pattern)
    if (!hasItems) return null;

    const contextValue: InstagramMediasContextValue = {
      hasItems,
      mediaItems: feedData.mediaItems,
    };

    return (
      <InstagramMediasContext.Provider value={contextValue}>
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.instagramMedias}
          customElement={children}
          customElementProps={{ hasItems, mediaItems: feedData.mediaItems }}
          {...otherProps}
        >
          <div>{React.isValidElement(children) ? children : null}</div>
        </AsChildSlot>
      </InstagramMediasContext.Provider>
    );
  },
);
