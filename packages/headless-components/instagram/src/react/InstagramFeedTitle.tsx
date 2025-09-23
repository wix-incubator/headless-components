import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';

/**
 * Props for InstagramFeed Title component
 */
export interface TitleProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ title: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Custom title text (defaults to "Instagram Feed") */
  title?: string;
}

/**
 * Displays the Instagram feed title.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InstagramFeed.Title className="text-2xl font-bold mb-4" />
 *
 * // Custom title
 * <InstagramFeed.Title title="Latest Posts" />
 *
 * // Using AsChild pattern for custom elements
 * <InstagramFeed.Title asChild>
 *   {({ title }) => (
 *     <h1 className="custom-title">{title}</h1>
 *   )}
 * </InstagramFeed.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      title = 'Instagram Feed',
      ...otherProps
    } = props;

    const data = { title };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={data}
        content={title}
        data-testid="instagram-feed-title"
        {...otherProps}
      >
        <h2>{title}</h2>
      </AsChildSlot>
    );
  },
);
