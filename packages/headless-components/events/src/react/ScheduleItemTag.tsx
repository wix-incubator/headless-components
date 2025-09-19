import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreTag from './core/ScheduleItemTag.js';

enum TestIds {
  tagRoot = 'tag-root',
  tagLabel = 'tag-label',
  tagButton = 'tag-button',
}

/**
 * Props for the Tag Root component.
 */
export interface RootProps {
  /** Tag data */
  tag: string;
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
 *
 * // For interactive tags
 * function InteractiveTagComponent({ tag, onClick, active }) {
 *   return (
 *     <Tag.Root tag={tag}>
 *       <Tag.Button onClick={onClick} active={active} />
 *     </Tag.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { tag, asChild, children, className, ...otherProps } = props;

  return (
    <CoreTag.Root tag={tag}>
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
    </CoreTag.Root>
  );
});

/**
 * Props for the Tag Label component.
 */
export interface LabelProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ text: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the tag label as a simple span element.
 * Use this for non-interactive tag display.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Tag.Label className="px-2 py-1 bg-gray-100 rounded" />
 *
 * // asChild with primitive
 * <Tag.Label asChild>
 *   <span className="px-2 py-1 bg-gray-100 rounded" />
 * </Tag.Label>
 *
 * // asChild with react component
 * <Tag.Label asChild>
 *   {React.forwardRef(({ text, ...props }, ref) => (
 *     <span ref={ref} {...props} className="px-2 py-1 bg-gray-100 rounded">
 *       {text}
 *     </span>
 *   ))}
 * </Tag.Label>
 * ```
 */
export const Label = React.forwardRef<HTMLElement, LabelProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreTag.Tag>
      {({ tag }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.tagLabel}
          customElement={children}
          customElementProps={{ tag }}
          content={tag}
          {...otherProps}
        >
          <span>{tag}</span>
        </AsChildSlot>
      )}
    </CoreTag.Tag>
  );
});

/**
 * Props for the Tag Button component.
 */
export interface ButtonProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ text: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Click handler for the button */
  onClick?: () => void;
  /** Whether the tag is in an active/selected state */
  active?: boolean;
}

/**
 * Displays the tag as an interactive button element.
 * Use this for interactive tags like filters or selectable options.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Tag.Button
 *   className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
 *   onClick={handleClick}
 *   active={isSelected}
 * />
 *
 * // asChild with primitive
 * <Tag.Button asChild onClick={handleClick} active={isSelected}>
 *   <button className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200" />
 * </Tag.Button>
 *
 * // asChild with react component
 * <Tag.Button asChild onClick={handleClick} active={isSelected}>
 *   {React.forwardRef(({ text, ...props }, ref) => (
 *     <button ref={ref} {...props} className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
 *       {text}
 *     </button>
 *   ))}
 * </Tag.Button>
 * ```
 */
export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (props, ref) => {
    const { asChild, children, className, onClick, active, ...otherProps } =
      props;

    return (
      <CoreTag.Tag>
        {({ tag }) => {
          const handleClick = onClick ? () => onClick() : undefined;

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.tagButton}
              customElement={children}
              customElementProps={{ tag }}
              content={tag}
              onClick={handleClick}
              data-active={active}
              {...otherProps}
            >
              <button onClick={handleClick} data-active={active}>
                {tag}
              </button>
            </AsChildSlot>
          );
        }}
      </CoreTag.Tag>
    );
  },
);
