import { type AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import * as CoreTag from './core/ScheduleItemTag.js';

enum TestIds {
  scheduleItemTagRoot = 'schedule-item-tag-root',
  scheduleItemTagLabel = 'schedule-item-tag-label',
  scheduleItemTagButton = 'schedule-item-tag-button',
}

/**
 * Props for the ScheduleItemTag Root component.
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
 * Root container that provides schedule item tag context to all child components.
 * Must be used as the top-level ScheduleItemTag component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ScheduleItemTag } from '@wix/events/components';
 *
 * function ScheduleItemTagComponent({ tag }) {
 *   return (
 *     <ScheduleItemTag.Root tag={tag}>
 *       <ScheduleItemTag.Label />
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
 * Props for the ScheduleItemTag Label component.
 */
export interface LabelProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Tag label */
    label: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the schedule item tag label.
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
 *   {React.forwardRef(({ label, ...props }, ref) => (
 *     <span ref={ref} {...props} className="px-2 py-1 bg-gray-100 rounded">
 *       {label}
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
          customElementProps={{ label: tag }}
          content={tag}
          {...otherProps}
        >
          <span>{tag}</span>
        </AsChildSlot>
      )}
    </CoreTag.Tag>
  );
});
