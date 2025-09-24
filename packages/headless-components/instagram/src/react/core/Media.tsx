import React from 'react';
import { CoreMediaContext } from './MediaContext.js';

export function Media(props: {
  media: any;
  children: (data: { media: any }) => React.ReactNode;
}) {
  const { media, children } = props;
  return <CoreMediaContext.Provider value={media}>{children({ media })}</CoreMediaContext.Provider>;
}

export function Caption(props: { children: (data: { caption?: string | null }) => React.ReactNode }) {
  const media = React.useContext(CoreMediaContext);
  return <>{props.children({ caption: media?.caption ?? null })}</>;
}

export function MediaType(props: { children: (data: { mediaType?: 'image' | 'video' | 'carousel' }) => React.ReactNode }) {
  const media = React.useContext(CoreMediaContext);
  return <>{props.children({ mediaType: media?.type })}</>;
}

export function MediaUserName(props: { children: (data: { userName?: string | null }) => React.ReactNode }) {
  // Username is not part of the media item in this implementation; return undefined for parity
  return <>{props.children({ userName: undefined })}</>;
}

export function Timestamp(props: { children: (data: { timestamp?: string }) => React.ReactNode }) {
  const media = React.useContext(CoreMediaContext);
  return <>{props.children({ timestamp: media?.timestamp })}</>;
}


