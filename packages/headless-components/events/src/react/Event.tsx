import { Form as FormPrimitive } from '@wix/headless-forms/react';
import { WixMediaImage } from '@wix/headless-media/react';
import { type AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type Event, type RichContent } from '../services/event-service.js';
import { type EventListServiceConfig } from '../services/event-list-service.js';
import { type OccurrenceListServiceConfig } from '../services/occurrence-list-service.js';
import { hasDescription } from '../utils/event.js';
import * as CoreEvent from './core/Event.js';
import * as CoreEventList from './core/EventList.js';
import * as CoreOccurrenceList from './core/OccurrenceList.js';

enum TestIds {
  eventRoot = 'event-root',
  eventSlug = 'event-slug',
  eventImage = 'event-image',
  eventTitle = 'event-title',
  eventDate = 'event-date',
  eventLocation = 'event-location',
  eventShortDescription = 'event-short-description',
  eventDescription = 'event-description',
  eventRsvpButton = 'event-rsvp-button',
  eventFacebookShare = 'event-facebook-share',
  eventLinkedInShare = 'event-linked-in-share',
  eventXShare = 'event-x-share',
  eventAddToGoogleCalendar = 'event-add-to-google-calendar',
  eventAddToIcsCalendar = 'event-add-to-ics-calendar',
  eventOccurrences = 'event-occurrences',
  eventOtherEvents = 'event-other-events',
  eventForm = 'event-form',
}

const DATA_COMPONENT_TAG = 'events.event';

/**
 * Props for the Event Root component.
 */
export interface RootProps {
  /** Event */
  event: Event;
  /** Event list service configuration */
  eventListServiceConfig?: EventListServiceConfig;
  /** Occurrence list service configuration */
  occurrenceListServiceConfig?: OccurrenceListServiceConfig;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to the event */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root container that provides event context to all child components.
 * Must be used as the top-level Event component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Event } from '@wix/events/components';
 *
 * function EventPage({ event }) {
 *   return (
 *     <Event.Root event={event}>
 *       <Event.Image />
 *       <Event.Title />
 *       <Event.Date />
 *       <Event.Location />
 *       <Event.Description />
 *       <Event.RsvpButton label="RSVP" />
 *     </Event.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const {
    event,
    eventListServiceConfig,
    occurrenceListServiceConfig,
    asChild,
    children,
    className,
    ...otherProps
  } = props;

  return (
    <CoreEvent.Root event={event}>
      <CoreEventList.Root
        eventListServiceConfig={
          eventListServiceConfig ?? {
            events: [],
            categories: [],
            pageSize: 0,
            currentPage: 0,
            totalPages: 0,
          }
        }
      >
        <CoreOccurrenceList.Root
          occurrenceListServiceConfig={
            occurrenceListServiceConfig ?? {
              recurringCategoryId: undefined,
              occurrences: [],
              pageSize: 0,
              currentPage: 0,
              totalPages: 0,
            }
          }
        >
          <RootContent
            ref={ref}
            asChild={asChild}
            className={className}
            {...otherProps}
          >
            {children}
          </RootContent>
        </CoreOccurrenceList.Root>
      </CoreEventList.Root>
    </CoreEvent.Root>
  );
});

/**
 * Props for the internal Event RootContent component.
 */
interface RootContentProps
  extends Omit<
    RootProps,
    'event' | 'eventListServiceConfig' | 'occurrenceListServiceConfig'
  > {}

/**
 * Internal Event RootContent component.
 *
 * @component
 * @internal
 */
const RootContent = React.forwardRef<HTMLElement, RootContentProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreEvent.Raw>
        {({ event }) => (
          <CoreOccurrenceList.Occurrences>
            {({ hasOccurrences }) => (
              <AsChildSlot
                ref={ref}
                asChild={asChild}
                className={className}
                data-component-tag={DATA_COMPONENT_TAG}
                data-testid={TestIds.eventRoot}
                data-upcoming={event.status === 'UPCOMING'}
                data-started={event.status === 'STARTED'}
                data-ended={event.status === 'ENDED'}
                data-sold-out={!!event.registration?.tickets?.soldOut}
                data-registration-closed={
                  event.registration?.status === 'CLOSED_MANUALLY' ||
                  event.registration?.status === 'CLOSED_AUTOMATICALLY'
                }
                data-has-image={!!event.mainImage}
                data-has-description={hasDescription(event)}
                data-has-occurrences={hasOccurrences}
                customElement={children}
                customElementProps={{}}
                {...otherProps}
              >
                <div>{children}</div>
              </AsChildSlot>
            )}
          </CoreOccurrenceList.Occurrences>
        )}
      </CoreEvent.Raw>
    );
  },
);

