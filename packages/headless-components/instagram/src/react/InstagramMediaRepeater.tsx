import React from 'react';
import { WixServices, useService } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramFeedServiceDefinition,
  InstagramMediaItemServiceDefinition,
  InstagramMediaItemService,
} from '../services/index.js';

export interface InstagramMediaRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeats children for each Instagram media item, providing a per-item service context.
 */
export const InstagramMediaRepeater: React.FC<InstagramMediaRepeaterProps> = ({ children }) => {
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();
  const { mediaItems } = feedData;

  if (!mediaItems.length) return null;

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
};


