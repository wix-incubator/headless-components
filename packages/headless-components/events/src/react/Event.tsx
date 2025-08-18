import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import { type AsChildProps, useAsChild } from '../utils/asChild.js';
import {
  EventService,
  EventServiceDefinition,
  type EventServiceConfig,
  type Event,
} from '../services/event-service.js';

enum TestIds {
  eventTitle = 'event-title',
}

export interface EventRootProps {
  event: Event;
  children: React.ReactNode;
}

export function Root(props: EventRootProps): React.ReactNode {
  const { event, children } = props;

  const eventServiceConfig: EventServiceConfig = {
    event,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        EventServiceDefinition,
        EventService,
        eventServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface EventTitleProps extends AsChildProps {}

export const Title = React.forwardRef<HTMLElement, EventTitleProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const Comp = useAsChild(asChild);

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const title = event.title;

    return (
      <Comp ref={ref} data-testid={TestIds.eventTitle} {...otherProps}>
        {asChild ? children : title}
      </Comp>
    );
  },
);
