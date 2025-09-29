import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import { type EventServiceConfig } from '../services/event-service.js';
import { type TicketDefinitionListServiceConfig } from '../services/ticket-definition-list-service.js';
import { type TicketDefinition as TicketDefinitionType } from '../services/ticket-definition-service.js';
import { type CheckoutServiceConfig } from '../services/checkout-service.js';
import * as TicketDefinition from './TicketDefinition.js';
import * as CoreTicketsPicker from './core/TicketsPicker.js';

enum TestIds {
  ticketsPickerTicketDefinitions = 'tickets-picker-ticket-definitions',
  ticketsPickerTotal = 'tickets-picker-total',
  ticketsPickerSubtotal = 'tickets-picker-subtotal',
  ticketsPickerTax = 'tickets-picker-tax',
  ticketsPickerFee = 'tickets-picker-fee',
  ticketsPickerCheckoutError = 'tickets-picker-checkout-error',
  ticketsPickerCheckoutTrigger = 'tickets-picker-checkout-trigger',
}

/**
 * Props for the TicketsPicker Root component.
 */
export interface RootProps {
  /** Child components */
  children: React.ReactNode;
  /** Event service configuration */
  eventServiceConfig: EventServiceConfig;
  /** Ticket definition list service configuration */
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
  /** Checkout service configuration */
  checkoutServiceConfig: CheckoutServiceConfig;
}

/**
 * Root container that provides necessary services context to all child components.
 * Must be used as the top-level component for tickets picker functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { TicketsPicker } from '@wix/events/components';
 *
 * function TicketsPickerComponent({ eventServiceConfig, ticketDefinitionListServiceConfig, checkoutServiceConfig }) {
 *   return (
 *     <TicketsPicker.Root
 *       eventServiceConfig={eventServiceConfig}
 *       ticketDefinitionListServiceConfig={ticketDefinitionListServiceConfig}
 *       checkoutServiceConfig={checkoutServiceConfig}
 *     >
 *       <TicketsPicker.TicketDefinitions>
 *         <TicketsPicker.TicketDefinitionRepeater>
 *           <TicketDefinition.Name />
 *           <TicketDefinition.Description />
 *           <TicketDefinition.FixedPricing />
 *           <TicketDefinition.GuestPricing />
 *           <TicketDefinition.PricingOptions>
 *             <TicketDefinition.PricingOptionRepeater>
 *               <PricingOption.Name />
 *               <PricingOption.Pricing />
 *               <PricingOption.Quantity />
 *             </TicketDefinition.PricingOptionRepeater>
 *           </TicketDefinition.PricingOptions>
 *           <TicketDefinition.Remaining />
 *           <TicketDefinition.SaleStartDate />
 *           <TicketDefinition.SaleEndDate />
 *           <TicketDefinition.Quantity />
 *         </TicketsPicker.TicketDefinitionRepeater>
 *       </TicketsPicker.TicketDefinitions>
 *     </TicketsPicker.Root>
 *   );
 * }
 * ```
 */
export const Root = (props: RootProps) => {
  const {
    children,
    eventServiceConfig,
    ticketDefinitionListServiceConfig,
    checkoutServiceConfig,
  } = props;

  return (
    <CoreTicketsPicker.Root
      eventServiceConfig={eventServiceConfig}
      ticketDefinitionListServiceConfig={ticketDefinitionListServiceConfig}
      checkoutServiceConfig={checkoutServiceConfig}
    >
      {children}
    </CoreTicketsPicker.Root>
  );
};

/**
 * Props for the TicketsPicker TicketDefinitions component.
 */
export interface TicketDefinitionsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{ ticketDefinitions: TicketDefinitionType[] }>;
  /** Empty state to display when no ticket definitions are available */
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
 *     <TicketDefinition.Description />
 *   </TicketsPicker.TicketDefinitionRepeater>
 * </TicketsPicker.TicketDefinitions>
 * ```
 */
export const TicketDefinitions = React.forwardRef<
  HTMLElement,
  TicketDefinitionsProps
>((props, ref) => {
  const { asChild, children, emptyState, className, ...otherProps } = props;

  return (
    <CoreTicketsPicker.TicketDefinitions>
      {({ ticketDefinitions, hasTicketDefinitions }) => {
        if (!hasTicketDefinitions) {
          return emptyState || null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketsPickerTicketDefinitions}
            customElement={children}
            customElementProps={{ ticketDefinitions }}
            {...otherProps}
          >
            <div>{children as React.ReactNode}</div>
          </AsChildSlot>
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
  /** CSS classes to apply to the ticket definition element */
  className?: string;
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
 *   <TicketDefinition.Description />
 * </TicketsPicker.TicketDefinitionRepeater>
 * ```
 */
export const TicketDefinitionRepeater = (
  props: TicketDefinitionRepeaterProps,
): React.ReactNode => {
  const { children, className } = props;

  return (
    <CoreTicketsPicker.TicketDefinitionRepeater>
      {({ ticketDefinitions }) => {
        return ticketDefinitions.map((ticketDefinition) => (
          <TicketDefinition.Root
            key={ticketDefinition._id}
            ticketDefinition={ticketDefinition}
            className={className}
          >
            {children}
          </TicketDefinition.Root>
        ));
      }}
    </CoreTicketsPicker.TicketDefinitionRepeater>
  );
};

