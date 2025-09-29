import { Event as EventPrimitive } from '@wix/headless-events/react';
import {
  LinkPreviewProviders,
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
  type RichContent,
} from '@wix/ricos';
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

import '@wix/ricos/css/ricos-viewer.global.css';
import '@wix/ricos/css/plugin-audio-viewer.global.css';
import '@wix/ricos/css/plugin-collapsible-list-viewer.global.css';
import '@wix/ricos/css/plugin-divider-viewer.global.css';
import '@wix/ricos/css/plugin-file-upload-viewer.global.css';
import '@wix/ricos/css/plugin-gallery-viewer.global.css';
import '@wix/ricos/css/plugin-giphy-viewer.global.css';
import '@wix/ricos/css/plugin-hashtag-viewer.global.css';
import '@wix/ricos/css/plugin-html-viewer.global.css';
import '@wix/ricos/css/plugin-image-viewer.global.css';
import '@wix/ricos/css/plugin-link-preview-viewer.global.css';
import '@wix/ricos/css/plugin-link-viewer.global.css';
import '@wix/ricos/css/plugin-spoiler-viewer.global.css';
import '@wix/ricos/css/plugin-video-viewer.global.css';

/**
 * Root component for event display.
 * Provides context for all event related components like title, date, location, description, etc.
 *
 * @component
 * @example
 * ```tsx
 * <Event event={event}>
 *   <EventTitle />
 *   <EventShortDescription />
 *   <EventDate />
 *   <EventLocation />
 * </Event>
 * ```
 */
export const Event = EventPrimitive.Root;

const eventTitleVariants = cva('font-heading text-foreground', {
  variants: {
    variant: {
      lg: 'text-2xl',
      xl: 'text-3xl sm:text-6xl',
    },
  },
  defaultVariants: {
    variant: 'lg',
  },
});

export interface EventTitleProps
  extends React.ComponentPropsWithoutRef<typeof EventPrimitive.Title>,
    VariantProps<typeof eventTitleVariants> {}

/**
 * Displays the event title.
 * Can be rendered with different variants for different contexts.
 *
 * @component
 * @example
 * ```tsx
 * <Event>
 *   <EventTitle variant="xl" />
 *   <EventTitle variant="lg" />
 * </Event>
 * ```
 */
export const EventTitle = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.Title>,
  EventTitleProps
>(({ variant, className, ...props }, ref) => {
  return (
    <EventPrimitive.Title
      {...props}
      ref={ref}
      className={cn(eventTitleVariants({ variant }), className)}
    />
  );
});

EventTitle.displayName = 'EventTitle';

/**
 * Displays the event image.
 * Uses WixMediaImage component for optimized image rendering.
 *
 * @component
 */
export const EventImage = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof EventPrimitive.Image>
>(({ className, ...props }, ref) => {
  return (
    <EventPrimitive.Image
      {...props}
      ref={ref}
      className={cn('object-cover', className)}
    />
  );
});

EventImage.displayName = 'EventImage';

/**
 * Displays the event date.
 * Can be formatted as short or full date.
 *
 * @component
 */
export const EventDate = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.Date>,
  React.ComponentPropsWithoutRef<typeof EventPrimitive.Date>
>(({ className, ...props }, ref) => {
  return (
    <EventPrimitive.Date
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

EventDate.displayName = 'EventDate';

/**
 * Displays the event location.
 * Can be formatted as short or full location.
 *
 * @component
 */
export const EventLocation = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.Location>,
  React.ComponentPropsWithoutRef<typeof EventPrimitive.Location>
>(({ className, ...props }, ref) => {
  return (
    <EventPrimitive.Location
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

EventLocation.displayName = 'EventLocation';

/**
 * Provides the event coordinates.
 *
 * @component
 */
export const EventCoordinates = EventPrimitive.Coordinates;

/**
 * Displays the event short description.
 * Brief summary of the event.
 *
 * @component
 */
export const EventShortDescription = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.ShortDescription>,
  React.ComponentPropsWithoutRef<typeof EventPrimitive.ShortDescription>
>(({ className, ...props }, ref) => {
  return (
    <EventPrimitive.ShortDescription
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

EventShortDescription.displayName = 'EventShortDescription';

/**
 * Displays the event description.
 * Full rich content description using RicosViewer.
 *
 * @component
 */
export const EventDescription = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof EventPrimitive.Description>
>((props, ref) => {
  return (
    <EventPrimitive.Description {...props} ref={ref}>
      {({ description }) => (
        <RicosViewer
          content={description as RichContent}
          theme={{
            // TODO: add missing styles
            customStyles: {
              p: {
                color: 'var(--wix-theme-foreground)',
                fontFamily: 'var(--theme-font-family-paragraph)',
                fontWeight: 'var(--theme-font-weight-normal)',
              },
            },
          }}
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
      )}
    </EventPrimitive.Description>
  );
});

EventDescription.displayName = 'EventDescription';

const eventRsvpButtonVariants = cva(
  'bg-primary text-primary-foreground font-paragraph text-base text-center hover:bg-primary/80 w-full sm:w-auto',
  {
    variants: {
      variant: {
        base: 'py-2 px-10',
        lg: 'py-2 px-10 sm:py-3',
      },
    },
    defaultVariants: {
      variant: 'base',
    },
  }
);

export interface EventRsvpButtonProps
  extends React.ComponentPropsWithoutRef<typeof EventPrimitive.RsvpButton>,
    VariantProps<typeof eventRsvpButtonVariants> {}

/**
 * Displays the event RSVP button.
 *
 * @component
 */
export const EventRsvpButton = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.RsvpButton>,
  EventRsvpButtonProps
>(({ variant, className, label = 'RSVP', ...props }, ref) => {
  return (
    <EventPrimitive.RsvpButton
      {...props}
      ref={ref}
      className={cn(eventRsvpButtonVariants({ variant }), className)}
      label={label}
    />
  );
});

EventRsvpButton.displayName = 'EventRsvpButton';

/**
 * Displays Facebook share button for the event.
 *
 * @component
 */
export const EventFacebookShare = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.FacebookShare>,
  React.ComponentPropsWithoutRef<typeof EventPrimitive.FacebookShare>
>(({ className, ...props }, ref) => {
  return (
    <EventPrimitive.FacebookShare
      {...props}
      ref={ref}
      className={cn('font-paragraph text-foreground', className)}
    />
  );
});

EventFacebookShare.displayName = 'EventFacebookShare';

/**
 * Displays LinkedIn share button for the event.
 *
 * @component
 */
export const EventLinkedInShare = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.LinkedInShare>,
  React.ComponentPropsWithoutRef<typeof EventPrimitive.LinkedInShare>
>(({ className, ...props }, ref) => {
  return (
    <EventPrimitive.LinkedInShare
      {...props}
      ref={ref}
      className={cn('font-paragraph text-foreground', className)}
    />
  );
});

EventLinkedInShare.displayName = 'EventLinkedInShare';

/**
 * Displays X share button for the event.
 *
 * @component
 */
export const EventXShare = React.forwardRef<
  React.ElementRef<typeof EventPrimitive.XShare>,
  React.ComponentPropsWithoutRef<typeof EventPrimitive.XShare>
>(({ className, ...props }, ref) => {
  return (
    <EventPrimitive.XShare
      {...props}
      ref={ref}
      className={cn('font-paragraph text-foreground', className)}
    />
  );
});

EventXShare.displayName = 'EventXShare';
