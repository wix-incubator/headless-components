import React from 'react';
import * as CoreInstagramMedias from './core/InstagramMedias.js';

export interface InstagramMediasProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for Instagram media items list.
 * Renders nothing (or emptyState) when there are no media items.
 */
export const InstagramMedias = React.forwardRef<
  HTMLDivElement,
  InstagramMediasProps
>((props, ref) => {
  const { children, emptyState } = props;

  return (
    <CoreInstagramMedias.InstagramMedias>
      {({ hasItems }) => {
        if (!hasItems) {
          return emptyState || null;
        }

        return <div ref={ref}>{children}</div>;
      }}
    </CoreInstagramMedias.InstagramMedias>
  );
});
