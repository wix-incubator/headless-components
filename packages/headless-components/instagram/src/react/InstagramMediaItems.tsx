import React from 'react';
import * as CoreInstagramMedias from './core/InstagramMedias.js';

/**
 * @deprecated Use `InstagramFeed.InstagramMedias` with `InstagramFeed.InstagramMediaRepeater` directly.
 * This component will be removed in a future release.
 */
export interface InstagramMediaItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * @deprecated Use `InstagramFeed.InstagramMedias` with `InstagramFeed.InstagramMediaRepeater` directly.
 * List container previously used to gate empty state. Prefer handling empty state on InstagramMedias.
 */
export const InstagramMediaItems = React.forwardRef<
  HTMLDivElement,
  InstagramMediaItemsProps
>((props, ref) => {
  const { children, emptyState } = props;

  return (
    <CoreInstagramMedias.InstagramMedias>
      {({ hasItems }) => {
        if (!hasItems) return emptyState ?? null;

        return <div ref={ref}>{children}</div>;
      }}
    </CoreInstagramMedias.InstagramMedias>
  );
});