/**
 * Props for the TicketsPicker Total component.
 */
export interface TotalProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    total: number;
    currency: string;
    formattedTotal: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the total amount.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketsPicker.Total className="text-gray-500" />
 *
 * // asChild with primitive
 * <TicketsPicker.Total asChild className="text-gray-500">
 *   <span />
 * </TicketsPicker.Total>
 *
 * // asChild with react component
 * <TicketsPicker.Total asChild className="text-gray-500">
 *   {React.forwardRef(({ total, currency, formattedTotal, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {formattedTotal}
 *     </span>
 *   ))}
 * </TicketsPicker.Total>
 * ```
 */
export const Total = React.forwardRef<HTMLElement, TotalProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreTicketsPicker.Total>
      {({ total, currency, formattedTotal }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketsPickerTotal}
            customElement={children}
            customElementProps={{ total, currency, formattedTotal }}
            content={formattedTotal}
            {...otherProps}
          >
            <span>{formattedTotal}</span>
          </AsChildSlot>
        );
      }}
    </CoreTicketsPicker.Total>
  );
});

/**
 * Props for the TicketsPicker Subtotal component.
 */
export interface SubtotalProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    subtotal: number;
    currency: string;
    formattedSubtotal: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the subtotal amount.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketsPicker.Subtotal className="text-gray-500" />
 *
 * // asChild with primitive
 * <TicketsPicker.Subtotal asChild className="text-gray-500">
 *   <span />
 * </TicketsPicker.Subtotal>
 *
 * // asChild with react component
 * <TicketsPicker.Subtotal asChild className="text-gray-500">
 *   {React.forwardRef(({ subtotal, currency, formattedSubtotal, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {formattedSubtotal}
 *     </span>
 *   ))}
 * </TicketsPicker.Subtotal>
 * ```
 */
export const Subtotal = React.forwardRef<HTMLElement, SubtotalProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreTicketsPicker.Subtotal>
        {({ subtotal, currency, formattedSubtotal }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.ticketsPickerSubtotal}
              customElement={children}
              customElementProps={{ subtotal, currency, formattedSubtotal }}
              content={formattedSubtotal}
              {...otherProps}
            >
              <span>{formattedSubtotal}</span>
            </AsChildSlot>
          );
        }}
      </CoreTicketsPicker.Subtotal>
    );
  },
);

/**
 * Props for the TicketsPicker Tax component.
 */
export interface TaxProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    name: string;
    rate: number;
    included: boolean;
    tax: number;
    currency: string;
    formattedTax: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the tax amount.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketsPicker.Tax className="text-gray-500" />
 *
 * // asChild with primitive
 * <TicketsPicker.Tax asChild className="text-gray-500">
 *   <span />
 * </TicketsPicker.Tax>
 *
 * // asChild with react component
 * <TicketsPicker.Tax asChild className="text-gray-500">
 *   {React.forwardRef(({ name, rate, included, tax, currency, formattedTax, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {formattedTax}
 *     </span>
 *   ))}
 * </TicketsPicker.Tax>
 * ```
 */
export const Tax = React.forwardRef<HTMLElement, TaxProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreTicketsPicker.Tax>
      {({ name, rate, included, tax, currency, formattedTax }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketsPickerTax}
            customElement={children}
            customElementProps={{
              name,
              rate,
              included,
              tax,
              currency,
              formattedTax,
            }}
            content={formattedTax}
            {...otherProps}
          >
            <span>{formattedTax}</span>
          </AsChildSlot>
        );
      }}
    </CoreTicketsPicker.Tax>
  );
});

/**
 * Props for the TicketsPicker Fee component.
 */
export interface FeeProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    rate: number;
    fee: number;
    currency: string;
    formattedFee: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the fee amount.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketsPicker.Fee className="text-gray-500" />
 *
 * // asChild with primitive
 * <TicketsPicker.Fee asChild className="text-gray-500">
 *   <span />
 * </TicketsPicker.Fee>
 *
 * // asChild with react component
 * <TicketsPicker.Fee asChild className="text-gray-500">
 *   {React.forwardRef(({ rate, fee, currency, formattedFee, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {formattedFee}
 *     </span>
 *   ))}
 * </TicketsPicker.Fee>
 * ```
 */
export const Fee = React.forwardRef<HTMLElement, FeeProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreTicketsPicker.Fee>
      {({ rate, fee, currency, formattedFee }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketsPickerFee}
            customElement={children}
            customElementProps={{ rate, fee, currency, formattedFee }}
            content={formattedFee}
            {...otherProps}
          >
            <span>{formattedFee}</span>
          </AsChildSlot>
        );
      }}
    </CoreTicketsPicker.Fee>
  );
});

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
    const { asChild, children, className, ...otherProps } = props;

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
              {...otherProps}
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
  const { asChild, children, className, label, ...otherProps } = props;

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
            {...otherProps}
          >
            <button>{label}</button>
          </AsChildSlot>
        );
      }}
    </CoreTicketsPicker.CheckoutTrigger>
  );
});
