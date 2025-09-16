import React from 'react';

/**
 * Props for InstagramFeed GalleryItem component
 */
export interface GalleryItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Individual gallery item wrapper.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.GalleryItem className="rounded-lg overflow-hidden">
 *   <InstagramFeed.Media />
 * </InstagramFeed.GalleryItem>
 * ```
 */
export const GalleryItem = React.forwardRef<HTMLDivElement, GalleryItemProps>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;

    return (
      <div className={className} ref={ref} {...otherProps}>
        {children}
      </div>
    );
  },
);
