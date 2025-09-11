import React from 'react';
import { media as wixMedia } from '@wix/sdk';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

type MediaItem = { image?: string };

/**
 * WixMediaImage is a headless React component for rendering images using Wix Media Platform URLs.
 * It supports both standard images and shape images (where "shape" refers to images sourced from Wix Shapes, not the media gallery), and can be rendered as a native <img> or as a custom child via asChild.
 * The component automatically derives src, width, height, and alt from the provided media object.
 */

export interface WixMediaImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> {
  media?: MediaItem;
  isShape?: boolean;
  asChild?: boolean;
  children?: AsChildChildren<{
    src: string;
    width?: number;
    height?: number;
    alt: string;
  }>;
}

export const WixMediaImage = React.forwardRef<
  HTMLImageElement,
  WixMediaImageProps
>(
  (
    {
      media,
      isShape,
      width,
      height,
      className,
      alt = '',
      asChild,
      children,
      ...otherProps
    },
    ref,
  ) => {
    if (!media?.image) return null;

    const getUrl = isShape ? wixMedia.getShapeUrl : wixMedia.getImageUrl;

    const parsed = getUrl(media.image);
    const src = parsed.url;
    const derivedWidth = width || parsed.width;
    const derivedHeight = height || parsed.height;
    const derivedAlt = parsed.altText ?? alt;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={{
          src,
          width: derivedWidth,
          height: derivedHeight,
          alt: derivedAlt,
        }}
        {...otherProps}
      >
        <img
          src={src}
          width={derivedWidth}
          height={derivedHeight}
          alt={derivedAlt}
        />
      </AsChildSlot>
    );
  },
);
