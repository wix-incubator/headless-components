import { media } from '@wix/sdk';
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
  eventImage = 'event-image',
  eventTitle = 'event-title',
  eventDate = 'event-date',
  eventLocation = 'event-location',
  eventDescription = 'event-description',
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

export interface EventImageProps extends AsChildProps {}

export const Image = React.forwardRef<HTMLElement, EventImageProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const Comp = useAsChild(asChild, 'img');

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const src = event.mainImage ? media.getImageUrl(event.mainImage).url : '';

    const attributes = {
      'data-testid': TestIds.eventImage,
      src,
      ...otherProps,
    };

    return src || asChild ? (
      <Comp ref={ref} {...attributes}>
        {asChild ? children : null}
      </Comp>
    ) : null;
  },
);

export interface EventTitleProps extends AsChildProps {}

export const Title = React.forwardRef<HTMLElement, EventTitleProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const Comp = useAsChild(asChild);

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const title = event.title;

    const attributes = {
      'data-testid': TestIds.eventTitle,
      ...otherProps,
    };

    return (
      <Comp ref={ref} {...attributes}>
        {asChild ? children : title}
      </Comp>
    );
  },
);

export interface EventDateProps extends AsChildProps {}

export const Date = React.forwardRef<HTMLElement, EventDateProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const Comp = useAsChild(asChild);

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const date = event.dateAndTimeSettings!.dateAndTimeTbd
      ? event.dateAndTimeSettings!.dateAndTimeTbdMessage
      : event.dateAndTimeSettings!.formatted!.dateAndTime;

    const attributes = {
      'data-testid': TestIds.eventDate,
      ...otherProps,
    };

    return (
      <Comp ref={ref} {...attributes}>
        {asChild ? children : date}
      </Comp>
    );
  },
);

export interface EventLocationProps extends AsChildProps {}

export const Location = React.forwardRef<HTMLElement, EventLocationProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const Comp = useAsChild(asChild);

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const location = event.location!.name;

    const attributes = {
      'data-testid': TestIds.eventLocation,
      ...otherProps,
    };

    return (
      <Comp ref={ref} {...attributes}>
        {asChild ? children : location}
      </Comp>
    );
  },
);

export interface EventDescriptionProps extends AsChildProps {}

export const Description = React.forwardRef<HTMLElement, EventDescriptionProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const Comp = useAsChild(asChild);

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const description = event.shortDescription;

    const attributes = {
      'data-testid': TestIds.eventDescription,
      ...otherProps,
    };

    return description || asChild ? (
      <Comp ref={ref} {...attributes}>
        {asChild ? children : description}
      </Comp>
    ) : null;
  },
);
