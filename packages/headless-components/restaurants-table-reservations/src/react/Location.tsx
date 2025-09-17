import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreLocation from './core/Location.js';
import type { ReservationLocation } from '../services/index.js';

/**
 * Props for Location Root component
 */
export interface RootProps {
  /** Child components that will have access to the location context */
  children: React.ReactNode;
  /** Location data */
  location: ReservationLocation;
  /** Whether this location is currently selected */
  isSelected: boolean;
  /** Function to select this location */
  selectLocation: () => void;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root component that provides location context to its children.
 * This component sets up the necessary context for managing location selection.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Location } from './core';
 *
 * function LocationCard({ location, isSelected, onSelect }) {
 *   return (
 *     <Location.Root
 *       location={location}
 *       isSelected={isSelected}
 *       selectLocation={onSelect}
 *     >
 *       <Location.Name className="text-lg font-medium" />
 *       <Location.Action.Select className="px-4 py-2 border rounded-lg" />
 *     </Location.Root>
 *   );
 * }
 *
 * // asChild usage
 * <Location.Root asChild location={location} isSelected={isSelected} selectLocation={onSelect}>
 *   <div className="location-card">
 *     <Location.Name />
 *     <Location.Action.Select />
 *   </div>
 * </Location.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { asChild, className, children, ...otherProps } = props;

  return (
    <CoreLocation.Root {...otherProps}>
      <AsChildSlot ref={ref} asChild={asChild} className={className}>
        {children}
      </AsChildSlot>
    </CoreLocation.Root>
  );
});

/**
 * Props for Location Name component
 */
export interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the location name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Location.Name className="text-lg font-medium" />
 *
 * // asChild with primitive
 * <Location.Name asChild>
 *   <h3 className="text-lg font-medium" />
 * </Location.Name>
 *
 * // asChild with react component
 * <Location.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-medium">
 *       {name}
 *     </h3>
 *   ))}
 * </Location.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreLocation.Name>
      {({ name }) => {
        console.log('name', name);
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            customElementProps={{ name }}
            content={name}
            {...otherProps}
          >
            <div>{name}</div>
          </AsChildSlot>
        );
      }}
    </CoreLocation.Name>
  );
});

/**
 * Props for Location Action Select component
 */
export interface ActionSelectProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    onClick: () => void;
    isSelected: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Label for the select button */
  label?: React.ReactNode;
}

/**
 * Action component for selecting a location with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Location.Action.Select className="px-4 py-2 border rounded-lg data-[selected]:bg-primary data-[selected]:text-primary-foreground" />
 *
 * // asChild with primitive
 * <Location.Action.Select asChild>
 *   <button className="location-select-button" />
 * </Location.Action.Select>
 *
 * // asChild with react component
 * <Location.Action.Select asChild>
 *   {React.forwardRef(({onClick, isSelected, ...props}, ref) => (
 *     <button
 *       ref={ref}
 *       {...props}
 *       onClick={onClick}
 *       className={`location-button ${isSelected ? 'selected' : ''}`}
 *     >
 *       {isSelected ? 'Selected' : 'Select'}
 *     </button>
 *   ))}
 * </Location.Action.Select>
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
    label = 'Select Location',
    ...otherProps
  } = props;

  return (
    <CoreLocation.Action.Select>
      {({ onClick, isSelected }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-selected={isSelected}
            customElement={children}
            customElementProps={{
              onClick,
              isSelected,
            }}
            content={label}
            {...otherProps}
          >
            <button onClick={onClick}>{label}</button>
          </AsChildSlot>
        );
      }}
    </CoreLocation.Action.Select>
  );
});

/**
 * Action namespace containing location action components
 * following the compound component pattern: Location.Action.Select
 */
export const Action = {
  /** Location selection action component */
  Select: ActionSelect,
} as const;
