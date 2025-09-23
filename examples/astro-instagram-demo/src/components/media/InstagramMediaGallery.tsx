import React, { useState, useEffect } from 'react';
import { MediaGallery } from '@wix/headless-media/react';

interface ViewportProps extends React.ComponentProps<typeof MediaGallery.Viewport> {
  /** Optional click handler for expand mode */
  onImageClick?: () => void;
  /** Whether to show click affordance (cursor pointer, hover effects) */
  clickable?: boolean;
}

export const Viewport: React.FC<ViewportProps> = ({
  className,
  onImageClick,
  clickable = false,
  ...props
}) => {

  return (
    <MediaGallery.Viewport
      className={`w-full h-full flex items-center justify-center ${clickable ? 'cursor-pointer' : ''} ${className || ''}`}
      emptyState={
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 rounded-lg">
          <div className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg">
            <svg
              className="w-8 h-8 text-gray-700"
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
        </div>
      }
      asChild
      {...props}
    >
      {React.forwardRef<HTMLDivElement, { src: string; alt: string }>((imgProps, ref) => {
        return (
          <div
            ref={ref}
            className={`w-full h-full relative group ${clickable ? 'cursor-pointer' : ''}`}
            onClick={onImageClick}
          >
            <img
              src={imgProps.src}
              alt={imgProps.alt}
              className={`w-full h-full object-cover rounded-lg transition-transform ${
                clickable ? 'group-hover:scale-105' : ''
              }`}
            />

            {/* Expand icon overlay when clickable */}
            {clickable && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20 rounded-lg">
                <div className="bg-white bg-opacity-90 rounded-full p-2">
                  <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </MediaGallery.Viewport>
  );
};

export const Previous: React.FC<
  React.ComponentProps<typeof MediaGallery.Previous>
> = ({ ...props }) => (
  <MediaGallery.Previous
    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
    {...props}
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
  </MediaGallery.Previous>
);

export const Next: React.FC<
  React.ComponentProps<typeof MediaGallery.Next>
> = ({ ...props }) => (
  <MediaGallery.Next
    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
    {...props}
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
  </MediaGallery.Next>
);

export const Indicator: React.FC<
  React.ComponentProps<typeof MediaGallery.Indicator>
> = ({ className, ...props }) => (
  <MediaGallery.Indicator
    className={`absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs font-medium ${className || ''}`}
    {...props}
  />
);

// Expand Modal Component
interface ExpandModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItems: Array<{ image: string; altText: string }>;
  initialIndex?: number;
}

const ExpandModal: React.FC<ExpandModalProps> = ({
  isOpen,
  onClose,
  mediaItems,
  initialIndex = 0
}) => {
  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl z-10 p-2"
          aria-label="Close expanded view"
        >
          ×
        </button>

        {/* MediaGallery with navigation */}
        <MediaGallery.Root
          mediaGalleryServiceConfig={{
            media: mediaItems,
            infinite: true // Enable infinite loop
          }}
        >
          {/* Set initial index */}
          <InitialIndexSetter initialIndex={initialIndex} />

          {/* Main expanded image */}
          <div className="relative">
            <Viewport className="max-w-[85vw] max-h-[85vh]" />

            {/* Navigation controls */}
            <Previous className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white hover:bg-opacity-80" />
            <Next className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white hover:bg-opacity-80" />

            {/* Image counter */}
            {/* <Indicator className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm" /> */}
          </div>
        </MediaGallery.Root>
      </div>
    </div>
  );
};

// Helper component to set initial index
const InitialIndexSetter: React.FC<{ initialIndex: number }> = ({ initialIndex }) => {
  // This would need access to the MediaGallery service to set initial index
  // For now, we'll handle this externally
  return null;
};

// Hook to provide expand functionality
export const useExpandMode = (mediaItems: Array<{ image: string; altText: string }>) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandIndex, setExpandIndex] = useState(0);

  const expand = (index: number = 0) => {
    setExpandIndex(index);
    setIsExpanded(true);
  };

  const close = () => {
    setIsExpanded(false);
  };

  const ExpandModalComponent = () => (
    <ExpandModal
      isOpen={isExpanded}
      onClose={close}
      mediaItems={mediaItems}
      initialIndex={expandIndex}
    />
  );

  return {
    expand,
    close,
    isExpanded,
    ExpandModal: ExpandModalComponent
  };
};
