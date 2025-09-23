import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { accounts } from '@wix/instagram-account';
import { media } from '@wix/instagram-media';

/**
 * Instagram media item types
 */
export type InstagramMediaType = 'image' | 'video' | 'carousel';

/**
 * Instagram media item structure
 * Extending SDK types with additional fields for UI components
 */
export interface InstagramMediaItem {
  /** Unique identifier for the media item */
  id: string;
  /** Type of the media */
  type: InstagramMediaType;
  /** URL to the media content */
  mediaUrl: string;
  /** Thumbnail URL for videos */
  thumbnailUrl?: string;
  /** Caption text */
  caption?: string;
  /** Permalink to the Instagram post */
  permalink: string;
  /** ISO timestamp of when the media was created */
  timestamp: string;
  /** Alt text for accessibility */
  altText?: string;
  /** Username of the Instagram account that posted this media */
  userName?: string;
}

/**
 * Instagram account information using SDK types
 */
export type InstagramAccount = accounts.InstagramAccount;

/**
 * Instagram media using SDK types
 */
export type InstagramMedia = media.Media;

/**
 * Instagram feed data combining account and media information
 */
export interface InstagramFeedData {
  /** Instagram account information */
  account?: InstagramAccount;
  /** Array of media items */
  mediaItems: InstagramMediaItem[];
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Cursor for pagination */
  nextCursor?: string;
}

/**
 * Configuration interface for the Instagram Feed service.
 * Contains the initial feed data and connection settings.
 */
export interface InstagramFeedServiceConfig {
  /** Instagram account ID or username */
  accountId?: string;
  /** Number of media items to fetch */
  limit?: number;
  /** Initial feed data (for SSR or caching) */
  feedData?: InstagramFeedData;
}

/**
 * API interface for the Instagram Feed service, providing reactive feed data management.
 * This service handles loading and managing Instagram feed data, loading state, and errors.
 */
export interface InstagramFeedServiceAPI {
  /** Reactive signal containing the current feed data */
  feedData: Signal<InstagramFeedData>;
  /** Reactive signal indicating if feed data is currently being loaded */
  isLoading: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
  /** Function to load more media items */
  loadMore: () => Promise<void>;
  /** Function to refresh the entire feed */
  refresh: () => Promise<void>;
}

/**
 * Default Instagram feed data
 */
const defaultInstagramFeedData: InstagramFeedData = {
  mediaItems: [],
  hasMore: false,
};

/**
 * Service definition for the Instagram Feed service.
 * This defines the reactive API contract for managing Instagram feed data.
 */
export const InstagramFeedServiceDefinition = defineService<
  InstagramFeedServiceAPI,
  InstagramFeedServiceConfig
>('instagram-feed');

/**
 * Implementation of the Instagram Feed service that manages reactive Instagram feed data.
 * This service provides signals for feed data, loading state, and error handling,
 * along with methods to dynamically load and refresh Instagram content.
 *
 * @example
 * ```tsx
 * import { InstagramFeedService, InstagramFeedServiceDefinition } from '@wix/instagram/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function InstagramComponent({ feedConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [InstagramFeedServiceDefinition, InstagramFeedService.withConfig(feedConfig)]
 *     ])}>
 *       <InstagramDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function InstagramDisplay() {
 *   const feedService = useService(InstagramFeedServiceDefinition);
 *   const feedData = feedService.feedData.get();
 *   const isLoading = feedService.isLoading.get();
 *   const error = feedService.error.get();
 *
 *   if (isLoading) return <div>Loading Instagram feed...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return <div>{feedData.mediaItems.length} posts loaded</div>;
 * }
 * ```
 */
