import React from 'react';
import { createServicesMap } from '@wix/services-manager';
import { WixServices } from '@wix/services-manager-react';
import {
  InstagramFeedService,
  InstagramFeedServiceDefinition,
  type InstagramFeedServiceConfig,
} from '../../services/index.js';

export interface RootProps {
  instagramFeedServiceConfig: InstagramFeedServiceConfig;
  children: React.ReactNode;
}

export function Root(props: RootProps): React.ReactNode {
  const { children, instagramFeedServiceConfig } = props;
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        InstagramFeedServiceDefinition,
        InstagramFeedService,
        instagramFeedServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}


