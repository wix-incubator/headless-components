import React from 'react';
import { TestIds } from './types.js';

/**
 * Props for InstagramFeed Header component
 */
export interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Header section for Instagram feed containing title, username, hashtag, etc.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.Header className="mb-6">
 *   <InstagramFeed.Title />
 *   <InstagramFeed.UserName />
 *   <InstagramFeed.Hashtag />
 * </InstagramFeed.Header>
 * ```
 */
export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;

    const attributes = {
      'data-testid': TestIds.instagramFeedHeader,
      className,
      ...otherProps,
    };

    return (
      <header {...attributes} ref={ref}>
        {children}
      </header>
    );
  },
);
