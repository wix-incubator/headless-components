import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';

export interface Tag {
  value: string;
  index: number;
}

const TagContext = React.createContext<Tag | null>(null);

function useTagContext(): Tag {
  const context = React.useContext(TagContext);
  if (!context) {
    throw new Error('useTagContext must be used within a Tag.Root component');
  }
  return context;
}

enum TestIds {
  tagRoot = 'tag-root',
  tagLabel = 'tag-label',
}

/**
 * Props for the Tag Root component.
 */
export interface RootProps {
  /** Tag data */
  tag: Tag;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to the tag */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root container that provides tag context to all child components.
 * Must be used as the top-level Tag component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Tag } from '@wix/events/components';
 *
 * function TagComponent({ tag }) {
 *   return (
 *     <Tag.Root tag={tag}>
 *       <Tag.Label />
 *     </Tag.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { tag, asChild, children, className, ...otherProps } = props;

  return (
    <TagContext.Provider value={tag}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.tagRoot}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </TagContext.Provider>
  );
});

/**
 * Props for the Tag Label component.
 */
export interface LabelProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ text: string; index: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Click handler for interactive tags (e.g., filters) */
  onClick?: () => void;
  /** Whether the tag is in an active/selected state */
  active?: boolean;
}

/**
 * Displays the tag label with customizable rendering.
 * Supports both display and interactive modes for filtering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage (display mode)
 * <Tag.Label className="px-2 py-1 bg-gray-100 rounded" />
 *
 * // Interactive mode (for filtering)
 * <Tag.Label
 *   className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
 *   onClick={handleClick}
 *   active={isSelected}
 * />
 *
 * // asChild with primitive
 * <Tag.Label asChild>
 *   <span className="px-2 py-1 bg-gray-100 rounded" />
 * </Tag.Label>
 *
 * // asChild with react component
 * <Tag.Label asChild>
 *   {React.forwardRef(({ text, index, ...props }, ref) => (
 *     <span ref={ref} {...props} className="px-2 py-1 bg-gray-100 rounded">
 *       {text}
 *     </span>
 *   ))}
 * </Tag.Label>
 * ```
 */
export const Label = React.forwardRef<HTMLElement, LabelProps>((props, ref) => {
  const { asChild, children, className, onClick, active, ...otherProps } =
    props;
  const { value, index } = useTagContext();

  const handleClick = onClick ? () => onClick() : undefined;
  const interactive = !!onClick;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.tagLabel}
      customElement={children}
      customElementProps={{ text: value, index }}
      content={value}
      onClick={handleClick}
      data-active={active}
      data-interactive={interactive}
      {...otherProps}
    >
      {interactive ? (
        <button onClick={handleClick} data-active={active}>
          {value}
        </button>
      ) : (
        <span>{value}</span>
      )}
    </AsChildSlot>
  );
});
