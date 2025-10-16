import { type AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type EventServiceConfig } from '../services/event-service.js';
import { type TicketDefinitionListServiceConfig } from '../services/ticket-definition-list-service.js';
import { type TicketDefinition as TicketDefinitionType } from '../services/ticket-definition-service.js';
import { type CheckoutServiceConfig } from '../services/checkout-service.js';
import * as TicketDefinition from './TicketDefinition.js';
import * as CoreTicketsPicker from './core/TicketsPicker.js';

enum TestIds {
  ticketsPickerTicketDefinitions = 'tickets-picker-ticket-definitions',
  ticketsPickerTotals = 'tickets-picker-totals',
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
      {({ ticketDefinitions }) =>
        ticketDefinitions.map((ticketDefinition) => (
          <TicketDefinition.Root
            key={ticketDefinition._id}
            ticketDefinition={ticketDefinition}
            className={className}
          >
            {children}
          </TicketDefinition.Root>
        ))
      }
    </CoreTicketsPicker.TicketDefinitionRepeater>
  );
};

/**
 * Props for the TicketsPicker Totals component.
 */
export interface TotalsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    total: number;
    subtotal: number;
    tax: number;
    fee: number;
    currency: string;
    formattedTotal: string;
    formattedSubtotal: string;
    formattedTax: string;
    formattedFee: string;
    taxName: string | null;
    taxRate: number | null;
    taxIncluded: boolean;
    feeRate: number;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Locale */
  locale?: Intl.LocalesArgument;
}

/**
 * Provides totals data for the tickets picker.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketsPicker.Totals className="text-gray-500" />
 *
 * // asChild with primitive
 * <TicketsPicker.Totals asChild className="text-gray-500">
 *   <span />
 * </TicketsPicker.Totals>
 *
 * // asChild with react component
 * <TicketsPicker.Totals asChild className="text-gray-500">
 *   {React.forwardRef(({total, subtotal, tax, fee, currency, formattedTotal, formattedSubtotal, formattedTax, formattedFee, taxName, taxRate, taxIncluded, feeRate, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       Subtotal: {formattedSubtotal}
 *       Tax: {formattedTax}
 *       Fee: {formattedFee}
 *       Total: {formattedTotal}
 *     </span>
 *   ))}
 * </TicketsPicker.Totals>
 * ```
 */
export const Totals = React.forwardRef<HTMLElement, TotalsProps>(
  (props, ref) => {
    const { asChild, children, className, locale, ...otherProps } = props;

    return (
      <CoreTicketsPicker.Totals locale={locale}>
        {({
          total,
          subtotal,
          tax,
          fee,
          currency,
          formattedTotal,
          formattedSubtotal,
          formattedTax,
          formattedFee,
          taxName,
          taxRate,
          taxIncluded,
          feeRate,
        }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.ticketsPickerTotals}
            customElement={children}
            customElementProps={{
              total,
              subtotal,
              tax,
              fee,
              currency,
              formattedTotal,
              formattedSubtotal,
              formattedTax,
              formattedFee,
              taxName,
              taxRate,
              taxIncluded,
              feeRate,
            }}
            content={formattedTotal}
            {...otherProps}
          >
            <span>{formattedTotal}</span>
          </AsChildSlot>
        )}
      </CoreTicketsPicker.Totals>
    );
  },
);

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
        {({ error }) => (
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
        )}
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
  label?: React.ReactNode;
  /** The loading state to display inside the button */
  loadingState?: React.ReactNode;
}

/**
 * Displays a button for checkout functionality.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <TicketsPicker.CheckoutTrigger className="bg-blue-600 hover:bg-blue-700 text-white" label="Checkout" loadingState="Processing..." />
 *
 * // asChild with primitive
 * <TicketsPicker.CheckoutTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   <button>Checkout</button>
 * </TicketsPicker.CheckoutTrigger>
 *
 * // asChild with react component
 * <TicketsPicker.CheckoutTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   {React.forwardRef(({ isLoading, error, hasSelectedTicketDefinitions, checkout, ...props }, ref) => (
 *     <button ref={ref} {...props}>
 *       {isLoading ? 'Processing...' : 'Checkout'}
 *     </button>
 *   ))}
 * </TicketsPicker.CheckoutTrigger>
 * ```
 */
export const CheckoutTrigger = React.forwardRef<
  HTMLElement,
  CheckoutTriggerProps
>((props, ref) => {
  const {
    asChild,
    children,
    className,
    label,
    loadingState = label,
    ...otherProps
  } = props;

  return (
    <CoreTicketsPicker.CheckoutTrigger>
      {({ isLoading, error, hasSelectedTicketDefinitions, checkout }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.ticketsPickerCheckoutTrigger}
          data-in-progress={isLoading}
          customElement={children}
          customElementProps={{
            isLoading,
            error,
            hasSelectedTicketDefinitions,
            checkout,
          }}
          disabled={isLoading}
          onClick={checkout}
          {...otherProps}
        >
          <button>{isLoading ? loadingState : label}</button>
        </AsChildSlot>
      )}
    </CoreTicketsPicker.CheckoutTrigger>
  );
});