export const InstagramFeedService =
  implementService.withConfig<InstagramFeedServiceConfig>()(
    InstagramFeedServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const feedData: Signal<InstagramFeedData> = signalsService.signal(
        config.feedData || defaultInstagramFeedData,
      );
      const isLoading: Signal<boolean> = signalsService.signal(
        !!config.accountId as any,
      );
      const error: Signal<string | null> = signalsService.signal(null as any);

      const loadFeed = async (accountId: string, cursor?: string) => {
        try {
          isLoading.set(true);
          error.set(null);

          // Load Instagram account information
          const accountResponse = await accounts.getInstagramAccount(accountId);

          // Load Instagram media for the account
          const mediaResponse =
            await media.listInstagramAccountMedia(accountId);

          // Transform SDK media to our interface format
          const transformedMedia: InstagramMediaItem[] =
            mediaResponse.media?.map((mediaItem: InstagramMedia) => ({
              id: mediaItem._id || mediaItem.mediaId || '',
              type: (mediaItem.mediaType || 'image') as InstagramMediaType,
              mediaUrl: mediaItem.mediaUrl || '',
              thumbnailUrl: mediaItem.thumbnailUrl || undefined,
              caption: mediaItem.caption,
              permalink: mediaItem.permalink || '',
              timestamp:
                typeof mediaItem.timestamp === 'string'
                  ? mediaItem.timestamp
                  : new Date().toISOString(),
              altText:
                mediaItem.caption ||
                `Instagram post ${mediaItem._id || mediaItem.mediaId}`,
            })) || [];

          const newFeedData: InstagramFeedData = {
            account: accountResponse,
            mediaItems: cursor
              ? [...feedData.get().mediaItems, ...transformedMedia]
              : transformedMedia,
            hasMore: false, // Note: Real pagination logic would depend on actual SDK response structure
            nextCursor: undefined,
          };

          feedData.set(newFeedData);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Failed to load Instagram feed';
          error.set(errorMessage);
        } finally {
          isLoading.set(false);
        }
      };

      const loadMore = async () => {
        const currentData = feedData.get();
        if (!currentData.hasMore || isLoading.get()) return;

        if (config.accountId) {
          await loadFeed(config.accountId, currentData.nextCursor);
        }
      };

      const refresh = async () => {
        if (config.accountId) {
          await loadFeed(config.accountId);
        }
      };

      // Initial load if accountId is provided
      if (config.accountId && !config.feedData) {
        loadFeed(config.accountId);
      }

      return {
        feedData,
        isLoading,
        error,
        loadMore,
        refresh,
      };
    },
  );

/**
 * Success result interface for Instagram feed service configuration loading.
 * Returned when feed data is successfully loaded.
 */
export interface SuccessInstagramFeedServiceConfigResult {
  /** Type "success" means that the feed was loaded and the config is valid */
  type: 'success';
  /** The feed config containing the loaded feed data */
  config: InstagramFeedServiceConfig;
}

/**
 * Not found result interface for Instagram feed service configuration loading.
 * Returned when account or feed data cannot be found.
 */
export interface NotFoundInstagramFeedServiceConfigResult {
  /** Type "notFound" means that the account was not found */
  type: 'notFound';
}

/**
 * Union type for Instagram feed service configuration results.
 */
export type InstagramFeedServiceConfigResult =
  | SuccessInstagramFeedServiceConfigResult
  | NotFoundInstagramFeedServiceConfigResult;

/**
 * Loads Instagram feed service configuration from the Wix Instagram API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * Instagram feed data that will be used to configure the InstagramFeedService.
 *
 * @param accountId The Instagram account ID to load
 * @param limit Optional limit for number of media items to load
 * @returns Promise that resolves to InstagramFeedServiceConfigResult (success with config or notFound)
 *
 * @example
 * ```tsx
 * import { loadInstagramFeedServiceConfig } from '@wix/instagram/services';
 *
 * // In your SSR handler or server action
 * const configResult = await loadInstagramFeedServiceConfig('instagram_account_123', 12);
 *
 * if (configResult.type === 'success') {
 *   // Use configResult.config to initialize InstagramFeedService
 *   return configResult.config;
 * } else {
 *   // Handle not found case
 *   return { accountId: 'instagram_account_123' }; // fallback config
 * }
 * ```
 */
export async function loadInstagramFeedServiceConfig(
  accountId: string,
  limit?: number,
): Promise<InstagramFeedServiceConfigResult> {
  try {
    // Load Instagram account information using SDK
    const accountResponse = await accounts.getInstagramAccount(accountId);

    if (!accountResponse) {
      return { type: 'notFound' };
    }

    // Load initial media items using SDK
    const mediaResponse = await media.listInstagramAccountMedia(accountId);

    // Transform SDK media to our interface format
    const transformedMedia: InstagramMediaItem[] =
      mediaResponse.media?.map((mediaItem: InstagramMedia) => ({
        id: mediaItem._id || mediaItem.mediaId || '',
        type: (mediaItem.mediaType || 'image') as InstagramMediaType,
        mediaUrl: mediaItem.mediaUrl || '',
        thumbnailUrl: mediaItem.thumbnailUrl || undefined,
        caption: mediaItem.caption,
        permalink: mediaItem.permalink || '',
        timestamp:
          typeof mediaItem.timestamp === 'string'
            ? mediaItem.timestamp
            : new Date().toISOString(),
        altText:
          mediaItem.caption ||
          `Instagram post ${mediaItem._id || mediaItem.mediaId}`,
      })) || [];

    const feedData: InstagramFeedData = {
      account: accountResponse,
      mediaItems: transformedMedia,
      hasMore: false, // Note: Real pagination logic would depend on actual SDK response structure
      nextCursor: undefined,
    };

    const config: InstagramFeedServiceConfig = {
      accountId,
      limit,
      feedData,
    };

    return { type: 'success', config };
  } catch (error) {
    console.error('Failed to load Instagram feed config:', error);
    return { type: 'notFound' };
  }
}
