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
  tagText = 'tag-text',
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
 *       <Tag.Text />
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
 * Props for the Tag Text component.
 */
export interface TextProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ text: string; index: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the tag text with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Tag.Text className="px-2 py-1 bg-gray-100 rounded" />
 *
 * // asChild with primitive
 * <Tag.Text asChild>
 *   <span className="px-2 py-1 bg-gray-100 rounded" />
 * </Tag.Text>
 *
 * // asChild with react component
 * <Tag.Text asChild>
 *   {React.forwardRef(({ text, index, ...props }, ref) => (
 *     <span ref={ref} {...props} className="px-2 py-1 bg-gray-100 rounded">
 *       {text}
 *     </span>
 *   ))}
 * </Tag.Text>
 * ```
 */
export const Text = React.forwardRef<HTMLElement, TextProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const { value, index } = useTagContext();

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.tagText}
      customElement={children}
      customElementProps={{ text: value, index }}
      content={value}
      {...otherProps}
    >
      <span>{value}</span>
    </AsChildSlot>
  );
});
