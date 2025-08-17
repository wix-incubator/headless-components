import React from "react";
import { media as wixMedia } from "@wix/sdk";
import { Slot } from "@radix-ui/react-slot";

type MediaItem = { image?: string };

export interface WixMediaImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  media?: MediaItem;
  asChild?: boolean;
}

export const WixMediaImage = React.forwardRef<
  HTMLImageElement,
  WixMediaImageProps
>(
  (
    { media, width, height, className, alt = "", asChild, children, ...rest },
    ref,
  ) => {
    if (!media?.image) return null;

    const parsed = wixMedia.getImageUrl(media.image);
    const src = parsed.url;
    const derivedWidth = width || parsed.width;
    const derivedHeight = height || parsed.height;
    const derivedAlt = parsed.altText ?? alt;

    if (asChild) {
      const Comp: React.ElementType = Slot;
      return (
        <Comp
          // Slot doesn't accept ref typings; forwarded by child when applicable
          src={src}
          width={derivedWidth}
          height={derivedHeight}
          alt={derivedAlt}
          className={className}
          {...rest}
        >
          {children}
        </Comp>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        width={derivedWidth}
        height={derivedHeight}
        alt={derivedAlt}
        className={className}
        {...rest}
      />
    );
  },
);
