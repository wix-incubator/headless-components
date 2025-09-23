import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../../services/index.js';

export function Medias(props: {
  children: (data: { hasItems: boolean; items: any[] }) => React.ReactNode;
}) {
  const service = useService(InstagramFeedServiceDefinition);
  const items = service.feedData.get().mediaItems;
  const hasItems = items.length > 0;
  return <>{props.children({ hasItems, items })}</>;
}


