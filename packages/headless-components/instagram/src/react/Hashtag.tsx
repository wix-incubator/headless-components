import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';

export interface HashtagProps {
  asChild?: boolean;
  children?: AsChildChildren<{ hashtag: string }>;
  className?: string;
  hashtag?: string;
}

export const Hashtag = React.forwardRef<HTMLElement, HashtagProps>((props, ref) => {
  const { asChild, children, className, hashtag, ...otherProps } = props;

  if (!hashtag) return null;

  const formattedHashtag = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      customElement={children}
      customElementProps={{ hashtag }}
      content={formattedHashtag}
      {...otherProps}
    >
      <span>{formattedHashtag}</span>
    </AsChildSlot>
  );
});


