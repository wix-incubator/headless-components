import React from 'react';
import { media as wixMedia } from '@wix/sdk';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

type MediaItem = { image?: string };

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
