import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../../services/index.js';

export function Content(props: {
  children: (data: { title: string; userName: string | null; hashtag: string | null }) => React.ReactNode;
}) {
  const service = useService(InstagramFeedServiceDefinition);
  const feed = service.feedData.get();
  const account: any = feed.account || {};

  const userName: string | null =
    account?.username ?? account?.instagramInfo?.instagramUsername ?? null;
  const displayName: string | null = account?.name ?? null;
  const title = displayName || 'Instagram Feed';
  const hashtag: string | null = null;

  return <>{props.children({ title, userName, hashtag })}</>;
}


