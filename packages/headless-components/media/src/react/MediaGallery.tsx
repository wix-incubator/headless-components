import { Root as CoreRoot, Next as CoreNext, Previous as CorePrevious, Viewport as CoreViewport, Indicator as CoreIndicator, ThumbnailList as CoreThumbnailList, ThumbnailItem as CoreThumbnailItem } from "./core/MediaGallery.js";
import React, { createContext, useContext } from "react";
import type { MediaItem } from "../services/media-gallery-service.js";
import type { MediaGalleryServiceConfig } from "../services/media-gallery-service.js";
import { Slot } from "@radix-ui/react-slot";
import { WixMediaImage } from "./WixMediaImage.js";


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

export interface ViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  asChild?: boolean;
  emptyState?: React.ReactNode;
}

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

export interface IndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  asChild?: boolean;
}

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

export interface ThumbnailItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  emptyState?: React.ReactNode;
}

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

