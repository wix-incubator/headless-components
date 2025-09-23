import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreInstagramFeed from './core/InstagramFeed.js';

/**
 * Props for InstagramFeed Hashtag component
 */
export interface HashtagProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ hashtag: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the Instagram feed hashtag.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InstagramFeed.Hashtag className="text-blue-500" />
 *
 * // Using AsChild pattern for custom elements
 * <InstagramFeed.Hashtag asChild>
 *   {({ hashtag }) => (
 *     <a href={`https://instagram.com/explore/tags/${hashtag}`} className="hashtag-link">
 *       #{hashtag}
 *     </a>
 *   )}
 * </InstagramFeed.Hashtag>
 * ```
 */
export const Hashtag = React.forwardRef<HTMLSpanElement, HashtagProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    // Use render prop from core to get hashtag data
    return (
      <CoreInstagramFeed.Hashtag>
        {({ hashtag }) => {
          const data = { hashtag };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              customElement={children}
              customElementProps={data}
              content={hashtag ? `#${hashtag}` : ''}
              data-testid="instagram-feed-hashtag"
              {...otherProps}
            >
              <span>{hashtag ? `#${hashtag}` : ''}</span>
            </AsChildSlot>
          );
        }}
      </CoreInstagramFeed.Hashtag>
    );
  },
);
