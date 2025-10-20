import { rsvpV2 } from '@wix/events';
import { FormServiceConfig } from '@wix/headless-forms/services';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  EventService,
  EventServiceDefinition,
  type EventServiceConfig,
  type Event,
  type RichContent,
} from '../../services/event-service.js';
import { EventListServiceDefinition } from '../../services/event-list-service.js';
import { hasDescription } from '../../utils/event.js';
import { formatFullDate, formatShortDate } from '../../utils/date.js';
import { getErrorMessage } from '../../utils/errors.js';
import { getFormResponse, getRequiredRsvpData } from '../../utils/form.js';

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
  const { children, event } = props;

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

export interface RawProps {
  /** Render prop function */
  children: (props: RawRenderProps) => React.ReactNode;
}

export interface RawRenderProps {
  /** Event */
  event: Event;
}

/**
 * Event Raw core component that provides event.
 *
 * @component
 */
export function Raw(props: RawProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();

  return props.children({ event });
}

export interface SlugProps {
  /** Render prop function */
  children: (props: SlugRenderProps) => React.ReactNode;
}

export interface SlugRenderProps {
  /** Event slug */
  slug: string;
}

/**
 * Event Slug core component that provides event slug.
 *
 * @component
 */
export function Slug(props: SlugProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const slug = event.slug!;

  return props.children({ slug });
}

export interface TypeProps {
  /** Render prop function */
  children: (props: TypeRenderProps) => React.ReactNode;
}

export interface TypeRenderProps {
  /** Is event ticketed */
  ticketed: boolean;
  /** Is event RSVP */
  rsvp: boolean;
  /** Is event external */
  external: boolean;
}

/**
 * Event Type core component that provides event type.
 *
 * @component
 */
export function Type(props: TypeProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const ticketed = event.registration?.type === 'TICKETING';
  const rsvp = event.registration?.type === 'RSVP';
  const external = event.registration?.type === 'EXTERNAL';

  return props.children({ ticketed, rsvp, external });
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
  /** Locale */
  locale?: Intl.LocalesArgument;
}

export interface DateRenderProps {
  /** Event start date, null if TBD */
  startDate: Date | null;
  /** Event end date, null if TBD */
  endDate: Date | null;
  /** Event time zone ID, null if TBD */
  timeZoneId: string | null;
  /** Whether the event date and time is TBD */
  dateAndTimeTbd: boolean;
  /** Message to display if the event date and time is TBD */
  dateAndTimeTbdMessage: string | null;
  /** Whether to hide the end date */
  hideEndDate: boolean;
  /** Whether to show the time zone */
  showTimeZone: boolean;
  /** Formatted event date */
  formattedDate: string;
}

/**
 * Event Date core component that provides event date.
 *
 * @component
 */
export function DateCore(props: DateProps): React.ReactNode {
  const { format = 'short', locale } = props;

  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();

  const {
    startDate,
    endDate,
    timeZoneId,
    dateAndTimeTbd,
    dateAndTimeTbdMessage,
    hideEndDate,
    showTimeZone,
  } = event.dateAndTimeSettings!;
  const formattedDate = dateAndTimeTbd
    ? dateAndTimeTbdMessage!
    : format === 'short'
      ? formatShortDate(startDate!, timeZoneId!, locale)
      : hideEndDate
        ? formatFullDate(startDate!, timeZoneId!, showTimeZone!, locale)
        : `${formatFullDate(startDate!, timeZoneId!, false, locale)} - ${formatFullDate(endDate!, timeZoneId!, showTimeZone!, locale)}`;

  return props.children({
    startDate: dateAndTimeTbd ? null : new Date(startDate!),
    endDate: dateAndTimeTbd ? null : new Date(endDate!),
    timeZoneId: dateAndTimeTbd ? null : timeZoneId!,
    dateAndTimeTbd: dateAndTimeTbd!,
    dateAndTimeTbdMessage: dateAndTimeTbd ? dateAndTimeTbdMessage! : null,
    hideEndDate: hideEndDate!,
    showTimeZone: showTimeZone!,
    formattedDate: formattedDate!,
  });
}

export interface LocationProps {
  /** Render prop function */
  children: (props: LocationRenderProps) => React.ReactNode;
  /** Format of the event location */
  format?: 'short' | 'full'; // Default: 'short'
}

export interface LocationRenderProps {
  /** Formatted event location */
  formattedLocation: string;
  /** Event location latitude (null if TBD) */
  latitude: number | null;
  /** Event location longitude (null if TBD) */
  longitude: number | null;
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
  const formattedLocation =
    event.location!.locationTbd || format === 'short'
      ? event.location!.name!
      : // @ts-expect-error
        `${event.location!.name}, ${event.location!.address!.formatted}`;
  // @ts-expect-error
  const latitude = event.location!.address?.location?.latitude;
  // @ts-expect-error
  const longitude = event.location!.address?.location?.longitude;

  return props.children({ formattedLocation, latitude, longitude });
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
  slug: string;
  /** Is event ticketed */
  ticketed: boolean;
}

/**
 * Event RsvpButton core component that provides event slug and ticketed status.
 *
 * @component
 */
export function RsvpButton(props: RsvpButtonProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  const slug = event.slug!;
  const ticketed = event.registration?.type === 'TICKETING';

  return props.children({ slug, ticketed });
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

export interface OtherEventsProps {
  /** Number of other events to display */
  count: number;
  /** Render prop function */
  children: (props: OtherEventsRenderProps) => React.ReactNode;
}

export interface OtherEventsRenderProps {
  /** Other events */
  events: Event[];
}

/**
 * Event OtherEvents core component that provides other events.
 *
 * @component
 */
export function OtherEvents(props: OtherEventsProps): React.ReactNode {
  const { count } = props;

  const eventService = useService(EventServiceDefinition);
  const eventListService = useService(EventListServiceDefinition);

  const event = eventService.event.get();
  const events = eventListService.events.get();
  const otherEvents = events
    .filter((item) => item._id !== event._id)
    .slice(0, count);

  if (!otherEvents.length) {
    return null;
  }

  return props.children({ events: otherEvents });
}

export interface FormProps {
  /** Render prop function */
  children: (props: FormRenderProps) => React.ReactNode;
  /** Thank you page URL */
  thankYouPageUrl?: string;
}

export interface FormRenderProps {
  /** Form ID */
  formId: string;
  /** Submit handler */
  onSubmit: FormServiceConfig['onSubmit'];
}

/**
 * Event Form core component that provides form ID.
 *
 * @component
 */
export function Form(props: FormProps): React.ReactNode {
  const eventService = useService(EventServiceDefinition);

  const event = eventService.event.get();
  // @ts-expect-error
  const formId = event.registration!.rsvp!.formId;

  const onSubmit: FormServiceConfig['onSubmit'] = async (
    _formId,
    formValues,
  ) => {
    try {
      await rsvpV2.createRsvp({
        eventId: event._id,
        status: 'YES',
        form: getFormResponse(event, formValues),
        ...getRequiredRsvpData(event, formValues),
      });

      if (props.thankYouPageUrl) {
        window.location.href = props.thankYouPageUrl;
      }

      return { type: 'success' };
    } catch (err) {
      return { type: 'error', message: getErrorMessage(err) };
    }
  };

  return props.children({ formId, onSubmit });
}
