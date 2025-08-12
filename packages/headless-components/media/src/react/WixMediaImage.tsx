import { Image, type FittingType, initCustomElement } from '@wix/image';
import { media  as wixMedia } from "@wix/sdk";

type MediaItem = {
  image?: string;
};

initCustomElement();

export function WixMediaImage({
  media,
  width,
  height,
  className,
  alt = '',
  showPlaceholder = true,
  displayMode = 'fill',
}: {
  media?: MediaItem;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  showPlaceholder?: boolean;
  displayMode?: FittingType;
}) {
  const parsedImageDetails = wixMedia.getImageUrl(media?.image!);

  return (
    <Image
      key={parsedImageDetails.url}
      uri={parsedImageDetails.url}
      width={width || parsedImageDetails.width}
      height={height || parsedImageDetails.height}
      containerWidth={width}
      containerHeight={height}
      displayMode={displayMode}
      isSEOBot={false}
      shouldUseLQIP={showPlaceholder}
      alt={parsedImageDetails.altText ?? alt}
      className={className}
    />
  );
}

