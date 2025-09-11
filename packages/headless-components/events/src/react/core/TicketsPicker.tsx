import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TicketListService,
  TicketDefinitionListServiceDefinition,
  type TicketListServiceConfig,
} from '../../services/ticket-list-service.js';
import { type TicketDefinition } from '../../services/ticket-service.js';
import {
  EventServiceDefinition,
  EventService,
  type EventServiceConfig,
} from '../../services/event-service.js';
import {
  CheckoutServiceDefinition,
  CheckoutService,
} from '../../services/checkout-service.js';

export interface RootProps {
  /** Child components that will have access to the event, ticket list and checkout services */
  children: React.ReactNode;
  /** Event service configuration */
  eventServiceConfig: EventServiceConfig;
  /** Ticket list service configuration */
  ticketListServiceConfig: TicketListServiceConfig;
}

/**
 * TicketsPicker Root core component that provides event, ticket list and checkout services context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { eventServiceConfig, ticketListServiceConfig, children } = props;

  return (
    <WixServices
      servicesMap={createServicesMap()
        .addService(EventServiceDefinition, EventService, eventServiceConfig)
        .addService(
          TicketDefinitionListServiceDefinition,
          TicketListService,
          ticketListServiceConfig,
        )
        .addService(CheckoutServiceDefinition, CheckoutService, {})}
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
  const service = useService(TicketDefinitionListServiceDefinition);
  const ticketDefinitions = service.ticketDefinitions.get();
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
  /** Indicates whether there are any ticket definitions */
  hasTicketDefinitions: boolean;
}

/**
 * TicketsPicker TicketDefinitionRepeater core component that provides ticket definitions data.
 *
 * @component
 */
export function TicketDefinitionRepeater(
  props: TicketDefinitionRepeaterProps,
): React.ReactNode {
  const service = useService(TicketDefinitionListServiceDefinition);
  const ticketDefinitions = service.ticketDefinitions.get();
  const hasTicketDefinitions = !!ticketDefinitions.length;

  return props.children({ ticketDefinitions, hasTicketDefinitions });
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
 * TicketsPicker CheckoutTrigger core component that provides checkout functionality.
 *
 * @component
 */
export function CheckoutTrigger(props: CheckoutTriggerProps): React.ReactNode {
  const ticketListService = useService(TicketDefinitionListServiceDefinition);
  const eventService = useService(EventServiceDefinition);
  const checkoutService = useService(CheckoutServiceDefinition);

  const event = eventService.event.get();
  const selectedQuantities = ticketListService.selectedQuantities.get();
  const isLoading = checkoutService.isLoading.get();
  const error = checkoutService.error.get();
  const hasSelectedTicketDefinitions = !!selectedQuantities.length;

  const checkout = () =>
    checkoutService.checkout(event._id!, event.slug!, selectedQuantities);

  return props.children({
    isLoading,
    error,
    hasSelectedTicketDefinitions,
    checkout,
  });
}
