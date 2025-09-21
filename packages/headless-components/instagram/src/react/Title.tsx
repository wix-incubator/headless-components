import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';

export interface TitleProps {
  asChild?: boolean;
  children?: AsChildChildren<{ title: string }>;
  className?: string;
  title?: string;
}

export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, className, title = 'Instagram Feed', ...otherProps } = props;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      customElement={children}
      customElementProps={{ title }}
      content={title}
      {...otherProps}
    >
      <h2>{title}</h2>
    </AsChildSlot>
  );
});


