import React from 'react';
import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramMediaItemServiceDefinition,
  InstagramMediaItemService,
} from '../services/index.js';
import * as CoreGalleryItems from './core/GalleryItems.js';

export interface InstagramMediaRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeats children for each Instagram media item, providing a per-item service context.
 */
export const InstagramMediaRepeater: React.FC<InstagramMediaRepeaterProps> = ({ children }) => {
  return (
    <CoreGalleryItems.GalleryItems>
      {({ hasItems, mediaItems }) => {
        if (!hasItems) return null;

        return (
          <>
            {mediaItems.map((mediaItem, index) => (
              <WixServices
                key={mediaItem.id || index}
                servicesMap={createServicesMap().addService(
                  InstagramMediaItemServiceDefinition,
                  InstagramMediaItemService,
                  { mediaItem, index }
                )}
              >
                {children}
              </WixServices>
            ))}
          </>
        );
      }}
    </CoreGalleryItems.GalleryItems>
  );
};


