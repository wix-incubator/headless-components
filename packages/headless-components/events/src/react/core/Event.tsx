import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  EventService,
  EventServiceDefinition,
  type EventServiceConfig,
  type Event,
  type RichContent,
} from '../../services/event-service.js';
import { hasDescription } from '../../utils/event.js';

export interface RootProps {
  /** Child components that will have access to the event service */
  children: React.ReactNode;
  /** Event */
  event: Event;
}

/**
 * Event Root core component that provides event service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
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

export interface ImageProps {
  /** Render prop function */
  children: (props: ImageRenderProps) => React.ReactNode;
}

export interface ImageRenderProps {
  /** Event image */
  image: string | undefined;
}

/**
 * Event Image core component that provides event image.
 *
 * @component
 */
export function Image(props: ImageProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const image = event.mainImage;

  return props.children({ image });
}

export interface TitleProps {
  /** Render prop function */
  children: (props: TitleRenderProps) => React.ReactNode;
}

export interface TitleRenderProps {
  /** Event title */
  title: string;
}

/**
 * Event Title core component that provides event title.
 *
 * @component
 */
export function Title(props: TitleProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const title = event.title!;

  return props.children({ title });
}

export interface DateProps {
  /** Render prop function */
  children: (props: DateRenderProps) => React.ReactNode;
  /** Format of the event date */
  format?: 'short' | 'full'; // Default: 'short'
}

export interface DateRenderProps {
  /** Formatted event date */
  date: string;
}

/**
 * Event Date core component that provides event date.
 *
 * @component
 */
export function Date(props: DateProps): React.ReactNode {
  const { format = 'short' } = props;

  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const date = event.dateAndTimeSettings!.dateAndTimeTbd
    ? event.dateAndTimeSettings!.dateAndTimeTbdMessage!
    : format === 'short'
      ? event.dateAndTimeSettings!.formatted!.startDate!
      : event.dateAndTimeSettings!.formatted!.dateAndTime!;

  return props.children({ date });
}

export interface LocationProps {
  /** Render prop function */
  children: (props: LocationRenderProps) => React.ReactNode;
  /** Format of the event location */
  format?: 'short' | 'full'; // Default: 'short'
}

export interface LocationRenderProps {
  /** Formatted event location */
  location: string;
}

/**
 * Event Location core component that provides event location.
 *
 * @component
 */
export function Location(props: LocationProps): React.ReactNode {
  const { format = 'short' } = props;

  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const location =
    event.location!.locationTbd || format === 'short'
      ? event.location!.name!
      : // @ts-expect-error
        `${event.location!.name}, ${event.location!.address!.formatted}`;

  return props.children({ location });
}

export interface CoordinatesProps {
  /** Render prop function */
  children: (props: CoordinatesRenderProps) => React.ReactNode;
}

export interface CoordinatesRenderProps {
  /** Event location latitude */
  latitude: number;
  /** Event location longitude */
  longitude: number;
}

/**
 * Event Coordinates core component that provides event location coordinates. Not rendered if there are no coordinates.
 *
 * @component
 */
export function Coordinates(props: CoordinatesProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  // @ts-expect-error
  const latitude = event.location!.address?.location?.latitude;
  // @ts-expect-error
  const longitude = event.location!.address?.location?.longitude;

  if (!latitude || !longitude) {
    return null;
  }

  return props.children({ latitude, longitude });
}

export interface ShortDescriptionProps {
  /** Render prop function */
  children: (props: ShortDescriptionRenderProps) => React.ReactNode;
}

export interface ShortDescriptionRenderProps {
  /** Event short description */
  shortDescription: string;
}

/**
 * Event ShortDescription core component that provides event short description. Not rendered if there is no short description.
 *
 * @component
 */
export function ShortDescription(
  props: ShortDescriptionProps,
): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const shortDescription = event.shortDescription;

  if (!shortDescription) {
    return null;
  }

  return props.children({ shortDescription });
}

export interface DescriptionProps {
  /** Render prop function */
  children: (props: DescriptionRenderProps) => React.ReactNode;
}

export interface DescriptionRenderProps {
  /** Event description in rich content format */
  description: RichContent;
}

/**
 * Event Description core component that provides event description. Not rendered if there is no description.
 *
 * @component
 */
export function Description(props: DescriptionProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const description = event.description;

  if (!hasDescription(event)) {
    return null;
  }

  return props.children({ description: description! });
}

export interface RsvpButtonProps {
  /** Render prop function */
  children: (props: RsvpButtonRenderProps) => React.ReactNode;
}

export interface RsvpButtonRenderProps {
  /** Event slug */
  eventSlug: string;
  /** Is event ticketed */
  ticketed: boolean;
}

/**
 * Event RsvpButton core component that provides event.
 *
 * @component
 */
export function RsvpButton(props: RsvpButtonProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const eventSlug = event.slug!;
  const ticketed = event.registration?.type === 'TICKETING';

  return props.children({ eventSlug, ticketed });
}

export interface AddToGoogleCalendarProps {
  /** Render prop function */
  children: (props: AddToGoogleCalendarRenderProps) => React.ReactNode;
}

export interface AddToGoogleCalendarRenderProps {
  /** Google calendar URL */
  url: string;
}

/**
 * Event AddToGoogleCalendar core component that provides calendar URL.
 *
 * @component
 */
export function AddToGoogleCalendar(
  props: AddToGoogleCalendarProps,
): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const url = event.calendarUrls?.google;

  if (!url) {
    return null;
  }

  return props.children({ url });
}

export interface AddToIcsCalendarProps {
  /** Render prop function */
  children: (props: AddToIcsCalendarRenderProps) => React.ReactNode;
}

export interface AddToIcsCalendarRenderProps {
  /** ICS calendar URL */
  url: string;
}

/**
 * Event AddToIcsCalendar core component that provides calendar URL.
 *
 * @component
 */
export function AddToIcsCalendar(
  props: AddToIcsCalendarProps,
): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const url = event.calendarUrls?.ics;

  if (!url) {
    return null;
  }

  return props.children({ url });
}
