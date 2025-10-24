import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreTimeSlot from './core/TimeSlot.js';
import type { TimeSlot } from '../services/index.js';

/**
 * Props for TimeSlot Root component
 */
export interface RootProps {
  /** Child components that will have access to the time slot context */
  children: React.ReactNode;
  /** Time slot data */
  timeSlot: TimeSlot;
  /** Whether this time slot is currently selected */
  isSelected: boolean;
  /** Function to select this time slot */
  selectTimeSlot: () => void;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root component that provides time slot context to its children.
 * This component sets up the necessary context for managing time slot selection.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { TimeSlot } from './core';
 *
 * function TimeSlotCard({ timeSlot, isSelected, onSelect }) {
 *   return (
 *     <TimeSlot.Root
 *       timeSlot={timeSlot}
 *       isSelected={isSelected}
 *       selectTimeSlot={onSelect}
 *     >
 *       <TimeSlot.Time className="text-lg font-medium" />
 *       <TimeSlot.Action.Select className="px-4 py-2 border rounded-lg" />
 *     </TimeSlot.Root>
 *   );
 * }
 *
 * // asChild usage
 * <TimeSlot.Root asChild timeSlot={timeSlot} isSelected={isSelected} selectTimeSlot={onSelect}>
 *   <div className="time-slot-card">
 *     <TimeSlot.Time />
 *     <TimeSlot.Action.Select />
 *   </div>
 * </TimeSlot.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { asChild, className, children, ...otherProps } = props;

  return (
    <CoreTimeSlot.Root {...otherProps}>
      <AsChildSlot ref={ref} asChild={asChild} className={className}>
        {children}
      </AsChildSlot>
    </CoreTimeSlot.Root>
  );
});

/**
 * Props for TimeSlot Time component
 */
export interface TimeProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ time: Date }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the time slot time with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TimeSlot.Time className="text-lg font-medium" />
 *
 * // asChild with primitive
 * <TimeSlot.Time asChild>
 *   <span className="text-lg font-medium" />
 * </TimeSlot.Time>
 *
 * // asChild with react component
 * <TimeSlot.Time asChild>
 *   {React.forwardRef(({time, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-medium">
 *       {time.toLocaleTimeString()}
 *     </span>
 *   ))}
 * </TimeSlot.Time>
 * ```
 */
export const Time = React.forwardRef<HTMLElement, TimeProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreTimeSlot.Time>
      {({ time: coreTime }) => {
        const time = new Date(coreTime);
        const formattedTime = time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            customElementProps={{ time }}
            content={formattedTime}
            {...otherProps}
          >
            <div>{formattedTime}</div>
          </AsChildSlot>
        );
      }}
    </CoreTimeSlot.Time>
  );
});

/**
 * Props for TimeSlot Action Select component
 */
export interface ActionSelectProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    onClick: () => void;
    isSelected: boolean;
    status: TimeSlot['status'];
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Label for the select button */
  label?: string;
}

/**
 * Action component for selecting a time slot with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TimeSlot.Action.Select className="px-4 py-2 border rounded-lg data-[selected]:bg-primary data-[selected]:text-primary-foreground" />
 *
 * // asChild with primitive
 * <TimeSlot.Action.Select asChild>
 *   <button className="time-slot-select-button" />
 * </TimeSlot.Action.Select>
 *
 * // asChild with react component
 * <TimeSlot.Action.Select asChild>
 *   {React.forwardRef(({onClick, isSelected, ...props}, ref) => (
 *     <button
 *       ref={ref}
 *       {...props}
 *       onClick={onClick}
 *       className={`time-slot-button ${isSelected ? 'selected' : ''}`}
 *     >
 *       {isSelected ? 'Selected' : 'Select'}
 *     </button>
 *   ))}
 * </TimeSlot.Action.Select>
 * ```
 */
export const ActionSelect = React.forwardRef<
  HTMLButtonElement,
  ActionSelectProps
>((props, ref) => {
  const {
    asChild,
    children,
    className,
    label = 'Select Time Slot',
    ...otherProps
  } = props;

  return (
    <CoreTimeSlot.Action.Select>
      {({ onClick, isSelected, status }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-selected={isSelected}
            data-status={status}
            customElement={children}
            customElementProps={{
              onClick,
              isSelected,
              status,
            }}
            content={label}
            {...otherProps}
          >
            <button onClick={onClick} disabled={status !== 'AVAILABLE'}>
              {label}
            </button>
          </AsChildSlot>
        );
      }}
    </CoreTimeSlot.Action.Select>
  );
});

/**
 * Action namespace containing time slot action components
 * following the compound component pattern: TimeSlot.Action.Select
 */
export const Action = {
  /** Time slot selection action component */
  Select: ActionSelect,
} as const;
