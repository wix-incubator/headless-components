import { Next as CoreNext, Previous as CorePrevious, Viewport as CoreViewport, Indicator as CoreIndicator, ThumbnailList as CoreThumbnailList, ThumbnailItem as CoreThumbnailItem } from "../core/MediaGallery.js";
import { WixMediaImage } from "./WixMediaImage.js";
import React, { createContext, useContext } from "react";
import type { MediaItem } from "../services/media-gallery-service.js";

export const Next = () => {
  return <CoreNext>
    {({ next, canGoNext }) => (
      <button
        onClick={next}
        disabled={!canGoNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full transition-all"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    )}
  </CoreNext>
}

export const Previous = () => {
  return <CorePrevious>
    {({ previous, canGoPrevious }) => (
      <button
        onClick={previous}
        disabled={!canGoPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full transition-all"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    )}
  </CorePrevious>
}

export const Viewport = () => {
  return <CoreViewport>
    {({ src, alt }) => (
      <>
        {src ? (
          <WixMediaImage
            media={{ image: src }}
            className="w-full h-full object-cover"
            alt={alt}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-24 h-24 text-content-subtle"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </>
    )}
  </CoreViewport>;
}

export const Indicator = () => {
  return <CoreIndicator>
    {({ current, total }) => (
      <div className="absolute bottom-4 right-4 bg-surface-tooltip text-nav px-3 py-1 rounded-full text-sm">
        {current} / {total}
      </div>
    )}
  </CoreIndicator>
}

const ThumbnailsContext = createContext<{ items: MediaItem[] } | null>(null);
const ThumbnailItemContext = createContext<{ index: number } | null>(null);

// New API: <MediaGallery.Thumbnails>
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
    <div className="grid grid-cols-4 gap-4">
      {ctx.items.map((_, i) => (
        <ThumbnailItemContext.Provider key={i} value={{ index: i }}>
          {children}
        </ThumbnailItemContext.Provider>
      ))}
    </div>
  );
};

export const ThumbnailItem = () => {
  const itemCtx = useContext(ThumbnailItemContext);
  if (!itemCtx) return null;
  const { index } = itemCtx;
  return (
    <CoreThumbnailItem index={index}>
      {({ src, isActive, select, alt }) => (
        <div
          onClick={select}
          className={`aspect-square bg-surface-primary rounded-lg border cursor-pointer transition-all ${isActive
            ? 'border-brand-medium ring-2 ring-brand-light'
            : 'border-brand-subtle hover:border-brand-light'
            }`}
        >
          {src ? (
            <WixMediaImage
              media={{ image: src }}
              className="w-full h-full object-cover rounded-lg"
              alt={alt}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-content-subtle"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      )}
    </CoreThumbnailItem>
  );
}

