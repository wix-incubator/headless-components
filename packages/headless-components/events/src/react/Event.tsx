import { WixMediaImage } from '@wix/headless-media/react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import {
  LinkPreviewProviders,
  RichContent,
  RicosViewer,
  pluginAudioViewer,
  pluginCodeBlockViewer,
  pluginCollapsibleListViewer,
  pluginDividerViewer,
  pluginEmojiViewer,
  pluginFileUploadViewer,
  pluginGalleryViewer,
  pluginGiphyViewer,
  pluginHashtagViewer,
  pluginHtmlViewer,
  pluginImageViewer,
  pluginIndentViewer,
  pluginLineSpacingViewer,
  pluginLinkViewer,
  pluginLinkPreviewViewer,
  pluginSpoilerViewer,
  pluginVideoViewer,
  isRichContentEmpty,
  type RicosCustomStyles,
} from '@wix/ricos';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  EventService,
  EventServiceDefinition,
  type EventServiceConfig,
  type Event,
} from '../services/event-service.js';
import '@wix/ricos/css/ricos-viewer.global.css';
import '@wix/ricos/css/all-plugins-viewer.css';

enum TestIds {
  eventImage = 'event-image',
  eventTitle = 'event-title',
  eventDate = 'event-date',
  eventLocation = 'event-location',
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
 *       <Event.RsvpButton label="RSVP" />
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
  /** Whether to render as a child component */
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

    const eventService = useService(EventServiceDefinition);
    const event = eventService.event.get();
    const image = event.mainImage;

    return (
      <WixMediaImage
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventImage}
        media={{ image }}
        {...otherProps}
      >
        {children}
      </WixMediaImage>
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
 *   {React.forwardRef(({ title, ...props }, ref) => (
 *     <h1 ref={ref} {...props} className="text-4xl font-bold">
 *       {title}
 *     </h1>
 *   ))}
 * </Event.Title>
 * ```
 */
export const Title = React.forwardRef<HTMLElement, TitleProps>((props, ref) => {
  const { asChild, children, className } = props;

  const eventService = useService(EventServiceDefinition);
  const event = eventService.event.get();
  const title = event.title!;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.eventTitle}
      customElement={children}
      customElementProps={{ title }}
      content={title}
    >
      <span>{title}</span>
    </AsChildSlot>
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
 *   {React.forwardRef(({ date, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-sm font-medium">
 *       {date}
 *     </span>
 *   ))}
 * </Event.Date>
 * ```
 */
export const Date = React.forwardRef<HTMLElement, DateProps>((props, ref) => {
  const { asChild, children, className, format = 'short' } = props;

  const eventService = useService(EventServiceDefinition);
  const event = eventService.event.get();
  const date = event.dateAndTimeSettings!.dateAndTimeTbd
    ? event.dateAndTimeSettings!.dateAndTimeTbdMessage!
    : format === 'short'
      ? event.dateAndTimeSettings!.formatted!.startDate!
      : event.dateAndTimeSettings!.formatted!.dateAndTime!;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.eventDate}
      customElement={children}
      customElementProps={{ date }}
      content={date}
    >
      <span>{date}</span>
    </AsChildSlot>
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
    const { asChild, children, className, format = 'short' } = props;

    const eventService = useService(EventServiceDefinition);
    const event = eventService.event.get();
    const location =
      event.location!.locationTbd || format === 'short'
        ? event.location!.name!
        : // @ts-expect-error
          `${event.location!.name}, ${event.location!.address!.formatted}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventLocation}
        customElement={children}
        customElementProps={{ location }}
        content={location}
      >
        <span>{location}</span>
      </AsChildSlot>
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
 * Displays the event short description with customizable rendering following the documented API.
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
  const { asChild, children, className } = props;

  const eventService = useService(EventServiceDefinition);
  const event = eventService.event.get();
  const shortDescription = event.shortDescription;

  if (!shortDescription) {
    return null;
  }

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.eventDescription}
      customElement={children}
      customElementProps={{ shortDescription }}
      content={shortDescription}
    >
      <span>{shortDescription}</span>
    </AsChildSlot>
  );
});

/**
 * Props for the Event Description component.
 */
export interface DescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: RichContent }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Theme custom styles */
  customStyles?: RicosCustomStyles;
}

/**
 * Displays the event description following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.Description />
 *
 * // asChild with react component
 * <Event.Description asChild>
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <RicosViewer ref={ref} content={description} plugins={plugins} />
 *   ))}
 * </Event.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, className, customStyles } = props;

    const eventService = useService(EventServiceDefinition);
    const event = eventService.event.get();
    const description = event.description as RichContent | undefined;

    if (!description || isRichContentEmpty(description)) {
      return null;
    }

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventDescription}
        customElement={children}
        customElementProps={{ description }}
      >
        <RicosViewer
          content={description}
          theme={{ customStyles }}
          plugins={[
            pluginAudioViewer(),
            pluginCodeBlockViewer(),
            pluginCollapsibleListViewer(),
            pluginDividerViewer(),
            pluginEmojiViewer(),
            pluginFileUploadViewer(),
            pluginGalleryViewer(),
            pluginGiphyViewer(),
            pluginHashtagViewer(),
            pluginHtmlViewer(),
            pluginImageViewer(),
            pluginIndentViewer(),
            pluginLineSpacingViewer(),
            pluginLinkViewer(),
            pluginLinkPreviewViewer({
              exposeEmbedButtons: [
                LinkPreviewProviders.Instagram,
                LinkPreviewProviders.Twitter,
                LinkPreviewProviders.TikTok,
              ],
            }),
            pluginSpoilerViewer(),
            pluginVideoViewer(),
          ]}
        />
      </AsChildSlot>
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
  children?: AsChildChildren<{ event: Event }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** The label to display inside the button */
  label?: string;
}

/**
 * Displays button for RSVP functionality with customizable rendering following the documented API.
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
 *   {React.forwardRef(({ event, ...props }, ref) => (
 *     <button ref={ref} {...props}>
 *       RSVP
 *     </button>
 *   ))}
 * </Event.RsvpButton>
 * ```
 */
export const RsvpButton = React.forwardRef<HTMLElement, RsvpButtonProps>(
  (props, ref) => {
    const { asChild, children, className, label } = props;

    const eventService = useService(EventServiceDefinition);
    const event = eventService.event.get();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventRsvpButton}
        customElement={children}
        customElementProps={{ event }}
      >
        <button>{label}</button>
      </AsChildSlot>
    );
  },
);

