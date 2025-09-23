import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreInstagramFeed from './core/InstagramFeed.js';

enum TestIds {
  instagramFeedHashtag = 'instagram-feed-hashtag',
}

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
 * Displays the Instagram hashtag.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InstagramFeed.Hashtag className="text-blue-600 font-medium" />
 *
 * // asChild with custom rendering
 * <InstagramFeed.Hashtag asChild>
 *   {React.forwardRef(({ hashtag, ...props }, ref) => (
 *     <span ref={ref} {...props} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
 *       {hashtag}
 *     </span>
 *   ))}
 * </InstagramFeed.Hashtag>
 * ```
 */
export const Hashtag = React.forwardRef<HTMLElement, HashtagProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreInstagramFeed.Hashtag>
        {({ hashtag }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramFeedHashtag}
            customElement={children}
            customElementProps={{ hashtag }}
            content={hashtag}
            {...otherProps}
          >
            <span>{hashtag}</span>
          </AsChildSlot>
        )}
      </CoreInstagramFeed.Hashtag>
    );
  },
);
