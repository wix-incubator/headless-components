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
import '@wix/ricos/css/plugin-hashtag-viewer.global.css';
import '@wix/ricos/css/plugin-spoiler-viewer.global.css';

enum TestIds {
  eventImage = 'event-image',
  eventTitle = 'event-title',
  eventDate = 'event-date',
  eventLocation = 'event-location',
  eventDescription = 'event-description',
  eventRsvpButton = 'event-rsvp-button',
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

    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const image = event.mainImage;

    return (
      <WixMediaImage
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventImage}
        children={children}
        media={{ image }}
        {...otherProps}
      />
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
      <div>{title}</div>
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
      <div>{date}</div>
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
        <div>{location}</div>
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
 *   {React.forwardRef(({shortDescription, ...props}, ref) => (
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

  const service = useService(EventServiceDefinition);
  const event = service.event.get();
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
      <div>{shortDescription}</div>
    </AsChildSlot>
  );
});

/**
 * Props for the Event Description component.
 */
export interface DescriptionProps {}

/**
 * Displays the event description following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.Description />
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (_props, ref) => {
    const service = useService(EventServiceDefinition);
    const event = service.event.get();
    const description = event.description as RichContent | undefined;

    if (!description || isRichContentEmpty(description)) {
      return null;
    }

    return (
      <RicosViewer
        ref={ref as React.Ref<RicosViewer>}
        content={description}
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
    );
  },
);

/**
 * Props for the Event RsvpButton component.
 */
export interface RsvpButtonProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display inside the RSVP button */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays button for RSVP functionality with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Event.RsvpButton className="w-full">
 *   RSVP
 * </Event.RsvpButton>
 *
 * // asChild with primitive
 * <Event.RsvpButton asChild>
 *   <button className="w-full">RSVP</button>
 * </Event.RsvpButton>
 * ```
 */
export const RsvpButton = React.forwardRef<HTMLElement, RsvpButtonProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.eventRsvpButton}
        customElement={children}
        onClick={() => {}}
      >
        <button>{children}</button>
      </AsChildSlot>
    );
  },
);
