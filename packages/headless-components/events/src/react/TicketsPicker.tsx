import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TicketListService,
  TicketDefinitionListServiceDefinition,
  TicketReservationQuantity,
  type TicketListServiceConfig,
} from '../services/ticket-list-service.js';
import * as TicketDefinition from './TicketDefinition.js';
import {
  EventServiceDefinition,
  EventService,
  type EventServiceConfig,
} from '../services/event-service.js';
import {
  CheckoutServiceDefinition,
  CheckoutService,
} from '../services/checkout-service.js';

enum TestIds {
  ticketsPickerTickets = 'tickets-picker-tickets',
  ticketsPickerTicket = 'tickets-picker-ticket',
  ticketsPickerCheckout = 'tickets-picker-checkout',
}

/**
 * Props for the TicketsPicker Root component.
 */
export interface RootProps {
  ticketListServiceConfig: TicketListServiceConfig;
  initialSelectedQuantities?: TicketReservationQuantity[];
  eventServiceConfig: EventServiceConfig;
  children: React.ReactNode;
}

/**
 * Root component that provides the TicketList service context for rendering ticket lists.
 *
 * @component
 * @example
 * ```tsx
 * import { TicketsPicker } from '@wix/headless-events/react';
 *
 * function TicketsPickerComponent({ ticketListServiceConfig }) {
 *   return (
 *     <TicketsPicker.Root ticketListServiceConfig={ticketListServiceConfig}>
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
export const Root = (props: RootProps): React.ReactNode => {
  const {
    ticketListServiceConfig,
    eventServiceConfig,
    initialSelectedQuantities,
    children,
  } = props;

  const config: TicketListServiceConfig = {
    ...ticketListServiceConfig,
    initialSelectedQuantities,
  };

  return (
    <WixServices
      servicesMap={createServicesMap()
        .addService(EventServiceDefinition, EventService, eventServiceConfig)
        .addService(
          TicketDefinitionListServiceDefinition,
          TicketListService,
          config,
        )
        .addService(CheckoutServiceDefinition, CheckoutService, {})}
    >
      {children}
    </WixServices>
  );
};

/**
 * Props for the TicketsPicker TicketDefinitions component.
 */
export interface TicketDefinitionsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

/**
 * Container for the ticket list with empty state support.
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
  HTMLDivElement,
  TicketDefinitionsProps
>((props, ref) => {
  const { children, emptyState, className } = props;

  const service = useService(TicketDefinitionListServiceDefinition);
  const ticketDefinitions = service.ticketDefinitions.get();
  const hasTickets = !!ticketDefinitions.length;

  if (!hasTickets) {
    return emptyState || null;
  }

  const attributes = {
    'data-testid': TestIds.ticketsPickerTickets,
    'data-empty': !hasTickets,
    className,
  };

  return (
    <div {...attributes} ref={ref}>
      {children}
    </div>
  );
});

/**
 * Props for the TicketsPicker TicketDefinitionRepeater component.
 */
export interface TicketDefinitionRepeaterProps {
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

  const service = useService(TicketDefinitionListServiceDefinition);
  const ticketDefinitions = service.ticketDefinitions.get();
  const hasTickets = !!ticketDefinitions.length;

  if (!hasTickets) {
    return null;
  }

  return (
    <>
      {ticketDefinitions.map((ticketDefinition) => (
        <TicketDefinition.Root
          key={ticketDefinition._id}
          ticketDefinition={ticketDefinition}
          data-testid={TestIds.ticketsPickerTicket}
        >
          {children}
        </TicketDefinition.Root>
      ))}
    </>
  );
};

/**
 * Props passed to the render function of the Checkout component
 */
export interface CheckoutRenderProps {
  /** Whether the checkout operation is currently loading */
  isLoading: boolean;
  /** Error message if any (including no tickets selected) */
  error: string | null;
  /** Function to trigger the checkout */
  checkout: () => Promise<void>;
  /** Whether any tickets are selected */
  hasSelectedTickets: boolean;
}

/**
 * Props for the Checkout component
 */
export interface CheckoutProps {
  /** Render function that receives checkout state and actions */
  children: (props: CheckoutRenderProps) => React.ReactNode;
  /** Custom error message when no tickets are selected */
  noTicketsErrorMessage?: string;
}

/**
 * Headless component providing checkout functionality for selected tickets.
 * Uses render props to allow custom UI.
 * Shows error if attempting checkout with no tickets selected.
 *
 * @component
 * @example
 * <TicketsPicker.Checkout noTicketsErrorMessage="Select tickets first">
 *   {({ isLoading, error, checkout, hasSelectedTickets }) => (
 *     <div>
 *       {error && <div className="error">{error}</div>}
 *       <button
 *         onClick={checkout}
 *         disabled={isLoading || !hasSelectedTickets}
 *       >
 *         {isLoading ? 'Processing...' : 'Checkout'}
 *       </button>
 *     </div>
 *   )}
 * </TicketsPicker.Checkout>
 */
export const Checkout = (props: CheckoutProps): React.ReactNode => {
  const {
    children,
    noTicketsErrorMessage = 'Please select at least one ticket',
  } = props;

  const ticketService = useService(TicketDefinitionListServiceDefinition);
  const eventService = useService(EventServiceDefinition);
  const checkoutService = useService(CheckoutServiceDefinition);

  const event = eventService.event.get();
  const selectedQuantities = ticketService.selectedQuantities.get();

  const hasSelectedTickets = selectedQuantities.length > 0;

  const [localError, setLocalError] = React.useState<string | null>(null);

  const onCheckout = async () => {
    if (!hasSelectedTickets) {
      setLocalError(noTicketsErrorMessage);
      return;
    }

    setLocalError(null);
    await checkoutService.createCheckout(
      event._id!,
      event.slug!,
      selectedQuantities,
    );
  };

  const error = localError || checkoutService.error.get();

  return children({
    isLoading: checkoutService.isLoading.get(),
    error,
    checkout: onCheckout,
    hasSelectedTickets,
  });
};
