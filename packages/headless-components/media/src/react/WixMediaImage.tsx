import React from 'react';
import { media as wixMedia } from '@wix/sdk';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

type MediaItem = { image?: string };

/**
 * WixMediaImage is a headless React component for rendering images using Wix Media Platform URLs.
 * It supports both standard images and shape images (where "shape" refers to images sourced from Wix Shapes, not the media gallery), and can be rendered as a native <img> or as a custom child via asChild.
 * The component automatically derives src, width, height, and alt from the provided media object.
 * @field isShape means that the media stores in shapes instead of regular media.
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

    const isWixMedia =
      typeof media.image === 'string' &&
      (/^wix:(image|shape):\/\//.test(media.image) ||
        /static\.wixstatic\.com\/media\//.test(media.image));

    let src: string = '';
    let derivedWidth: number | undefined =
      typeof width === 'number' ? width : undefined;
    let derivedHeight: number | undefined =
      typeof height === 'number' ? height : undefined;
    let derivedAlt: string = alt;

    if (isWixMedia) {
      const getUrl = isShape ? wixMedia.getShapeUrl : wixMedia.getImageUrl;
      const parsed = getUrl(media.image as string);
      src = parsed.url;
      derivedWidth =
        typeof width === 'number' ? width : (parsed.width as number | undefined);
      derivedHeight =
        typeof height === 'number'
          ? height
          : (parsed.height as number | undefined);
      derivedAlt = parsed.altText ?? alt;
    } else {
      // External URL fallback (e.g., Instagram). Use raw URL with no derived dimensions
      src = String(media.image);
      derivedAlt = alt;
    }

    const dimensions: { width?: string | number; height?: string | number } =
      {};
    if (derivedWidth) {
      dimensions.width = derivedWidth;
    }
    if (derivedHeight) {
      dimensions.height = derivedHeight;
    }

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={{
          src,
          ...dimensions,
          alt: derivedAlt,
        }}
        {...otherProps}
      >
        <img src={src} {...dimensions} alt={derivedAlt} />
      </AsChildSlot>
    );
  },
);
