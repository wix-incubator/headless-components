import { useService, WixServices } from "@wix/services-manager-react";
import { createServicesMap } from "@wix/services-manager";
import { AsChildProps, useAsChild } from "../utils/asChild.js";
import { EventListService, EventListServiceConfig, EventListServiceDefinition } from "../services/event-list-service.js";

interface EventListRootProps {
  children: React.ReactNode;
}

export function Root(props: EventListRootProps): React.ReactNode {
  const { children } = props;

  const eventListServiceConfig: EventListServiceConfig = {
    events: [],
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        EventListServiceDefinition,
        EventListService,
        eventListServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface EventsProps extends AsChildProps {
  emptyState?: React.ReactNode;
}

export function Events(props: EventsProps): React.ReactNode {
  const { asChild, children, emptyState, ...otherProps } = props;
  const Comp = useAsChild(asChild, "div");

  const service = useService(EventListServiceDefinition);
  const events = service.events.get();

  if (!events.length && emptyState) {
    return emptyState;
  }

  return (
    <Comp data-testid="event-list-events" {...otherProps}>
      {children}
    </Comp>
  );
}

export interface EventRepeaterProps extends AsChildProps {}

export function EventRepeater(props: EventRepeaterProps): React.ReactNode {
  const { asChild, children, ...otherProps } = props;
  const Comp = useAsChild(asChild, "div");

  // const service = useService(EventListServiceDefinition);
  // const events = service.events.get();

  return (
    <Comp {...otherProps}>
      {/* {events.map((event, index) => (
        <Event.Root key={event._id || index} event={event}>
          {children}
        </Event.Root>
      ))} */}
    </Comp>
  );
}
