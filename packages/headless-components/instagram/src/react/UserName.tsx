import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

/**
 * Props for InstagramFeed UserName component
 */
export interface UserNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    username: string;
    displayName?: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the Instagram username and display name.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InstagramFeed.UserName className="text-lg font-medium" />
 *
 * // asChild with custom rendering
 * <InstagramFeed.UserName asChild>
 *   {React.forwardRef(({ username, displayName, ...props }, ref) => (
 *     <div ref={ref} {...props} className="flex items-center gap-2">
 *       <span>@{username}</span>
 *       {displayName && <span>• {displayName}</span>}
 *     </div>
 *   ))}
 * </InstagramFeed.UserName>
 * ```
 */
export const UserName = React.forwardRef<HTMLElement, UserNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const instagramFeedService = useService(InstagramFeedServiceDefinition);
    const feedData = instagramFeedService.feedData.get();

    const displayValue = `@${feedData.account?.instagramInfo?.instagramUsername || 'unknown'}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={{
          username:
            feedData.account?.instagramInfo?.instagramUsername || 'unknown',
          displayName: feedData.account?.instagramInfo?.instagramUsername,
        }}
        content={displayValue}
        {...otherProps}
      >
        <span>{displayValue}</span>
      </AsChildSlot>
    );
  },
);
