import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramMediaItemService,
  InstagramMediaItemServiceDefinition,
} from '../services/index.js';
import * as CoreGalleryItems from './core/GalleryItems.js';

export interface GalleryItemRepeaterProps {
  children: React.ReactNode;
}

export const GalleryItemRepeater: React.FC<GalleryItemRepeaterProps> = ({ children }) => {
  return (
    <CoreGalleryItems.GalleryItems>
      {({ hasItems, mediaItems }) => {
        if (!hasItems) return null;

        return (
          <MediaGallery.ThumbnailRepeater>
            <ItemWrapper mediaItems={mediaItems}>{children}</ItemWrapper>
          </MediaGallery.ThumbnailRepeater>
        );
      }}
    </CoreGalleryItems.GalleryItems>
  );
};

const ItemWrapper: React.FC<{ children: React.ReactNode; mediaItems: any[] }> = ({ children, mediaItems }) => {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    return React.cloneElement(child as any, {
      ...child.props,
      children: child.props.asChild
        ? (mediaGalleryProps: { src: string; alt: string; index: number }) => {
            const { index } = mediaGalleryProps;
            const mediaItem = mediaItems[index];
            if (!mediaItem) return null;
            return (
              <WixServices
                servicesMap={createServicesMap().addService(
                  InstagramMediaItemServiceDefinition,
                  InstagramMediaItemService,
                  { mediaItem, index },
                )}
              >
                {typeof child.props.children === 'function'
                  ? child.props.children(mediaGalleryProps)
                  : child.props.children}
              </WixServices>
            );
          }
        : child.props.children,
    });
  });
};


