import { Root as CoreRoot, Next as CoreNext, Previous as CorePrevious, Viewport as CoreViewport, Indicator as CoreIndicator, ThumbnailList as CoreThumbnailList, ThumbnailItem as CoreThumbnailItem } from "./core/MediaGallery.js";
import React, { createContext, useContext } from "react";
import type { MediaItem } from "../services/media-gallery-service.js";
import type { MediaGalleryServiceConfig } from "../services/media-gallery-service.js";
import { Slot } from "@radix-ui/react-slot";


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export interface RootProps {
  children: React.ReactNode;
  mediaGalleryServiceConfig: MediaGalleryServiceConfig;
}

export const Root = ({ children, mediaGalleryServiceConfig }: RootProps) => {
  return (
    <CoreRoot mediaGalleryServiceConfig={mediaGalleryServiceConfig}>
      {children}
    </CoreRoot>
  );
};

export const Next = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
  const Comp = props.asChild ? Slot : "button";

  return <CoreNext>
    {({ next, canGoNext }) => (
      <Comp
        ref={ref}
        onClick={next}
        disabled={!canGoNext}
        {...props}
      >
        {children}
      </Comp>
    )}
  </CoreNext>
});

export const Previous = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
  const Comp = props.asChild ? Slot : "button";
  return <CorePrevious>
    {({ previous, canGoPrevious }) => (
      <Comp
        ref={ref}
        onClick={previous}
        disabled={!canGoPrevious}
        {...props}
      >
        {children}
      </Comp>
    )}
  </CorePrevious>
});

export interface ViewportProps {
  children: (props: { src: string | null; alt: string }) => React.ReactNode;
}

export const Viewport = (props: ViewportProps) => {
  return <CoreViewport>{props.children}</CoreViewport>;
}

export interface IndicatorProps {
  children: (props: { current: number; total: number }) => React.ReactNode;
}

export const Indicator = (props: IndicatorProps) => {
  return <CoreIndicator>{props.children}</CoreIndicator>
}

const ThumbnailsContext = createContext<{ items: MediaItem[] } | null>(null);
const ThumbnailItemContext = createContext<{ index: number } | null>(null);

export const Thumbnails = ({ children }: { children: React.ReactNode }) => (
  <CoreThumbnailList>
    {({ items }) => (
      <ThumbnailsContext.Provider value={{ items: items as MediaItem[] }}>
        {children}
      </ThumbnailsContext.Provider>
    )}
  </CoreThumbnailList>
);

export const ThumbnailRepeater = ({ children }: { children: React.ReactNode }) => {
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

export const ThumbnailItem = ({ children }: { children: (props: { src: string | null; isActive: boolean; select: () => void; alt: string }) => React.ReactNode }) => {
  const itemCtx = useContext(ThumbnailItemContext);
  if (!itemCtx) return null;
  const { index } = itemCtx;
  return (
    <CoreThumbnailItem index={index}>
      {children}
    </CoreThumbnailItem>
  );
}