/**
 * Props for the Event FacebookShare component.
 */
export interface FacebookShareProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ eventUrl: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays Facebook share element with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.FacebookShare />
 *
 * // asChild with primitive
 * <Event.FacebookShare asChild>
 *   <a />
 * </Event.FacebookShare>
 *
 * // asChild with react component
 * <Event.FacebookShare asChild>
 *   {React.forwardRef(({ eventUrl, ...props }, ref) => (
 *     <button ref={ref} onClick={() => window.open(eventUrl, '_blank')} />
 *   ))}
 * </Event.FacebookShare>
 * ```
 */
export const FacebookShare = React.forwardRef<HTMLElement, FacebookShareProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const eventUrl = 'https://www.wix.com';
    const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventFacebookShare}
        customElement={children}
        customElementProps={{ eventUrl }}
        href={href}
        target="_blank"
        rel="noreferrer"
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
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ eventUrl: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays LinkedIn share element with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.LinkedInShare />
 *
 * // asChild with primitive
 * <Event.LinkedInShare asChild>
 *   <a />
 * </Event.LinkedInShare>
 *
 * // asChild with react component
 * <Event.LinkedInShare asChild>
 *   {React.forwardRef(({ eventUrl, ...props }, ref) => (
 *     <button ref={ref} onClick={() => window.open(eventUrl, '_blank')} />
 *   ))}
 * </Event.LinkedInShare>
 * ```
 */
export const LinkedInShare = React.forwardRef<HTMLElement, LinkedInShareProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const eventUrl = 'https://www.wix.com';
    const href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(eventUrl)}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventLinkedInShare}
        customElement={children}
        customElementProps={{ eventUrl }}
        href={href}
        target="_blank"
        rel="noreferrer"
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
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ eventUrl: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays X share element with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.XShare />
 *
 * // asChild with primitive
 * <Event.XShare asChild>
 *   <a />
 * </Event.XShare>
 *
 * // asChild with react component
 * <Event.XShare asChild>
 *   {React.forwardRef(({ eventUrl, ...props }, ref) => (
 *     <button ref={ref} onClick={() => window.open(eventUrl, '_blank')} />
 *   ))}
 * </Event.XShare>
 * ```
 */
export const XShare = React.forwardRef<HTMLElement, XShareProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const eventUrl = 'https://www.wix.com';
    const href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}`;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventXShare}
        customElement={children}
        customElementProps={{ eventUrl }}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <a />
      </AsChildSlot>
    );
  },
);

export interface AddToGoogleCalendarProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ url: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export const AddToGoogleCalendar = React.forwardRef<
  HTMLElement,
  AddToGoogleCalendarProps
>((props, ref) => {
  const { asChild, children, className } = props;

  const eventService = useService(EventServiceDefinition);
  const event = eventService.event.get();
  const url = event.calendarUrls?.google;

  if (!url) {
    return null;
  }

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
    >
      <a />
    </AsChildSlot>
  );
});

export interface AddToIcsCalendarProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ url: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

export const AddToIcsCalendar = React.forwardRef<
  HTMLElement,
  AddToIcsCalendarProps
>((props, ref) => {
  const { asChild, children, className } = props;

  const eventService = useService(EventServiceDefinition);
  const event = eventService.event.get();
  const url = event.calendarUrls?.ics;

  if (!url) {
    return null;
  }

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
    >
      <a />
    </AsChildSlot>
  );
});
