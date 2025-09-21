import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';

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

export const Caption = React.forwardRef<HTMLElement, CaptionProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const { caption } = mediaItemService.mediaItem.get();

  return (
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
  );
});

export interface MediaTypeProps {
  asChild?: boolean;
  children?: AsChildChildren<{ mediaType: 'image' | 'video' | 'carousel' }>;
  className?: string;
}

export const MediaType = React.forwardRef<HTMLElement, MediaTypeProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const { type } = mediaItemService.mediaItem.get();

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.instagramMediaType}
      customElement={children}
      customElementProps={{ mediaType: type }}
      content={type}
      {...otherProps}
    >
      <span>{type}</span>
    </AsChildSlot>
  );
});

export interface UserNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ userName?: string }>;
  className?: string;
}

export const UserName = React.forwardRef<HTMLElement, UserNameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  // Username is part of account, not media item; keep for interface compatibility
  const userName = undefined as unknown as string | undefined;

  return (
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
  );
});

export interface TimestampProps {
  asChild?: boolean;
  children?: AsChildChildren<{ timestamp: string }>;
  className?: string;
}

export const Timestamp = React.forwardRef<HTMLElement, TimestampProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const { timestamp } = mediaItemService.mediaItem.get();

  return (
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
  );
});

export interface MediaGalleriesProps {
  children: React.ReactNode;
  className?: string;
}

export const MediaGalleries = React.forwardRef<HTMLDivElement, MediaGalleriesProps>((props, ref) => {
  const { children, className, ...otherProps } = props;
  return (
    <div ref={ref} className={className} data-testid={TestIds.instagramMediaGalleries} {...otherProps}>
      {children}
    </div>
  );
});

export interface MediaGalleryRepeaterProps {
  children: React.ReactNode;
}

export const MediaGalleryRepeater: React.FC<MediaGalleryRepeaterProps> = ({ children }) => {
  // For compatibility with the docs interface, simply render children.
  // In practice, the example uses <MediaGallery.Root /> inside.
  return <>{children}</>;
};

export const InstagramMedia = {
  caption: Caption,
  mediaType: MediaType,
  userName: UserName,
  timestamp: Timestamp,
  MediaGalleries,
  MediaGalleryRepeater,
};

// End of InstagramMedia namespace
