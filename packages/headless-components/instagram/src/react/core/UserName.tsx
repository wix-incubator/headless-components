import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../../services/index.js';

export interface UserNameProps {
  /** Render prop function that receives username data */
  children: (props: UserNameRenderProps) => React.ReactNode;
}

/**
 * Render props for UserName component
 */
export interface UserNameRenderProps {
  /** Display name (Instagram username) */
  displayName: string;
  /** Formatted display value with @ prefix */
  displayValue: string;
}

/**
 * Headless component for Instagram account username
 * Handles service logic and provides render props with username data
 */
export function UserName(props: UserNameProps) {
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();

  const displayName =
    feedData.account?.instagramInfo?.instagramUsername || 'unknown';
  const displayValue = `@${displayName}`;

  return props.children({
    displayName,
    displayValue,
  });
}