/**
 * Props for the Event Slug component.
 */
export interface SlugProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Event slug */
    slug: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the event slug.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.Slug className="text-sm font-medium" />
 *
 * // asChild with primitive
 * <Event.Slug asChild>
 *   <span className="text-sm font-medium" />
 * </Event.Slug>
 *
 * // asChild with react component
 * <Event.Slug>
 *   {React.forwardRef(({ slug, ...props }, ref) => (
 *     <a ref={ref} {...props} href={`/events/${slug}`}>
 *       Event Details
 *     </a>
 *   ))}
 * </Event.Slug>
 * ```
 */
export const Slug = React.forwardRef<HTMLElement, SlugProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreEvent.Slug>
      {({ slug }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.eventSlug}
          customElement={children}
          customElementProps={{ slug }}
          content={slug}
          {...otherProps}
        >
          <span>{slug}</span>
        </AsChildSlot>
      )}
    </CoreEvent.Slug>
  );
});

/**
 * Props for the Event Type component.
 */
export interface TypeProps {
  /** Custom render function */
  children: AsChildChildren<{
    /** Is event ticketed */
    ticketed: boolean;
    /** Is event RSVP */
    rsvp: boolean;
    /** Is event external */
    external: boolean;
  }>;
}

/**
 * Provides event type information.
 *
 * @component
 * @example
 * ```tsx
 * // asChild with react component
 * <Event.Type asChild>
 *   {React.forwardRef(({ ticketed, rsvp, external, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {ticketed ? 'Ticketed' : rsvp ? 'RSVP' : external ? 'External' : ''}
 *     </span>
 *   ))}
 * </Event.Type>
 * ```
 */
export const Type = React.forwardRef<HTMLElement, TypeProps>((props, ref) => {
  const { children, ...otherProps } = props;

  return (
    <CoreEvent.Type>
      {({ ticketed, rsvp, external }) => (
        <AsChildSlot
          asChild
          ref={ref}
          customElement={children}
          customElementProps={{ ticketed, rsvp, external }}
          {...otherProps}
        />
      )}
    </CoreEvent.Type>
  );
});

/**
 * Props for the Event Image component.
 */
export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Image source URL */
    src: string;
    /** Image width */
    width?: number;
    /** Image height */
    height?: number;
    /** Image alt text */
    alt: string;
  }>;
}

/**
 * Displays the event image using WixMediaImage component.
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
 *
 * // asChild with react component
 * <Event.Image asChild>
 *   {React.forwardRef(({ src, alt, width, height, ...props }, ref) => (
 *     <img ref={ref} src={src} alt={alt} width={width} height={height} {...props} />
 *   ))}
 * </Event.Image>
 * ```
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreEvent.Image>
        {({ image }) => (
          <WixMediaImage
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.eventImage}
            media={{ image }}
            children={children}
            {...otherProps}
          />
        )}
      </CoreEvent.Image>
    );
  },
);

/**
 * Props for the Event Title component.
 */
export interface TitleProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Event title */
    title: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the event title.
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
 *   {React.forwardRef(({ title, ...props }, ref) => (
 *     <h1 ref={ref} {...props} className="text-4xl font-bold">
 *       {title}
 *     </h1>
 *   ))}
 * </Event.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreEvent.Title>
      {({ title }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.eventTitle}
          customElement={children}
          customElementProps={{ title }}
          content={title}
          {...otherProps}
        >
          <span>{title}</span>
        </AsChildSlot>
      )}
    </CoreEvent.Title>
  );
});

/**
 * Props for the Event Date component.
 */
export interface DateProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
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
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Format of the event date */
  format?: 'short' | 'full'; // Default: 'short'
  /** Locale */
  locale?: Intl.LocalesArgument;
}

/**
 * Displays the event date.
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
 *   {React.forwardRef(({ startDate, endDate, timeZoneId, dateAndTimeTbd, dateAndTimeTbdMessage, hideEndDate, showTimeZone, formattedDate, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {formattedDate}
 *     </span>
 *   ))}
 * </Event.Date>
 * ```
 */
