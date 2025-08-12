import React from "react";
import { MediaGallery as MediaGalleryRadix, WixMediaImage } from "@wix/headless-media/react";

export const Root: React.FC<React.ComponentProps<typeof MediaGalleryRadix.Root>> = (props) => (
  <MediaGalleryRadix.Root {...props} />
);

export const Viewport: React.FC = () => (
  <MediaGalleryRadix.Viewport>
    {({ src, alt }: { src: string | null; alt: string }) => (
      <>
        {src ? (
          <WixMediaImage media={{ image: src }} alt={alt} className="w-full h-full object-cover" />
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
  </MediaGalleryRadix.Viewport>
);

export const Indicator: React.FC = () => (
  <MediaGalleryRadix.Indicator>
    {({ current, total }: { current: number; total: number }) => (
      <div className="absolute bottom-4 right-4 bg-surface-tooltip text-nav px-3 py-1 rounded-full text-sm">
        {current} / {total}
      </div>
    )}
  </MediaGalleryRadix.Indicator>
);

export const Previous: React.FC<React.ComponentProps<typeof MediaGalleryRadix.Previous>> = ({ children, ...props }) => (
  <MediaGalleryRadix.Previous asChild {...props}>
    <button className="absolute left-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full transition-all">
      {children ?? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      )}
    </button>
  </MediaGalleryRadix.Previous>
);

export const Next: React.FC<React.ComponentProps<typeof MediaGalleryRadix.Next>> = ({ children, ...props }) => (
  <MediaGalleryRadix.Next asChild {...props}>
    <button className="absolute right-4 top-1/2 -translate-y-1/2 btn-nav p-2 rounded-full transition-all">
      {children ?? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  </MediaGalleryRadix.Next>
);

export const Thumbnails: React.FC<React.ComponentProps<typeof MediaGalleryRadix.Thumbnails>> = ({ children, ...props }) => (
  <MediaGalleryRadix.Thumbnails {...props}>{children}</MediaGalleryRadix.Thumbnails>
);

export const ThumbnailRepeater: React.FC<React.ComponentProps<typeof MediaGalleryRadix.ThumbnailRepeater>> = ({ children, ...props }) => (
  <div className="grid grid-cols-4 gap-4">
    <MediaGalleryRadix.ThumbnailRepeater {...props}>{children}</MediaGalleryRadix.ThumbnailRepeater>
  </div>
);

export const ThumbnailItem: React.FC<React.ComponentProps<typeof MediaGalleryRadix.ThumbnailItem>> = (props) => (
  <MediaGalleryRadix.ThumbnailItem {...props}>
    {({ src, isActive, select, alt }: { src: string | null; isActive: boolean; select: () => void; alt: string }) => (
      <div
        onClick={select}
        className={`aspect-square bg-surface-primary rounded-lg border cursor-pointer transition-all ${isActive
          ? 'border-brand-medium ring-2 ring-brand-light'
          : 'border-brand-subtle hover:border-brand-light'
          }`}
      >
        {src ? (
          <WixMediaImage media={{ image: src }} alt={alt} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-6 h-6 text-content-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
    )}
  </MediaGalleryRadix.ThumbnailItem>
);

