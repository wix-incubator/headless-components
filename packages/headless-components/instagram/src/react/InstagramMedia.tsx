import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreInstagramMedia from './core/InstagramMedia.js';

export enum TestIds {
  instagramMediaCaption = 'instagram-media-caption',
  instagramMediaType = 'instagram-media-type',
  instagramMediaUserName = 'instagram-media-username',
  instagramMediaTimestamp = 'instagram-media-timestamp',
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
        {({ mediaType, type }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramMediaType}
            customElement={children}
            customElementProps={{ mediaType }}
            content={type}
            {...otherProps}
          >
            <span>{type}</span>
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



export const InstagramMedia = {
  Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Caption,
  MediaType,
  UserName,
  Timestamp,
  // lowercase aliases (new interface)
  caption: Caption,
  mediaType: MediaType,
  userName: UserName,
  timestamp: Timestamp,
};

// End of InstagramMedia namespace
