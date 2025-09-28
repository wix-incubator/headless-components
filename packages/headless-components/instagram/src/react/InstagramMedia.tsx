import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreInstagramMedia from './core/InstagramMedia.js';
import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramMediaItemServiceDefinition,
  InstagramMediaItemService,
} from '../services/index.js';
import * as CoreInstagramMedias from './core/InstagramMedias.js';
import { MediaGallery } from '@wix/headless-media/react';

export interface MediaGalleryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeats children for each Instagram media item, providing a per-item service context.
 */
export const MediaGalleryRepeater: React.FC<MediaGalleryRepeaterProps> = ({
  children,
}) => {
  return (
    <CoreInstagramMedias.InstagramMedias>
      {({ hasItems, mediaItems }) => {
        console.log('mediaItems', mediaItems);
        if (!hasItems) return null;

        return (
          <>
            {mediaItems.map((mediaItem, index) => {
              console.log('mediaItem', mediaItem.mediaGalleryItems);
              return <WixServices
                key={mediaItem.id || index}
                servicesMap={createServicesMap().addService(
                  InstagramMediaItemServiceDefinition,
                  InstagramMediaItemService,
                  { mediaItem, index },
                )}
              >
                <MediaGallery.Root
                  mediaGalleryServiceConfig={{ media:  mediaItem.mediaGalleryItems }}
                >
                  {children as React.ReactElement}
                </MediaGallery.Root>
              </WixServices>
      })}
          </>
        );
      }}
    </CoreInstagramMedias.InstagramMedias>
  );
};

export enum TestIds {
  instagramMediaCaption = 'instagram-media-caption',
  instagramMediaType = 'instagram-media-type',
  instagramMediaUserName = 'instagram-media-username',
  instagramMediaTimestamp = 'instagram-media-timestamp',
  instagramMediaGalleries = 'instagram-media-galleries',
}

export interface CaptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ caption?: string }>;
  className?: string;
}

export const Caption = React.forwardRef<HTMLElement, CaptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreInstagramMedia.Caption>
        {({ caption }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramMediaCaption}
            customElement={children}
            customElementProps={{ caption }}
            content={caption ?? ''}
            {...otherProps}
          >
            <span>{caption}</span>
          </AsChildSlot>
        )}
      </CoreInstagramMedia.Caption>
    );
  },
);

export interface MediaTypeProps {
  asChild?: boolean;
  children?: AsChildChildren<{ mediaType: 'image' | 'video' | 'carousel' }>;
  className?: string;
}

export const MediaType = React.forwardRef<HTMLElement, MediaTypeProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreInstagramMedia.MediaType>
        {({ mediaType }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramMediaType}
            customElement={children}
            customElementProps={{ mediaType }}
            content={mediaType}
            {...otherProps}
          >
            <span>{mediaType}</span>
          </AsChildSlot>
        )}
      </CoreInstagramMedia.MediaType>
    );
  },
);

export interface UserNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ userName?: string }>;
  className?: string;
}

export const UserName = React.forwardRef<HTMLElement, UserNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreInstagramMedia.UserName>
        {({ userName }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramMediaUserName}
            customElement={children}
            customElementProps={{ userName }}
            content={userName ?? ''}
            {...otherProps}
          >
            <span>{userName}</span>
          </AsChildSlot>
        )}
      </CoreInstagramMedia.UserName>
    );
  },
);

export interface TimestampProps {
  asChild?: boolean;
  children?: AsChildChildren<{ timestamp: string }>;
  className?: string;
}

export const Timestamp = React.forwardRef<HTMLElement, TimestampProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreInstagramMedia.Timestamp>
        {({ timestamp }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramMediaTimestamp}
            customElement={children}
            customElementProps={{ timestamp }}
            content={timestamp}
            {...otherProps}
          >
            <time dateTime={timestamp}>{timestamp}</time>
          </AsChildSlot>
        )}
      </CoreInstagramMedia.Timestamp>
    );
  },
);
export interface MediaGalleriesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
}

export const MediaGalleries = React.forwardRef<
  HTMLDivElement,
  MediaGalleriesProps
>((props, ref) => {
  const { children, className, ...otherProps } = props;
  return (
    <div
      ref={ref}
      className={className}
      data-testid={TestIds.instagramMediaGalleries}
      {...otherProps}
    >
      {children}
    </div>
  );
});


export interface MediaGalleryItemsProps {
  children: React.ReactNode;
  className?: string;
}

export const MediaGalleryItems = React.forwardRef<
  HTMLDivElement,
  MediaGalleryItemsProps
>(({ children, className, ...otherProps }, ref) => {
  return (
    <div ref={ref} className={className} {...otherProps}>
      {children}
    </div>
  );
});

export const InstagramMedia = {
  Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Caption,
  MediaType,
  UserName,
  Timestamp,
  MediaGalleries,
  MediaGalleryItems,
  MediaGalleryRepeater,
  // lowercase aliases (new interface)
  caption: Caption,
  mediaType: MediaType,
  userName: UserName,
  timestamp: Timestamp,
};

// End of InstagramMedia namespace
