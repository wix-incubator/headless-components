import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../../services/index.js';

export function UserName(props: { children: (data: { username: string | null }) => React.ReactNode }) {
  const service = useService(InstagramFeedServiceDefinition);
  const feed = service.feedData.get();
  const account: any = feed.account || {};
  const username: string | null =
    account?.username ?? account?.instagramInfo?.instagramUsername ?? null;
  return <>{props.children({ username })}</>;
}


