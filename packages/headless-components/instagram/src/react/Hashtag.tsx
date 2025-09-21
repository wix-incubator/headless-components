import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

export interface HashtagProps {
  asChild?: boolean;
  children?: AsChildChildren<{ hashtag: string }>;
  className?: string;
}

export const Hashtag = React.forwardRef<HTMLElement, HashtagProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();

  const hashtag = feedData.account?.instagramInfo?.instagramUsername;
  if (!hashtag) return null;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      customElement={children}
      customElementProps={{ hashtag }}
      content={`#${hashtag}`}
      {...otherProps}
    >
      <span>#{hashtag}</span>
    </AsChildSlot>
  );
});