export const Date = React.forwardRef<HTMLElement, DateProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    format = 'short',
    locale,
    ...otherProps
  } = props;

  return (
    <CoreEvent.DateCore format={format} locale={locale}>
      {({
        startDate,
        endDate,
        timeZoneId,
        dateAndTimeTbd,
        dateAndTimeTbdMessage,
        hideEndDate,
        showTimeZone,
        formattedDate,
      }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.eventDate}
          customElement={children}
          customElementProps={{
            startDate,
            endDate,
            timeZoneId,
            dateAndTimeTbd,
            dateAndTimeTbdMessage,
            hideEndDate,
            showTimeZone,
            formattedDate,
          }}
          content={formattedDate}
          {...otherProps}
        >
          <span>{formattedDate}</span>
        </AsChildSlot>
      )}
    </CoreEvent.DateCore>
  );
});

/**
 * Props for the Event Location component.
 */
export interface LocationProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Formatted event location */
    formattedLocation: string;
    /** Event location latitude (null if TBD) */
    latitude: number | null;
    /** Event location longitude (null if TBD) */
    longitude: number | null;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Format of the event location */
  format?: 'short' | 'full'; // Default: 'short'
}

/**
 * Displays the event location.
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
 *   {React.forwardRef(({ formattedLocation, latitude, longitude, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {formattedLocation}
 *     </span>
 *   ))}
 * </Event.Location>
 * ```
 */
export const Location = React.forwardRef<HTMLElement, LocationProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      format = 'short',
      ...otherProps
    } = props;

    return (
      <CoreEvent.Location format={format}>
        {({ formattedLocation, latitude, longitude }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.eventLocation}
            customElement={children}
            customElementProps={{ formattedLocation, latitude, longitude }}
            content={formattedLocation}
            {...otherProps}
          >
            <span>{formattedLocation}</span>
          </AsChildSlot>
        )}
      </CoreEvent.Location>
    );
  },
);

/**
 * Props for the Event ShortDescription component.
 */
export interface ShortDescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Event short description */
    shortDescription: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the event short description.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.ShortDescription className="text-sm font-medium" />
 *
 * // asChild with primitive
 * <Event.ShortDescription asChild>
 *   <span className="text-sm font-medium" />
 * </Event.ShortDescription>
 *
 * // asChild with react component
 * <Event.ShortDescription asChild>
 *   {React.forwardRef(({ shortDescription, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {shortDescription}
 *     </span>
 *   ))}
 * </Event.ShortDescription>
 * ```
 */
export const ShortDescription = React.forwardRef<
  HTMLElement,
  ShortDescriptionProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreEvent.ShortDescription>
      {({ shortDescription }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.eventShortDescription}
          customElement={children}
          customElementProps={{ shortDescription }}
          content={shortDescription}
          {...otherProps}
        >
          <span>{shortDescription}</span>
        </AsChildSlot>
      )}
    </CoreEvent.ShortDescription>
  );
});

/**
 * Props for the Event Description component.
 */
export interface DescriptionProps {
  /** Custom render function */
  children?: AsChildChildren<{
    /** Event description in rich content format */
    description: RichContent;
  }>;
}

/**
 * Provides the event description. RicosViewer should be used to render the description.
 *
 * @component
 * @example
 * ```tsx
 * <Event.Description>
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <RicosViewer ref={ref} content={description} />
 *   ))}
 * </Event.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { children, ...otherProps } = props;

    return (
      <CoreEvent.Description>
        {({ description }) => (
          <AsChildSlot
            asChild
            ref={ref}
            data-testid={TestIds.eventDescription}
            customElement={children}
            customElementProps={{ description }}
            {...otherProps}
          />
        )}
      </CoreEvent.Description>
    );
  },
);

/**
 * Props for the Event RsvpButton component.
 */
export interface RsvpButtonProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Event slug */
    slug: string;
    /** Is event ticketed */
    ticketed: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** The label to display inside the button */
  label?: React.ReactNode;
}

/**
 * Displays the event RSVP button.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.RsvpButton className="w-full" label="RSVP" />
 *
 * // asChild with primitive
 * <Event.RsvpButton asChild>
 *   <button className="w-full">RSVP</button>
 * </Event.RsvpButton>
 *
 * // asChild with react component
 * <Event.RsvpButton asChild>
 *   {React.forwardRef(({ slug, ticketed, ...props }, ref) => (
 *     <button ref={ref} {...props}>
 *       {ticketed ? 'Buy Tickets' : 'RSVP'}
 *     </button>
 *   ))}
 * </Event.RsvpButton>
 * ```
 */
export const RsvpButton = React.forwardRef<HTMLElement, RsvpButtonProps>(
  (props, ref) => {
    const { asChild, children, className, label, ...otherProps } = props;

    return (
      <CoreEvent.RsvpButton>
        {({ slug, ticketed }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.eventRsvpButton}
            data-ticketed={ticketed}
            customElement={children}
            customElementProps={{ slug, ticketed }}
            {...otherProps}
          >
            <button>{label}</button>
          </AsChildSlot>
        )}
      </CoreEvent.RsvpButton>
    );
  },
);

