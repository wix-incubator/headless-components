import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TicketDefinitionListService,
  TicketDefinitionListServiceDefinition,
  type TicketDefinitionListServiceConfig,
} from '../../services/ticket-definition-list-service.js';
import { type TicketDefinition } from '../../services/ticket-definition-service.js';
import {
  EventServiceDefinition,
  EventService,
  type EventServiceConfig,
} from '../../services/event-service.js';
import {
  CheckoutServiceDefinition,
  CheckoutService,
  type CheckoutServiceConfig,
} from '../../services/checkout-service.js';
import { WIX_FEE_RATE } from '../../constants.js';

export interface RootProps {
  /** Child components that will have access to necessary services */
  children: React.ReactNode;
  /** Event service configuration */
  eventServiceConfig: EventServiceConfig;
  /** Ticket definition list service configuration */
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
  /** Checkout service configuration */
  checkoutServiceConfig: CheckoutServiceConfig;
}

/**
 * TicketsPicker Root core component that provides necessary services context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const {
    eventServiceConfig,
    ticketDefinitionListServiceConfig,
    checkoutServiceConfig,
    children,
  } = props;

  return (
    <WixServices
      servicesMap={createServicesMap()
        .addService(EventServiceDefinition, EventService, eventServiceConfig)
        .addService(
          TicketDefinitionListServiceDefinition,
          TicketDefinitionListService,
          ticketDefinitionListServiceConfig,
        )
        .addService(
          CheckoutServiceDefinition,
          CheckoutService,
          checkoutServiceConfig,
        )}
    >
      {children}
    </WixServices>
  );
}

export interface TicketDefinitionsProps {
  /** Render prop function */
  children: (props: TicketDefinitionsRenderProps) => React.ReactNode;
}

export interface TicketDefinitionsRenderProps {
  /** List of ticket definitions */
  ticketDefinitions: TicketDefinition[];
  /** Indicates whether there are any ticket definitions */
  hasTicketDefinitions: boolean;
}

/**
 * TicketsPicker TicketDefinitions core component that provides ticket definitions data.
 *
 * @component
 */
export function TicketDefinitions(
  props: TicketDefinitionsProps,
): React.ReactNode {
  const ticketDefinitionListService = useService(
    TicketDefinitionListServiceDefinition,
  );

  const ticketDefinitions = ticketDefinitionListService.ticketDefinitions.get();
  const hasTicketDefinitions = !!ticketDefinitions.length;

  return props.children({ ticketDefinitions, hasTicketDefinitions });
}

export interface TicketDefinitionRepeaterProps {
  /** Render prop function */
  children: (props: TicketDefinitionRepeaterRenderProps) => React.ReactNode;
}

export interface TicketDefinitionRepeaterRenderProps {
  /** List of ticket definitions */
  ticketDefinitions: TicketDefinition[];
}

/**
 * TicketsPicker TicketDefinitionRepeater core component that provides ticket definitions. Not rendered if there are no ticket definitions.
 *
 * @component
 */
export function TicketDefinitionRepeater(
  props: TicketDefinitionRepeaterProps,
): React.ReactNode {
  const ticketDefinitionListService = useService(
    TicketDefinitionListServiceDefinition,
  );

  const ticketDefinitions = ticketDefinitionListService.ticketDefinitions.get();
  const hasTicketDefinitions = !!ticketDefinitions.length;

  if (!hasTicketDefinitions) {
    return null;
  }

  return props.children({ ticketDefinitions });
}

export interface TotalsProps {
  /** Render prop function */
  children: (props: TotalsRenderProps) => React.ReactNode;
}

export interface TotalsRenderProps {
  /** Total amount */
  total: number;
  /** Subtotal amount */
  subtotal: number;
  /** Tax amount */
  tax: number;
  /** Fee amount */
  fee: number;
  /** Currency */
  currency: string;
  /** Formatted total */
  formattedTotal: string;
  /** Formatted subtotal */
  formattedSubtotal: string;
  /** Formatted tax */
  formattedTax: string;
  /** Formatted fee */
  formattedFee: string;
  /** Tax name */
  taxName: string | null;
  /** Tax rate */
  taxRate: number | null;
  /** Whether tax is included in price */
  taxIncluded: boolean;
  /** Fee rate */
  feeRate: number;
}

/**
 * TicketsPicker Totals core component that provides totals data.
 *
 * @component
 */
export function Totals(props: TotalsProps): React.ReactNode {
  const ticketDefinitionListService = useService(
    TicketDefinitionListServiceDefinition,
  );
  const eventService = useService(EventServiceDefinition);

  const {
    total,
    subtotal,
    tax,
    fee,
    currency,
    formattedTotal,
    formattedSubtotal,
    formattedTax,
    formattedFee,
  } = ticketDefinitionListService.totals.get();
  const event = eventService.event.get();
  const taxSettings = event.registration?.tickets?.taxSettings;

  return props.children({
    total,
    subtotal,
    tax,
    fee,
    currency,
    formattedTotal,
    formattedSubtotal,
    formattedTax,
    formattedFee,
    taxName: taxSettings ? taxSettings.name! : null,
    taxRate: taxSettings ? Number(taxSettings.rate!) : null,
    taxIncluded: taxSettings?.type === 'INCLUDED_IN_PRICE',
    feeRate: WIX_FEE_RATE,
  });
}

export interface CheckoutErrorProps {
  /** Render prop function */
  children: (props: CheckoutErrorRenderProps) => React.ReactNode;
}

export interface CheckoutErrorRenderProps {
  /** Error message */
  error: string;
}

/**
 * TicketsPicker CheckoutError core component that provides checkout error. Not rendered if there is no error.
 *
 * @component
 */
export function CheckoutError(props: CheckoutErrorProps): React.ReactNode {
  const checkoutService = useService(CheckoutServiceDefinition);
  const error = checkoutService.error.get();

  if (!error) {
    return null;
  }

  return props.children({ error });
}

export interface CheckoutTriggerProps {
  /** Render prop function */
  children: (props: CheckoutTriggerRenderProps) => React.ReactNode;
}

export interface CheckoutTriggerRenderProps {
  /** Whether the checkout is in progress */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether any ticket definitions are selected */
  hasSelectedTicketDefinitions: boolean;
  /** Function to trigger the checkout */
  checkout: () => Promise<void>;
}

/**
 * TicketsPicker CheckoutTrigger core component that provides checkout functionality. Not rendered if there are no ticket definitions.
 *
 * @component
 */
export function CheckoutTrigger(props: CheckoutTriggerProps): React.ReactNode {
  const ticketDefinitionListService = useService(
    TicketDefinitionListServiceDefinition,
  );
  const eventService = useService(EventServiceDefinition);
  const checkoutService = useService(CheckoutServiceDefinition);

  const event = eventService.event.get();
  const ticketDefinitions = ticketDefinitionListService.ticketDefinitions.get();
  const selectedQuantities =
    ticketDefinitionListService.selectedQuantities.get();
  const isLoading = checkoutService.isLoading.get();
  const error = checkoutService.error.get();
  const filteredSelectedQuantities = selectedQuantities.filter(
    (selectedQuantity) => !!selectedQuantity.quantity,
  );
  const hasTicketDefinitions = !!ticketDefinitions.length;
  const hasSelectedTicketDefinitions = !!filteredSelectedQuantities.length;

  const checkout = () =>
    checkoutService.checkout(
      event._id!,
      event.slug!,
      filteredSelectedQuantities,
    );

  if (!hasTicketDefinitions) {
    return null;
  }

  return props.children({
    isLoading,
    error,
    hasSelectedTicketDefinitions,
    checkout,
  });
}
