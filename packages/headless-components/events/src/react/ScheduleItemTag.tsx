import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreTag from './core/ScheduleItemTag.js';

enum TestIds {
  scheduleItemTagRoot = 'schedule-item-tag-root',
  scheduleItemTagLabel = 'schedule-item-tag-label',
  scheduleItemTagButton = 'schedule-item-tag-button',
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
 * Must be used as the top-level ScheduleItemTag component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ScheduleItemTag } from '@wix/events/components';
 *
 * function TagComponent({ tag }) {
 *   return (
 *     <ScheduleItemTag.Root tag={tag}>
 *       <ScheduleItemTag.Label />
 *     </ScheduleItemTag.Root>
 *   );
 * }
 *
 * // For interactive tags
 * function InteractiveTagComponent({ tag }) {
 *   return (
 *     <ScheduleItemTag.Root tag={tag}>
 *       <ScheduleItemTag.Button />
 *     </ScheduleItemTag.Root>
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
        data-testid={TestIds.scheduleItemTagRoot}
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
  children?: AsChildChildren<{ tag: string }>;
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
 * <ScheduleItemTag.Label className="px-2 py-1 bg-gray-100 rounded" />
 *
 * // asChild with primitive
 * <ScheduleItemTag.Label asChild>
 *   <span className="px-2 py-1 bg-gray-100 rounded" />
 * </ScheduleItemTag.Label>
 *
 * // asChild with react component
 * <ScheduleItemTag.Label asChild>
 *   {React.forwardRef(({ tag, ...props }, ref) => (
 *     <span ref={ref} {...props} className="px-2 py-1 bg-gray-100 rounded">
 *       {tag}
 *     </span>
 *   ))}
 * </ScheduleItemTag.Label>
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
          data-testid={TestIds.scheduleItemTagLabel}
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
  children?: AsChildChildren<{
    tag: string;
    toggleTagFilter: () => void;
    active: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the tag as an interactive button element.
 * Use this for interactive tags like filters or selectable options.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleItemTag.Button
 *   className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
 * />
 *
 * // asChild with primitive
 * <ScheduleItemTag.Button asChild>
 *   <button className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200" />
 * </ScheduleItemTag.Button>
 *
 * // asChild with react component
 * <ScheduleItemTag.Button asChild>
 *   {React.forwardRef(({ tag, toggleTagFilter, active, ...props }, ref) => (
 *     <button ref={ref} onClick={toggleTagFilter} data-active={active} {...props} className="px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
 *       {tag}
 *     </button>
 *   ))}
 * </ScheduleItemTag.Button>
 * ```
 */
export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTag.Tag>
        {({ tag, toggleTagFilter, active }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleItemTagButton}
            customElement={children}
            customElementProps={{ tag, toggleTagFilter, active }}
            content={tag}
            onClick={toggleTagFilter}
            data-active={active}
            {...otherProps}
          >
            <button>{tag}</button>
          </AsChildSlot>
        )}
      </CoreTag.Tag>
    );
  },
);
