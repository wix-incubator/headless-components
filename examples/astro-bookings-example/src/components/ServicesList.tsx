import React from 'react';
import {
  List,
  Options,
  ServiceRepeater,
  Service,
  Error,
} from '@wix/headless-services/react';
import type { ServicesListServiceConfig } from '@wix/headless-services/services';
import type { services } from '@wix/bookings';

interface ServicesListDemoProps {
  initialServices?: ServicesListServiceConfig;
}

export function ServicesListDemo({ initialServices }: ServicesListDemoProps) {
  if (!initialServices) {
    return null;
  }

  return <div />;
}
