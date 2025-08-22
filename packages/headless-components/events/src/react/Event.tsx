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

/**
 * Props for the Event Root component.
 */
export interface RootProps {
  event: Event;
  children: React.ReactNode;
}

/**
 * Root container that provides event context to all child components.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Event } from '@wix/headless-events/react';
 *
 * function EventPage({ event }) {
 *   return (
 *     <Event.Root event={event}>
 *       <Event.Image />
 *       <Event.Title />
 *       <Event.Date />
 *       <Event.Location />
 *       <Event.Description />
 *       <Event.RsvpButton>RSVP</Event.RsvpButton>
 *     </Event.Root>
 *   );
 * }
 * ```
 */
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

/**
 * Props for the Event Image component.
 */
export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asChild?: boolean;
}

/**
 * Displays the event image using WixMediaImage component with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.Image className="w-full h-full object-cover" />
 *
 * // asChild with primitive
 * <Event.Image asChild>
 *   <img className="w-full h-full object-cover" />
 * </Event.Image>
 * ```
 */
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

/**
 * Props for the Event Title component.
 */
export interface TitleProps extends AsChildProps<{ title: string }> {}

/**
 * Displays the event title with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.Title className="text-4xl font-bold" />
 *
 * // asChild with primitive
 * <Event.Title asChild>
 *   <h1 className="text-4xl font-bold" />
 * </Event.Title>
 *
 * // asChild with react component
 * <Event.Title asChild>
 *   {React.forwardRef(({title, ...props}, ref) => (
 *     <h1 ref={ref} {...props} className="text-4xl font-bold">
 *       {title}
 *     </h1>
 *   ))}
 * </Event.Title>
 * ```
 */
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

  return (
    <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
      {title}
    </div>
  );
});

/**
 * Props for the Event Date component.
 */
export interface DateProps extends AsChildProps<{ date: string }> {
  /** Format of the event date */
  format?: 'short' | 'full'; // Default: 'short'
}

/**
 * Displays the event date with customizable rendering and format options following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.Date className="text-sm font-medium" format="full" />
 *
 * // asChild with primitive
 * <Event.Date asChild format="full">
 *   <span className="text-sm font-medium" />
 * </Event.Date>
 *
 * // asChild with react component
 * <Event.Date asChild>
 *   {React.forwardRef(({date, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {date}
 *     </span>
 *   ))}
 * </Event.Date>
 * ```
 */
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

  return (
    <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
      {date}
    </div>
  );
});

/**
 * Props for the Event Location component.
 */
export interface LocationProps extends AsChildProps<{ location: string }> {
  /** Format of the event location */
  format?: 'short' | 'full'; // Default: 'short'
}

/**
 * Displays the event location with customizable rendering and format options following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.Location className="text-sm font-medium" format="full" />
 *
 * // asChild with primitive
 * <Event.Location asChild format="full">
 *   <span className="text-sm font-medium" />
 * </Event.Location>
 *
 * // asChild with react component
 * <Event.Location asChild>
 *   {React.forwardRef(({location, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {location}
 *     </span>
 *   ))}
 * </Event.Location>
 * ```
 */
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

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {location}
      </div>
    );
  },
);

/**
 * Props for the Event Description component.
 */
export interface DescriptionProps
  extends AsChildProps<{ description: string }> {}

/**
 * Displays the event description with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.Description className="text-sm font-medium" />
 *
 * // asChild with primitive
 * <Event.Description asChild>
 *   <span className="text-sm font-medium" />
 * </Event.Description>
 *
 * // asChild with react component
 * <Event.Description asChild>
 *   {React.forwardRef(({description, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {description}
 *     </span>
 *   ))}
 * </Event.Description>
 * ```
 */
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

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {description}
      </div>
    );
  },
);
