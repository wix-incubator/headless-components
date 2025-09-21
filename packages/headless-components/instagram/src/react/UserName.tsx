import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

export interface UserNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ username: string; displayName?: string }>;
  className?: string;
}

export const UserName = React.forwardRef<HTMLElement, UserNameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();

  const username = feedData.account?.instagramInfo?.instagramUsername || 'unknown';
  const displayValue = `@${username}`;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      customElement={children}
      customElementProps={{ username, displayName: username }}
      content={displayValue}
      {...otherProps}
    >
      <span>{displayValue}</span>
    </AsChildSlot>
  );
});