/**
 * Props for the Event FacebookShare component.
 */
export interface FacebookShareProps {
  /** Event page URL */
  eventPageUrl: string;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Facebook share URL */
    shareUrl: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays Facebook share element.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.FacebookShare eventPageUrl={eventPageUrl} />
 *
 * // asChild with primitive
 * <Event.FacebookShare asChild eventPageUrl={eventPageUrl}>
 *   <a />
 * </Event.FacebookShare>
 *
 * // asChild with react component
 * <Event.FacebookShare asChild eventPageUrl={eventPageUrl}>
 *   {React.forwardRef(({ shareUrl, ...props }, ref) => (
 *     <button ref={ref} onClick={() => window.open(shareUrl, '_blank')} />
 *   ))}
 * </Event.FacebookShare>
 * ```
 */
export const FacebookShare = React.forwardRef<HTMLElement, FacebookShareProps>(
  (props, ref) => {
    const { eventPageUrl, asChild, children, className, ...otherProps } = props;

    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventPageUrl)}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventFacebookShare}
        customElement={children}
        customElementProps={{ shareUrl }}
        href={shareUrl}
        target="_blank"
        rel="noreferrer"
        {...otherProps}
      >
        <a />
      </AsChildSlot>
    );
  },
);

/**
 * Props for the Event LinkedInShare component.
 */
export interface LinkedInShareProps {
  /** Event page URL */
  eventPageUrl: string;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** LinkedIn share URL */
    shareUrl: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays LinkedIn share element.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.LinkedInShare eventPageUrl={eventPageUrl} />
 *
 * // asChild with primitive
 * <Event.LinkedInShare asChild eventPageUrl={eventPageUrl}>
 *   <a />
 * </Event.LinkedInShare>
 *
 * // asChild with react component
 * <Event.LinkedInShare asChild>
 *   {React.forwardRef(({ shareUrl, ...props }, ref) => (
 *     <button ref={ref} onClick={() => window.open(shareUrl, '_blank')} />
 *   ))}
 * </Event.LinkedInShare>
 * ```
 */
export const LinkedInShare = React.forwardRef<HTMLElement, LinkedInShareProps>(
  (props, ref) => {
    const { eventPageUrl, asChild, children, className, ...otherProps } = props;

    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(eventPageUrl)}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventLinkedInShare}
        customElement={children}
        customElementProps={{ shareUrl }}
        href={shareUrl}
        target="_blank"
        rel="noreferrer"
        {...otherProps}
      >
        <a />
      </AsChildSlot>
    );
  },
);

/**
 * Props for the Event XShare component.
 */
export interface XShareProps {
  /** Event page URL */
  eventPageUrl: string;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** X (Twitter) share URL */
    shareUrl: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays X share element.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.XShare eventPageUrl={eventPageUrl} />
 *
 * // asChild with primitive
 * <Event.XShare asChild eventPageUrl={eventPageUrl}>
 *   <a />
 * </Event.XShare>
 *
 * // asChild with react component
 * <Event.XShare asChild>
 *   {React.forwardRef(({ shareUrl, ...props }, ref) => (
 *     <button ref={ref} onClick={() => window.open(shareUrl, '_blank')} />
 *   ))}
 * </Event.XShare>
 * ```
 */
export const XShare = React.forwardRef<HTMLElement, XShareProps>(
  (props, ref) => {
    const { eventPageUrl, asChild, children, className, ...otherProps } = props;

    const shareUrl = `https://x.com/intent/post?url=${encodeURIComponent(eventPageUrl)}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventXShare}
        customElement={children}
        customElementProps={{ shareUrl }}
        href={shareUrl}
        target="_blank"
        rel="noreferrer"
        {...otherProps}
      >
        <a />
      </AsChildSlot>
    );
  },
);

/**
 * Props for the Event AddToGoogleCalendar component.
 */
