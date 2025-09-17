import React from 'react';

/**
 * Function signature for render function pattern
 */
export type AsChildRenderFunction<TProps = any> = (
  props: TProps,
  ref: React.Ref<HTMLElement>,
) => React.ReactNode;

/**
 * Object with render method pattern
 */
export type AsChildRenderObject<TProps = any> = {
  render: AsChildRenderFunction<TProps>;
};

/**
 * Union type for all supported asChild patterns
 */
export type AsChildChildren<TProps = any> =
  | React.ReactElement
  | AsChildRenderFunction<TProps>
  | AsChildRenderObject<TProps>;

/**
 * Props interface for AsChildSlot component
 */
export interface AsChildSlotProps {
  asChild?: boolean;
  children?: React.ReactNode;
  customElement?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<HTMLElement, any>;
  customElementProps?: any;
  className?: string;
  content?: React.ReactNode | string;
  [key: string]: any;
}

/**
 * AsChildSlot component for handling asChild pattern
 * TODO: Replace with proper import when utils package is properly configured
 */
export const AsChildSlot = React.forwardRef<HTMLElement, AsChildSlotProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      customElement,
      customElementProps = {},
      content,
      ...otherProps
    } = props;

    if (asChild && customElement) {
      if (React.isValidElement(customElement)) {
        return React.cloneElement(customElement, {
          ...customElementProps,
          ...otherProps,
          ref,
        });
      }

      if (typeof customElement === 'function') {
        return customElement({ ...customElementProps, ...otherProps }, ref);
      }
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...customElementProps,
        ...otherProps,
        ref,
      });
    }

    return children as React.ReactElement;
  },
);

/**
 * Centralized TestIds enum following naming conventions
 */
export enum TestIds {
  // Container Level
  instagramFeedRoot = 'instagram-feed-root',
  instagramFeedTitle = 'instagram-feed-title',
  instagramFeedUsername = 'instagram-feed-username',
  instagramFeedHashtag = 'instagram-feed-hashtag',

  // Gallery - following 3-level pattern
  instagramFeedGallery = 'instagram-feed-gallery',
  instagramFeedGalleryItems = 'instagram-feed-gallery-items',
  instagramFeedGalleryItem = 'instagram-feed-gallery-item',

  // Media
  instagramFeedMedia = 'instagram-feed-media',
}
