import { WixMediaImage } from '@wix/headless-media/react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import { type Event, type RichContent } from '../services/event-service.js';
import { hasDescription } from '../utils/event.js';
import * as CoreEvent from './core/Event.js';

enum TestIds {
  eventRoot = 'event-root',
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
}

/**
 * Props for the Event Root component.
 */
export interface RootProps {
  /** Event */
  event: Event;
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
  const { event, asChild, children, className, ...otherProps } = props;

  return (
    <CoreEvent.Root event={event}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
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
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CoreEvent.Root>
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
    src: string;
    width?: number;
    height?: number;
    alt: string;
  }>;
}

/**
 * Displays the event image using WixMediaImage component with customizable rendering.
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
  children?: AsChildChildren<{ title: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the event title with customizable rendering.
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
  children?: AsChildChildren<{ date: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Format of the event date */
  format?: 'short' | 'full'; // Default: 'short'
}

/**
 * Displays the event date with customizable rendering and format options.
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
 *   {React.forwardRef(({ date, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {date}
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
    ...otherProps
  } = props;

  return (
    <CoreEvent.Date format={format}>
      {({ date }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.eventDate}
          customElement={children}
          customElementProps={{ date }}
          content={date}
          {...otherProps}
        >
          <span>{date}</span>
        </AsChildSlot>
      )}
    </CoreEvent.Date>
  );
});

/**
 * Props for the Event Location component.
 */
export interface LocationProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ location: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Format of the event location */
  format?: 'short' | 'full'; // Default: 'short'
}

/**
 * Displays the event location with customizable rendering and format options.
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
 *   {React.forwardRef(({ location, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {location}
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
        {({ location }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.eventLocation}
            customElement={children}
            customElementProps={{ location }}
            content={location}
            {...otherProps}
          >
            <span>{location}</span>
          </AsChildSlot>
        )}
      </CoreEvent.Location>
    );
  },
);

/**
 * Props for the Event Coordinates component.
 */
export interface CoordinatesProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ latitude: number; longitude: number }>;
}

/**
 * Provides the event location coordinates. Only rendered if the event has coordinates.
 *
 * @component
 * @example
 * ```tsx
 * // asChild with react component
 * <Event.Coordinates asChild>
 *   {React.forwardRef(({ latitude, longitude, ...props }, ref) => (
 *     <MapComponent ref={ref} {...props} latitude={latitude} longitude={longitude} />
 *   ))}
 * </Event.Coordinates>
 * ```
 */
export const Coordinates = React.forwardRef<HTMLElement, CoordinatesProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <CoreEvent.Coordinates>
        {({ latitude, longitude }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            customElement={children}
            customElementProps={{ latitude, longitude }}
            {...otherProps}
          />
        )}
      </CoreEvent.Coordinates>
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
  children?: AsChildChildren<{ shortDescription: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the event short description with customizable rendering.
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
      {({ shortDescription }) => {
        return (
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
        );
      }}
    </CoreEvent.ShortDescription>
  );
});

/**
 * Props for the Event Description component.
 */
export interface DescriptionProps {
  /** Custom render function */
  children: AsChildChildren<{ description: RichContent }>;
}

/**
 * Provides the event description.
 *
 * @component
 * @example
 * ```tsx
 * // Usage with react component
 * <Event.Description asChild>
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
        {({ description }) => {
          return (
            <AsChildSlot
              asChild
              ref={ref}
              data-testid={TestIds.eventDescription}
              customElement={children}
              customElementProps={{ description }}
              {...otherProps}
            />
          );
        }}
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
  children?: AsChildChildren<{ eventSlug: string; ticketed: boolean }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** The label to display inside the button */
  label?: string;
}

/**
 * Displays the event RSVP button with customizable rendering.
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
 *   {React.forwardRef(({ eventSlug, ticketed, ...props }, ref) => (
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
        {({ eventSlug, ticketed }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.eventRsvpButton}
            data-ticketed={ticketed}
            customElement={children}
            customElementProps={{ eventSlug, ticketed }}
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
  children?: AsChildChildren<{}>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays Facebook share element with customizable rendering.
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
 *   {React.forwardRef((props, ref) => (
 *     <button ref={ref} onClick={() => window.open(eventPageUrl, '_blank')} />
 *   ))}
 * </Event.FacebookShare>
 * ```
 */
export const FacebookShare = React.forwardRef<HTMLElement, FacebookShareProps>(
  (props, ref) => {
    const { eventPageUrl, asChild, children, className, ...otherProps } = props;

    const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventPageUrl)}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventFacebookShare}
        customElement={children}
        customElementProps={{}}
        href={href}
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
  children?: AsChildChildren<{}>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays LinkedIn share element with customizable rendering.
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
 *   {React.forwardRef((props, ref) => (
 *     <button ref={ref} onClick={() => window.open(eventPageUrl, '_blank')} />
 *   ))}
 * </Event.LinkedInShare>
 * ```
 */
export const LinkedInShare = React.forwardRef<HTMLElement, LinkedInShareProps>(
  (props, ref) => {
    const { eventPageUrl, asChild, children, className, ...otherProps } = props;

    const href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(eventPageUrl)}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventLinkedInShare}
        customElement={children}
        customElementProps={{}}
        href={href}
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
  children?: AsChildChildren<{}>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays X share element with customizable rendering.
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
 *   {React.forwardRef((props, ref) => (
 *     <button ref={ref} onClick={() => window.open(eventPageUrl, '_blank')} />
 *   ))}
 * </Event.XShare>
 * ```
 */
export const XShare = React.forwardRef<HTMLElement, XShareProps>(
  (props, ref) => {
    const { eventPageUrl, asChild, children, className, ...otherProps } = props;

    const href = `https://x.com/intent/post?url=${encodeURIComponent(eventPageUrl)}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventXShare}
        customElement={children}
        customElementProps={{}}
        href={href}
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
  children?: AsChildChildren<{ url: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the event add to Google calendar link with customizable rendering.
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
      {({ url }) => {
        return (
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
        );
      }}
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
  children?: AsChildChildren<{ url: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the event add to ICS calendar link with customizable rendering.
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
      {({ url }) => {
        return (
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
        );
      }}
    </CoreEvent.AddToIcsCalendar>
  );
});

/**
 * Props for the Event Type component.
 */
export interface TypeProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    ticketed: boolean;
    rsvp: boolean;
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
  const { asChild, children, ...otherProps } = props;

  return (
    <CoreEvent.Type>
      {({ ticketed, rsvp, external }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={{ ticketed, rsvp, external }}
          {...otherProps}
        />
      )}
    </CoreEvent.Type>
  );
});
