import React from "react";
import { media as wixMedia } from "@wix/sdk";
import { Image, type FittingType, initCustomElement } from '@wix/image'; // Note: this import SCSS
import { Slot } from "@radix-ui/react-slot";

initCustomElement();

type MediaItem = { image?: string };

export interface WixMediaImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  media?: MediaItem;
  asChild?: boolean;
  displayMode?: FittingType;
  showPlaceholder?: boolean;
}


export const WixMediaImage = React.forwardRef<
  HTMLImageElement,
  WixMediaImageProps
>(({ media, width, height, className, alt = "", asChild, children, displayMode = 'fill', showPlaceholder = true, ...rest }, ref) => {
  if (!media?.image) return null;

  const parsed = wixMedia.getImageUrl(media.image);
  const src = parsed.url;
  const derivedWidth = Number(width) || parsed.width;
  const derivedHeight = Number(height) || parsed.height;
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
        ref={ref}
        {...rest}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Image
      key={src}
      uri={src}
      width={derivedWidth}
      height={derivedHeight}
      containerWidth={derivedWidth}
      containerHeight={derivedHeight}
      displayMode={displayMode}
      isSEOBot={false}
      shouldUseLQIP={showPlaceholder}
      alt={alt}
      className={className}
    />
  );
});


