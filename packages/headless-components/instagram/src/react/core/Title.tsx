import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../../services/index.js';

export function Title(props: { children: (data: { title: string }) => React.ReactNode }) {
  const service = useService(InstagramFeedServiceDefinition);
  const feed = service.feedData.get();
  const account: any = feed.account || {};
  const displayName: string | null = account?.name ?? null;
  const title = displayName || 'Instagram Feed';
  return <>{props.children({ title })}</>;
}


