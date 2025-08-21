import { WixMediaImage } from '@wix/headless-media/react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  EventService,
  EventServiceDefinition,
  type EventServiceConfig,
  type Event,
} from '../services/event-service.js';
import { type AsChildProps, renderAsChild } from '../utils/renderAsChild.js';

enum TestIds {
  eventImage = 'event-image',
  eventTitle = 'event-title',
  eventDate = 'event-date',
  eventLocation = 'event-location',
  eventDescription = 'event-description',
}

export interface RootProps {
  event: Event;
  children: React.ReactNode;
}

export const Root = (props: RootProps): React.ReactNode => {
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
};

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asChild?: boolean;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const image = event.mainImage;

    const attributes = {
      className,
      'data-testid': TestIds.eventImage,
      ...otherProps,
    };

    return (
      <WixMediaImage
        ref={ref}
        asChild={asChild}
        children={children}
        media={{ image }}
        {...attributes}
      />
    );
  },
);

export interface TitleProps extends AsChildProps<{ title: string }> {}

export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, className } = props;

  const service = useService(EventServiceDefinition);
  const event = service.event.get();
  const title = event.title!;

  const attributes = {
    className,
    'data-testid': TestIds.eventTitle,
  };

  if (asChild) {
    const rendered = renderAsChild({
      ref,
      children,
      attributes,
      props: { title },
      content: title,
    });

    if (rendered) {
      return rendered;
    }
  }

  return <div {...attributes}>{title}</div>;
});

export interface DateProps extends AsChildProps<{ date: string }> {
  format?: 'short' | 'full';
}

export const Date = React.forwardRef<HTMLElement, DateProps>((props, ref) => {
  const { asChild, children, className, format = 'short' } = props;

  const service = useService(EventServiceDefinition);
  const event = service.event.get();
  const date = event.dateAndTimeSettings!.dateAndTimeTbd
    ? event.dateAndTimeSettings!.dateAndTimeTbdMessage!
    : format === 'short'
      ? event.dateAndTimeSettings!.formatted!.startDate!
      : event.dateAndTimeSettings!.formatted!.dateAndTime!;

  const attributes = {
    className,
    'data-testid': TestIds.eventDate,
  };

  if (asChild) {
    const rendered = renderAsChild({
      ref,
      children,
      attributes,
      props: { date },
      content: date,
    });

    if (rendered) {
      return rendered;
    }
  }

  return <div {...attributes}>{date}</div>;
});

export interface LocationProps extends AsChildProps<{ location: string }> {
  format?: 'short' | 'full';
}

export const Location = React.forwardRef<HTMLElement, LocationProps>(
  (props, ref) => {
    const { asChild, children, className, format = 'short' } = props;

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const location =
      event.location!.locationTbd || format === 'short'
        ? event.location!.name!
        : // @ts-expect-error
          `${event.location!.name}, ${event.location!.address!.formatted}`;

    const attributes = {
      className,
      'data-testid': TestIds.eventLocation,
    };

    if (asChild) {
      const rendered = renderAsChild({
        ref,
        children,
        attributes,
        props: { location },
        content: location,
      });

      if (rendered) {
        return rendered;
      }
    }

    return <div {...attributes}>{location}</div>;
  },
);

export interface DescriptionProps
  extends AsChildProps<{ description: string }> {}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const description = event.shortDescription;

    const attributes = {
      className,
      'data-testid': TestIds.eventDescription,
    };

    if (!description) {
      return null;
    }

    if (asChild) {
      const rendered = renderAsChild({
        ref,
        children,
        attributes,
        props: { description },
        content: description,
      });

      if (rendered) {
        return rendered;
      }
    }

    return <div {...attributes}>{description}</div>;
  },
);
