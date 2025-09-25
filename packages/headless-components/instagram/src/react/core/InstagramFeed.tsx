import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramFeedService,
  InstagramFeedServiceDefinition,
  type InstagramFeedServiceConfig,
  type InstagramAccount,
  type InstagramMediaItem,
} from '../../services/instagram-feed-service.js';

export interface RootProps {
  /** Child components that will have access to the Instagram feed service */
  children: React.ReactNode;
  /** Configuration for the Instagram feed service */
  instagramFeedServiceConfig: InstagramFeedServiceConfig;
}

/**
 * Instagram Feed Root core component that provides feed service context.
 * This component sets up the necessary services for rendering and managing Instagram feed data.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { InstagramFeed } from '@wix/instagram/components';
 *
 * function InstagramFeedPage() {
 *   return (
 *     <InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'my_account' }}>
 *       <InstagramFeed.Title>
 *         {({ title }) => (
 *           <h1 className="text-4xl font-bold">{title}</h1>
 *         )}
 *       </InstagramFeed.Title>
 *     </InstagramFeed.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  const { instagramFeedServiceConfig, children } = props;

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

export interface TitleProps {
  /** Render prop function */
  children: (props: TitleRenderProps) => React.ReactNode;
}

export interface TitleRenderProps {
  /** Instagram feed title */
  title: string;
}

/**
 * Instagram Feed Title render prop component.
 * Provides access to the Instagram feed title through render props.
 *
 * @component
 */
export function Title(props: TitleProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramFeedServiceDefinition);
  const feedData = service.feedData.get();

  const title = feedData?.account?.instagramInfo?.instagramUsername
    ? `@${feedData.account.instagramInfo.instagramUsername}'s Instagram`
    : 'Instagram Feed';

  return children({ title });
}

export interface UserNameProps {
  /** Render prop function */
  children: (props: UserNameRenderProps) => React.ReactNode;
}

export interface UserNameRenderProps {
  /** Instagram username */
  username: string;
}

/**
 * Instagram Feed UserName render prop component.
 * Provides access to the Instagram username through render props.
 *
 * @component
 */
export function UserName(props: UserNameProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramFeedServiceDefinition);
  const feedData = service.feedData.get();

  const username = feedData?.account?.instagramInfo?.instagramUsername
    ? `@${feedData.account.instagramInfo.instagramUsername}`
    : '@instagram';

  return children({ username });
}

export interface HashtagProps {
  /** Render prop function */
  children: (props: HashtagRenderProps) => React.ReactNode;
}

export interface HashtagRenderProps {
  /** Instagram hashtag */
  hashtag: string;
}

/**
 * Instagram Feed Hashtag render prop component.
 * Provides access to a representative hashtag through render props.
 *
 * @component
 */
export function Hashtag(props: HashtagProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramFeedServiceDefinition);
  const feedData = service.feedData.get();

  // Extract hashtag from account username or use default
  const hashtag = feedData?.account?.instagramInfo?.instagramUsername
    ? `#${feedData.account.instagramInfo.instagramUsername}`
    : '#instagram';

  return children({ hashtag });
}

export interface MediaItemsProps {
  /** Render prop function */
  children: (props: MediaItemsRenderProps) => React.ReactNode;
}

export interface MediaItemsRenderProps {
  /** Array of Instagram media items */
  mediaItems: InstagramMediaItem[];
  /** Whether there are media items to display */
  hasItems: boolean;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Function to load more items */
  loadMore: () => void;
  /** Whether items are currently loading */
  isLoading: boolean;
  /** Error state if loading failed */
  error: string | null;
}

/**
 * Instagram Feed MediaItems render prop component.
 * Provides access to the Instagram media items array and loading state through render props.
 *
 * @component
 */
export function MediaItems(props: MediaItemsProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramFeedServiceDefinition);
  const feedData = service.feedData.get();
  const isLoading = service.isLoading.get();
  const error = service.error.get();

  const mediaItems = feedData?.mediaItems ?? [];
  const hasItems = mediaItems.length > 0;
  const hasMore = feedData?.hasMore ?? false;

  const loadMore = () => {
    service.loadMore();
  };

  return children({
    mediaItems,
    hasItems,
    hasMore,
    loadMore,
    isLoading,
    error,
  });
}

export interface AccountProps {
  /** Render prop function */
  children: (props: AccountRenderProps) => React.ReactNode;
}

export interface AccountRenderProps {
  /** Instagram account information */
  account: InstagramAccount | null;
  /** Whether account data is available */
  hasAccount: boolean;
}

/**
 * Instagram Feed Account render prop component.
 * Provides access to the Instagram account information through render props.
 *
 * @component
 */
export function Account(props: AccountProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramFeedServiceDefinition);
  const feedData = service.feedData.get();

  const account = feedData?.account ?? null;
  const hasAccount = !!account;

  return children({
    account,
    hasAccount,
  });
}
