import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import { type EventServiceConfig } from '../services/event-service.js';
import { type TicketListServiceConfig } from '../services/ticket-list-service.js';
import * as TicketDefinition from './TicketDefinition.js';
import * as CoreTicketsPicker from './core/TicketsPicker.js';

enum TestIds {
  ticketsPickerRoot = 'tickets-picker-root',
  ticketsPickerTicketDefinitions = 'tickets-picker-ticket-definitions',
  ticketsPickerCheckoutError = 'tickets-picker-checkout-error',
  ticketsPickerCheckoutTrigger = 'tickets-picker-checkout-trigger',
}

/**
 * Props for the TicketsPicker Root component.
 */
export interface RootProps {
  /** Event service configuration */
  eventServiceConfig: EventServiceConfig;
  /** Ticket list service configuration */
  ticketListServiceConfig: TicketListServiceConfig;
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root component that provides the TicketList service context for rendering ticket definition lists.
 *
 * @component
 * @example
 * ```tsx
 * import { TicketsPicker } from '@wix/headless-events/react';
 *
 * function TicketsPickerComponent({ eventServiceConfig, ticketListServiceConfig }) {
 *   return (
 *     <TicketsPicker.Root eventServiceConfig={eventServiceConfig} ticketListServiceConfig={ticketListServiceConfig}>
 *       <TicketsPicker.TicketDefinitions>
 *         <TicketsPicker.TicketDefinitionRepeater>
 *           <TicketDefinition.Name />
 *           <TicketDefinition.Price />
 *         </TicketsPicker.TicketDefinitionRepeater>
 *       </TicketsPicker.TicketDefinitions>
 *     </TicketsPicker.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { eventServiceConfig, ticketListServiceConfig, children, className } =
    props;

  const attributes = {
    className,
    'data-testid': TestIds.ticketsPickerRoot,
  };

  return (
    <CoreTicketsPicker.Root
      eventServiceConfig={eventServiceConfig}
      ticketListServiceConfig={ticketListServiceConfig}
    >
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {children}
      </div>
    </CoreTicketsPicker.Root>
  );
});

/**
 * Props for the TicketsPicker TicketDefinitions component.
 */
export interface TicketDefinitionsProps {
  /** Child components */
  children: React.ReactNode;
  /** Empty state to display when no tickets are available */
  emptyState?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the ticket definition list with empty state support.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <TicketsPicker.TicketDefinitions emptyState={<div>No tickets found</div>}>
 *   <TicketsPicker.TicketDefinitionRepeater>
 *     <TicketDefinition.Name />
 *     <TicketDefinition.Price />
 *   </TicketsPicker.TicketDefinitionRepeater>
 * </TicketsPicker.TicketDefinitions>
 * ```
 */
export const TicketDefinitions = React.forwardRef<
  HTMLElement,
  TicketDefinitionsProps
>((props, ref) => {
  const { children, emptyState, className } = props;

  return (
    <CoreTicketsPicker.TicketDefinitions>
      {({ hasTicketDefinitions }) => {
        if (!hasTicketDefinitions) {
          return emptyState || null;
        }

        const attributes = {
          className,
          'data-testid': TestIds.ticketsPickerTicketDefinitions,
        };

        return (
          <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
            {children}
          </div>
        );
      }}
    </CoreTicketsPicker.TicketDefinitions>
  );
});

/**
 * Props for the TicketsPicker TicketDefinitionRepeater component.
 */
export interface TicketDefinitionRepeaterProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Repeater component that renders TicketDefinition.Root for each ticket definition.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <TicketsPicker.TicketDefinitionRepeater>
 *   <TicketDefinition.Name />
 *   <TicketDefinition.Price />
 * </TicketsPicker.TicketDefinitionRepeater>
 * ```
 */
export const TicketDefinitionRepeater = (
  props: TicketDefinitionRepeaterProps,
): React.ReactNode => {
  const { children } = props;

  return (
    <CoreTicketsPicker.TicketDefinitionRepeater>
      {({ ticketDefinitions, hasTicketDefinitions }) => {
        if (!hasTicketDefinitions) {
          return null;
        }

        return ticketDefinitions.map((ticketDefinition) => (
          <TicketDefinition.Root
            key={ticketDefinition._id}
            ticketDefinition={ticketDefinition}
          >
            {children}
          </TicketDefinition.Root>
        ));
      }}
    </CoreTicketsPicker.TicketDefinitionRepeater>
  );
};

/**
 * Props for the TicketsPicker CheckoutError component.
 */
export interface CheckoutErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ error: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays an error message when the checkout fails.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketsPicker.CheckoutError className="text-red-500" />
 *
 * // asChild with primitive
 * <TicketsPicker.CheckoutError asChild className="text-red-500">
 *   <span />
 * </TicketsPicker.CheckoutError>
 *
 * // asChild with react component
 * <TicketsPicker.CheckoutError asChild className="text-red-500">
 *   {React.forwardRef(({ error, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {error}
 *     </span>
 *   ))}
 * </TicketsPicker.CheckoutError>
 * ```
 */
export const CheckoutError = React.forwardRef<HTMLElement, CheckoutErrorProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <CoreTicketsPicker.CheckoutError>
        {({ error }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.ticketsPickerCheckoutError}
              customElement={children}
              customElementProps={{ error }}
              content={error}
            >
              <span>{error}</span>
            </AsChildSlot>
          );
        }}
      </CoreTicketsPicker.CheckoutError>
    );
  },
);

/**
 * Props for the TicketsPicker CheckoutTrigger component.
 */
export interface CheckoutTriggerProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    isLoading: boolean;
    error: string | null;
    hasSelectedTicketDefinitions: boolean;
    checkout: () => Promise<void>;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** The label to display inside the button */
  label?: string;
}

/**
 * Displays a button for checkout functionality.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketsPicker.CheckoutTrigger className="bg-blue-600 hover:bg-blue-700 text-white" label="Reserve" />
 *
 * // asChild with primitive
 * <TicketsPicker.CheckoutTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   <button>Reserve</button>
 * </TicketsPicker.CheckoutTrigger>
 *
 * // asChild with react component
 * <TicketsPicker.CheckoutTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   {React.forwardRef(({ isLoading, error, hasSelectedTicketDefinitions, checkout, ...props }, ref) => (
 *     <button ref={ref} {...props} onClick={checkout}>
 *       {isLoading ? 'Reserving...' : 'Reserve'}
 *     </button>
 *   ))}
 * </TicketsPicker.CheckoutTrigger>
 * ```
 */
export const CheckoutTrigger = React.forwardRef<
  HTMLElement,
  CheckoutTriggerProps
>((props, ref) => {
  const { asChild, children, className, label } = props;

  return (
    <CoreTicketsPicker.CheckoutTrigger>
      {({ isLoading, error, hasSelectedTicketDefinitions, checkout }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketsPickerCheckoutTrigger}
            data-in-progress={isLoading}
            disabled={isLoading}
            customElement={children}
            customElementProps={{
              isLoading,
              error,
              hasSelectedTicketDefinitions,
              checkout,
            }}
          >
            <button>{label}</button>
          </AsChildSlot>
        );
      }}
    </CoreTicketsPicker.CheckoutTrigger>
  );
});