export interface AddToGoogleCalendarProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Google calendar URL */
    url: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays link to add the event to Google calendar.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.AddToGoogleCalendar />
 *
 * // asChild with primitive
 * <Event.AddToGoogleCalendar asChild>
 *   <a />
 * </Event.AddToGoogleCalendar>
 *
 * // asChild with react component
 * <Event.AddToGoogleCalendar asChild>
 *   {React.forwardRef(({ url, ...props }, ref) => (
 *     <button ref={ref} onClick={() => window.open(url, '_blank')} />
 *   ))}
 * </Event.AddToGoogleCalendar>
 * ```
 */
export const AddToGoogleCalendar = React.forwardRef<
  HTMLElement,
  AddToGoogleCalendarProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreEvent.AddToGoogleCalendar>
      {({ url }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.eventAddToGoogleCalendar}
          customElement={children}
          customElementProps={{ url }}
          href={url}
          target="_blank"
          rel="noreferrer"
          {...otherProps}
        >
          <a />
        </AsChildSlot>
      )}
    </CoreEvent.AddToGoogleCalendar>
  );
});

/**
 * Props for the Event AddToIcsCalendar component.
 */
export interface AddToIcsCalendarProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** ICS calendar URL */
    url: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays link to add the event to ICS calendar.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.AddToIcsCalendar />
 *
 * // asChild with primitive
 * <Event.AddToIcsCalendar asChild>
 *   <a />
 * </Event.AddToIcsCalendar>
 *
 * // asChild with react component
 * <Event.AddToIcsCalendar asChild>
 *   {React.forwardRef(({ url, ...props }, ref) => (
 *     <button ref={ref} onClick={() => window.open(url, '_blank')} />
 *   ))}
 * </Event.AddToIcsCalendar>
 * ```
 */
export const AddToIcsCalendar = React.forwardRef<
  HTMLElement,
  AddToIcsCalendarProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreEvent.AddToIcsCalendar>
      {({ url }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.eventAddToIcsCalendar}
          customElement={children}
          customElementProps={{ url }}
          href={url}
          target="_blank"
          rel="noreferrer"
          {...otherProps}
        >
          <a />
        </AsChildSlot>
      )}
    </CoreEvent.AddToIcsCalendar>
  );
});

/**
 * Props for the Event OtherEvents component.
 */
export interface OtherEventsProps {
  /** Number of other events to display, default: 3 */
  count?: number;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{
        /** List of other events */
        events: Event[];
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for other events.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <Event.OtherEvents count={5}>
 *   <Event.OtherEventRepeater>
 *     <Event.Image />
 *     <Event.Title />
 *   </Event.OtherEventRepeater>
 * </Event.OtherEvents>
 * ```
 */
export const OtherEvents = React.forwardRef<HTMLElement, OtherEventsProps>(
  (props, ref) => {
    const { count = 3, asChild, children, className, ...otherProps } = props;

    return (
      <CoreEvent.OtherEvents count={count}>
        {({ events }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.eventOtherEvents}
            customElement={children}
            customElementProps={{ events }}
            {...otherProps}
          >
            <div>{children as React.ReactNode}</div>
          </AsChildSlot>
        )}
      </CoreEvent.OtherEvents>
    );
  },
);

/**
 * Props for the Event OtherEventRepeater component.
 */
export interface OtherEventRepeaterProps {
  /** Number of other events to display, default: 3 */
  count?: number;
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the event element */
  className?: string;
}

/**
 * Repeater component that renders Event.Root for each event.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Event.OtherEventRepeater>
 *   <Event.Image />
 *   <Event.Title />
 * </Event.OtherEventRepeater>
 * ```
 */
export const OtherEventRepeater = (
  props: OtherEventRepeaterProps,
): React.ReactNode => {
  const { count = 3, children, className } = props;

  return (
    <CoreEvent.OtherEvents count={count}>
      {({ events }) =>
        events.map((event) => (
          <Root key={event._id} event={event} className={className}>
            {children}
          </Root>
        ))
      }
    </CoreEvent.OtherEvents>
  );
};

/**
 * Props for the Event Form component.
 */
export interface FormProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Thank you page URL */
  thankYouPageUrl?: string;
}

/**
 * Displays the event form.
 *
 * @component
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * <Event.Form>
 *   <Form.Loading />
 *   <Form.LoadingError />
 *   <Form.Fields fieldMap={FIELD_MAP} />
 * </Event.Form>
 * ```
 */
export const Form = React.forwardRef<HTMLDivElement, FormProps>(
  (props, ref) => {
    const { asChild, children, className, thankYouPageUrl, ...otherProps } =
      props;

    return (
      <CoreEvent.Form thankYouPageUrl={thankYouPageUrl}>
        {({ formId, onSubmit }) => (
          <FormPrimitive.Root
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.eventForm}
            formServiceConfig={{ formId, onSubmit }}
            {...otherProps}
          >
            {children}
          </FormPrimitive.Root>
        )}
      </CoreEvent.Form>
    );
  },
);
