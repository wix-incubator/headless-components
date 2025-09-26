import type { tags } from '@wix/blog';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { useTagRepeaterContext } from './Post.js';

const enum TestIds {
  blogTagLabel = 'blog-tag-label',
}

export interface LabelProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ tag: tags.BlogTag }> | React.ReactNode;
}

export const Label = React.forwardRef<HTMLElement, LabelProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { tag } = useTagRepeaterContext();

  if (!tag?.label) return null;

  const attributes = {
    'data-testid': TestIds.blogTagLabel,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ tag }}
      content={tag.label}
    >
      <span>{tag.label}</span>
    </AsChildSlot>
  );
});

Label.displayName = 'Blog.Tag.Label';
