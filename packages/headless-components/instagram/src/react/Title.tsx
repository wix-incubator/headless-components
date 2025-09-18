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
 * // asChild with custom rendering
 * <InstagramFeed.Title asChild>
 *   {React.forwardRef(({ title, ...props }, ref) => (
 *     <h2 ref={ref} {...props} className="text-2xl font-bold">
 *       📷 {title}
 *     </h2>
 *   ))}
 * </InstagramFeed.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    title = 'Instagram Feed',
    ...otherProps
  } = props;

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
