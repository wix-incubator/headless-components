import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TicketListService,
  TicketListServiceDefinition,
  type TicketListServiceConfig,
} from '../services/ticket-list-service.js';
import * as TicketDefinition from './TicketDefinition.js';

enum TestIds {
  ticketListTickets = 'ticket-list-tickets',
  ticketListTicket = 'ticket-list-ticket',
}

/**
 * Props for the TicketsPicker Root component.
 */
export interface RootProps {
  ticketsServiceConfig: TicketListServiceConfig;
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
 * function TicketsPickerComponent({ ticketsServiceConfig }) {
 *   return (
 *     <TicketsPicker.Root ticketsServiceConfig={ticketsServiceConfig}>
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
  const { ticketsServiceConfig, children } = props;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        TicketListServiceDefinition,
        TicketListService,
        ticketsServiceConfig,
      )}
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
export const TicketDefinitions = React.forwardRef<HTMLDivElement, TicketDefinitionsProps>(
  (props, ref) => {
    const { children, emptyState, className } = props;

    const service = useService(TicketListServiceDefinition);
    const ticketDefinitions = service.ticketDefinitions.get();
    const hasTickets = !!ticketDefinitions.length;

    if (!hasTickets) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.ticketListTickets,
      'data-empty': !hasTickets,
      className,
    };

    return (
      <div {...attributes} ref={ref}>
        {children}
      </div>
    );
  },
);

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
export const TicketDefinitionRepeater = (props: TicketDefinitionRepeaterProps): React.ReactNode => {
  const { children } = props;

  const service = useService(TicketListServiceDefinition);
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
          data-testid={TestIds.ticketListTicket}
        >
          {children}
        </TicketDefinition.Root>
      ))}
    </>
  );
};
