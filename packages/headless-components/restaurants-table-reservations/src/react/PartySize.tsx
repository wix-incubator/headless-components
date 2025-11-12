import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CorePartySize from './core/PartySize.js';

/**
 * Props for PartySize Root component
 */
export interface RootProps {
  /** Child components that will have access to the party size context */
  children: React.ReactNode;
  /** Party size value */
  partySize: number;
  /** Whether this party size is currently selected */
  isSelected: boolean;
  /** Function to select this party size */
  selectPartySize: () => void;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root component that provides party size context to its children.
 * This component sets up the necessary context for managing party size selection.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { PartySize } from './core';
 *
 * function PartySizeCard({ partySize, isSelected, onSelect }) {
 *   return (
 *     <PartySize.Root
 *       partySize={partySize}
 *       isSelected={isSelected}
 *       selectPartySize={onSelect}
 *     >
 *       <PartySize.Size className="text-lg font-medium" />
 *       <PartySize.Action.Select className="px-4 py-2 border rounded-lg" />
 *     </PartySize.Root>
 *   );
 * }
 *
 * // asChild usage
 * <PartySize.Root asChild partySize={partySize} isSelected={isSelected} selectPartySize={onSelect}>
 *   <div className="party-size-card">
 *     <PartySize.Size />
 *     <PartySize.Action.Select />
 *   </div>
 * </PartySize.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { asChild, className, children, ...otherProps } = props;

  return (
    <CorePartySize.Root {...otherProps}>
      <AsChildSlot ref={ref} asChild={asChild} className={className}>
        {children}
      </AsChildSlot>
    </CorePartySize.Root>
  );
});

/**
 * Props for PartySize Size component
 */
export interface SizeProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ size: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the party size with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PartySize.Size className="text-lg font-medium" />
 *
 * // asChild with primitive
 * <PartySize.Size asChild>
 *   <span className="text-lg font-medium" />
 * </PartySize.Size>
 *
 * // asChild with react component
 * <PartySize.Size asChild>
 *   {React.forwardRef(({size, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-medium">
 *       {size} people
 *     </span>
 *   ))}
 * </PartySize.Size>
 * ```
 */
export const Size = React.forwardRef<HTMLElement, SizeProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CorePartySize.Size>
      {({ size }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            customElementProps={{ size }}
            content={size}
            {...otherProps}
          >
            <div>{size}</div>
          </AsChildSlot>
        );
      }}
    </CorePartySize.Size>
  );
});

/**
 * Props for PartySize Action Select component
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
 * Action component for selecting a party size with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <PartySize.Action.Select className="px-4 py-2 border rounded-lg data-[selected]:bg-primary data-[selected]:text-primary-foreground" />
 *
 * // asChild with primitive
 * <PartySize.Action.Select asChild>
 *   <button className="party-size-select-button" />
 * </PartySize.Action.Select>
 *
 * // asChild with react component
 * <PartySize.Action.Select asChild>
 *   {React.forwardRef(({onClick, isSelected, ...props}, ref) => (
 *     <button
 *       ref={ref}
 *       {...props}
 *       onClick={onClick}
 *       className={`party-size-button ${isSelected ? 'selected' : ''}`}
 *     >
 *       {isSelected ? 'Selected' : 'Select'}
 *     </button>
 *   ))}
 * </PartySize.Action.Select>
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
    label = 'Select',
    ...otherProps
  } = props;

  return (
    <CorePartySize.Action.Select>
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
    </CorePartySize.Action.Select>
  );
});

/**
 * Action namespace containing party size action components
 * following the compound component pattern: PartySize.Action.Select
 */
export const Action = {
  /** Party size selection action component */
  Select: ActionSelect,
} as const;
