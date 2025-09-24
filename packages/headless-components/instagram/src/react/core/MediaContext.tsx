import React from 'react';

export type CoreMedia = {
  id?: string;
  type?: 'image' | 'video' | 'carousel';
  mediaUrl?: string;
  thumbnailUrl?: string | null;
  caption?: string | null;
  timestamp?: string;
  altText?: string | null;
};

export const CoreMediaContext = React.createContext<CoreMedia | null>(null);


