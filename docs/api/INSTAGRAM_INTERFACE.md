# Instagram Components

Headless Instagram components with render props following the stores pattern. Display Instagram feed content with customizable layout and styling.

## Usage

### Basic Instagram Feed

```tsx
import { InstagramFeed } from '@wix/headless-instagram/react';
import { MediaGallery } from '@wix/headless-media/react';

<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'instagram_account_123', limit: 6 }}>
  <div>
    <InstagramFeed.UserName />
  </div>
  <InstagramFeed.InstagramMedias>
    <InstagramMedia.MediaGalleries>
      <InstagramMedia.MediaGalleryRepeater>
        {({ mediaItem, index }) => (
          <>
            <MediaGallery.Previous/>
            <MediaGallery.Viewport asChild>
              {({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || ''}
                  className="w-full h-full object-cover cursor-pointer"
                />
              )}
            </MediaGallery.Viewport>
            <MediaGallery.Next/>
            <InstagramMedia.Caption />
            <InstagramMedia.MediaType />
            <InstagramMedia.UserName />
            <InstagramMedia.Timestamp />
          </>
        )}
      </InstagramMedia.MediaGalleryRepeater>
    </InstagramMedia.MediaGalleries>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```


### Complete Feed with Custom Layout

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'myaccount', limit: 12 }}>
  <header className="mb-6">
    <div className="flex items-center gap-2 mt-2">
      <span className="text-gray-600">@</span>
      <InstagramFeed.UserName className="font-medium" />
    </div>
  </header>

  <InstagramFeed.InstagramMedias>
    <InstagramMedia.MediaGalleries>
      <InstagramMedia.MediaGalleryRepeater>
        {({ mediaItem, index }) => (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <MediaGallery.Viewport asChild>
              {({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || ''}
                  className="w-full h-full object-cover cursor-pointer"
                />
              )}
            </MediaGallery.Viewport>
          </div>
        )}
      </InstagramMedia.MediaGalleryRepeater>
    </InstagramMedia.MediaGalleries>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

## Customization

### With Custom Styling

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.UserName className="text-xl text-gray-600 text-center mb-6" />

  <InstagramFeed.InstagramMedias>
    <InstagramMedia.MediaGalleries>
      <InstagramMedia.MediaGalleryRepeater>
        {({ mediaItem, index }) => (
          <div className="grid grid-cols-3 gap-2">
            <MediaGallery.Viewport asChild>
              {({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || ''}
                  className="w-full h-full object-cover cursor-pointer"
                />
              )}
            </MediaGallery.Viewport>
          </div>
        )}
      </InstagramMedia.MediaGalleryRepeater>
    </InstagramMedia.MediaGalleries>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

### With Custom Elements

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.UserName asChild>
    <span className="username-display" />
  </InstagramFeed.UserName>


  {/* List container does not support asChild */}
  <InstagramFeed.InstagramMedias>
    <InstagramMedia.MediaGalleries>
      <InstagramMedia.MediaGalleryRepeater>
        {({ mediaItem, index }) => (
          <MediaGallery.Viewport asChild>
            {({ src, alt }) => (
              <img
                src={src}
                alt={alt || ''}
                className="w-full h-full object-cover cursor-pointer"
              />
            )}
          </MediaGallery.Viewport>
        )}
      </InstagramMedia.MediaGalleryRepeater>
    </InstagramMedia.MediaGalleries>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

### With Custom Components

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.UserName asChild>
    {React.forwardRef(({ displayName, ...props }, ref) => (
      <a
        ref={ref}
        {...props}
        href={`https://instagram.com/${displayName}`}
        className="username-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        @{displayName}
      </a>
    ))}
  </InstagramFeed.UserName>


  <InstagramFeed.InstagramMedias>
    <InstagramMedia.MediaGalleries>
      <InstagramMedia.MediaGalleryRepeater>
        {({ mediaItem, index }) => (
          <div className="masonry-layout">
            <MediaGallery.Viewport asChild>
              {({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || ''}
                  className="w-full h-full object-cover cursor-pointer"
                />
              )}
            </MediaGallery.Viewport>
          </div>
        )}
      </InstagramMedia.MediaGalleryRepeater>
    </InstagramMedia.MediaGalleries>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

### With Empty States

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.InstagramMedias>
    <InstagramMedia.MediaGalleries
      emptyState={
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-gray-600">Check back later for new content!</p>
        </div>
      }
    >
      <InstagramMedia.MediaGalleryRepeater>
        {({ mediaItem, index }) => (
          <MediaGallery.Viewport asChild>
            {({ src, alt }) => (
              <img
                src={src}
                alt={alt || ''}
                className="w-full h-full object-cover cursor-pointer"
              />
            )}
          </MediaGallery.Viewport>
        )}
      </InstagramMedia.MediaGalleryRepeater>
    </InstagramMedia.MediaGalleries>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

<!-- Removed: Title examples since Title is UI-only and not headless -->

## Core Components (Advanced)

Use core components for maximum control with render props:

```tsx
import { InstagramFeed } from '@wix/headless-instagram/core';

<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.UserName>
    {({ displayName }) => (
      <span className="custom-username">@{displayName}</span>
    )}
  </InstagramFeed.UserName>
</InstagramFeed.Root>
```

## Props Reference

### InstagramFeed.Root
```tsx
interface RootProps {
  instagramFeedServiceConfig: InstagramFeedServiceConfig;
  children: React.ReactNode;
  className?: string;
}
```

### InstagramFeed.UserName
```tsx
interface UserNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ displayName: string }>;
  className?: string;
}
```


### InstagramFeed.InstagramMedias
```tsx
interface InstagramMediasProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}
```

### InstagramMedia.MediaGalleries
```tsx
interface MediaGalleriesProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}
```

### InstagramMedia.MediaGalleryRepeater
```tsx
interface MediaGalleryRepeaterProps {
  children: (props: {
    mediaItem: InstagramMediaItem;
    index: number;
  }) => React.ReactNode;
}
```

**Render Props:**
- `mediaItem`: The Instagram media item object containing `id`, `type`, `mediaUrl`, `caption`, `timestamp`, etc.
- `index`: The zero-based index of the media item in the feed (useful for navigation, numbering, etc.)

**Example with mediaItem and index:**
```tsx
<InstagramMedia.MediaGalleryRepeater>
  {({ mediaItem, index }) => (
    <div>
      <div>Post #{index + 1}</div>
      <div>Type: {mediaItem.type}</div>
      <MediaGallery.Viewport asChild>
        {({ src, alt }) => (
          <img src={src} alt={alt} />
        )}
      </MediaGallery.Viewport>
      <InstagramMedia.Caption />
    </div>
  )}
</InstagramMedia.MediaGalleryRepeater>
```

### InstagramMedia.Caption
```tsx
interface CaptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ caption: string }>;
  className?: string;
}
```

### InstagramMedia.MediaType
```tsx
interface MediaTypeProps {
  asChild?: boolean;
  children?: AsChildChildren<{ mediaType: 'image' | 'video' | 'carousel' }>;
  className?: string;
}
```

### InstagramMedia.UserName
```tsx
interface UserNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ userName: string }>;
  className?: string;
}
```

### InstagramMedia.Timestamp
```tsx
interface TimestampProps {
  asChild?: boolean;
  children?: AsChildChildren<{ timestamp: string }>;
  className?: string;
}
```

## Data Types

### InstagramFeedServiceConfig
```tsx
interface InstagramFeedServiceConfig {
  /** Instagram account ID or username */
  accountId?: string;
  /** Number of media items to fetch */
  limit?: number;
  /** Initial feed data (for SSR or caching) */
  feedData?: InstagramFeedData;
}
```

### InstagramFeedData
```tsx
interface InstagramFeedData {
  /** Instagram account information */
  account?: InstagramAccount;
  /** Array of media items */
  mediaItems: InstagramMediaItem[];
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Cursor for pagination */
  nextCursor?: string;
}
```

### InstagramMediaItem
```tsx
interface InstagramMediaItem {
  /** Unique identifier for the media item */
  id: string;
  /** Type of the media */
  type: 'image' | 'video' | 'carousel';
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
}
```

### InstagramAccount
```tsx
interface InstagramAccount {
  /** Account ID */
  id?: string;
  /** Account username */
  username?: string;
  /** Account display name */
  name?: string;
  /** Profile picture URL */
  profilePictureUrl?: string;
  /** Account bio */
  biography?: string;
  /** Number of followers */
  followersCount?: number;
  /** Number of following */
  followsCount?: number;
  /** Number of posts */
  mediaCount?: number;
}
```

## Service Configuration

### Server-Side Rendering (SSR)

The function accepts an input object of type `InstagramFeedServiceConfig`.

```tsx
import { loadInstagramFeedServiceConfig, type InstagramFeedServiceConfig } from '@wix/headless-instagram/services';

// In your SSR handler or server action
export async function getServerSideProps() {
  const input: InstagramFeedServiceConfig = {
    accountId: 'account123',
    limit: 12,
  };

  const configResult = await loadInstagramFeedServiceConfig(input);

  if (configResult.type === 'success') {
    return {
      props: {
        instagramConfig: configResult.config
      }
    };
  }

  return {
    props: {
      instagramConfig: { accountId: 'account123', limit: 12 }
    }
  };
}

// In your component
function InstagramPage({ instagramConfig }) {
  return (
    <InstagramFeed.Root instagramFeedServiceConfig={instagramConfig}>
      {/* Your component */}
    </InstagramFeed.Root>
  );
}
```

### Service API

The Instagram service provides reactive signals for managing feed state:

```tsx
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '@wix/headless-instagram/services';

function CustomInstagramComponent() {
  const feedService = useService(InstagramFeedServiceDefinition);

  const feedData = feedService.feedData.get();
  const isLoading = feedService.isLoading.get();
  const error = feedService.error.get();

  const handleLoadMore = () => {
    feedService.loadMore();
  };

  const handleRefresh = () => {
    feedService.refresh();
  };

  if (isLoading) return <div>Loading Instagram feed...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>{feedData.mediaItems.length} posts loaded</p>
      {feedData.hasMore && (
        <button onClick={handleLoadMore}>Load More</button>
      )}
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  );
}
```

### Accessing Media Item Data and Index

The `MediaGalleryRepeater` provides access to the media item data and index through render props, enabling advanced use cases like navigation, numbering, and conditional rendering:

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.InstagramMedias>
    <InstagramMedia.MediaGalleries>
      <InstagramMedia.MediaGalleryRepeater>
        {({ mediaItem, index }) => (
          <div className="instagram-post-card">
            {/* Display post number and type */}
            <div className="post-header">
              <span>Post #{index + 1}</span>
              <span className="badge">{mediaItem.type}</span>
            </div>

            {/* Media content */}
            <MediaGallery.Viewport asChild>
              {({ src, alt }) => (
                <img src={src} alt={alt} className="post-image" />
              )}
            </MediaGallery.Viewport>

            {/* Post metadata */}
            <div className="post-footer">
              <InstagramMedia.Caption />
              <InstagramMedia.Timestamp />
            </div>

            {/* Navigation example - link to specific post */}
            <a href={mediaItem.permalink} target="_blank" rel="noopener noreferrer">
              View on Instagram
            </a>
          </div>
        )}
      </InstagramMedia.MediaGalleryRepeater>
    </InstagramMedia.MediaGalleries>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

**Use Cases:**
- **Post numbering**: Display post position using `index + 1`
- **Navigation**: Create navigation between posts using `index`
- **Conditional rendering**: Show different UI based on `mediaItem.type` (image/video/carousel)
- **Direct links**: Access `mediaItem.permalink` for linking to Instagram posts
- **Metadata display**: Show post-specific information like `mediaItem.caption`, `mediaItem.timestamp`

## Integration with Media Gallery

Instagram components integrate seamlessly with Media Gallery components:

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.InstagramMedias>
    <InstagramMedia.MediaGalleries>
      <InstagramMedia.MediaGalleryRepeater>
        {({ mediaItem, index }) => (
          <>
            {/* Use Media Gallery primitives like Viewport within the repeater */}
            <MediaGallery.Viewport asChild>
              {({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || ''}
                  className="w-full h-full object-cover cursor-pointer"
                />
              )}
            </MediaGallery.Viewport>
            <InstagramMedia.Caption />
            <InstagramMedia.MediaType />
            <InstagramMedia.UserName />
            <InstagramMedia.Timestamp />
          </>
        )}
      </InstagramMedia.MediaGalleryRepeater>
    </InstagramMedia.MediaGalleries>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

## Architecture

```
InstagramFeed.Root (Service Provider)
├── InstagramFeed.UserName (Entity Display)
└── InstagramFeed.InstagramMedias (Container Level)
    └── InstagramMedia.MediaGalleries (List Container Level)
        └── InstagramMedia.MediaGalleryRepeater (Repeater Level)
            ├── MediaGallery.Previous (Media Component)
            ├── MediaGallery.Viewport (Media Component)
            ├── MediaGallery.Next (Media Component)
            ├── InstagramMedia.Caption (Item Component)
            ├── InstagramMedia.MediaType (Item Component)
            ├── InstagramMedia.UserName (Item Component)
            └── InstagramMedia.Timestamp (Item Component)
```

**Key Principles:**
- **Services Pattern**: WixServices manages reactive Instagram feed data
- **3-Level List Pattern**: Container → List → Repeater with consolidated core logic
- **Media Gallery Integration**: Seamless integration with Media Gallery components
- **No React Context**: Data flows through services, metadata through props
- **AsChild Support**: Full customization with asChild pattern
- **Prop-Based Components**: Simple components avoid services and are UI-only
- **Composable**: Mix and match components as needed

## Performance

### Optimization Tips

1. **Limit Media Items**: Use reasonable limits to avoid loading too many items at once
2. **Lazy Loading**: Consider implementing intersection observer for load-more functionality
3. **Image Optimization**: Use appropriate image sizes and formats
4. **Caching**: Leverage the feedData config for SSR and caching

### Bundle Size

Import only the components you need for optimal bundle size:

```tsx
// Tree-shakable imports
import { Root, InstagramMedias } from '@wix/headless-instagram/react';
import { MediaGalleries, MediaGalleryRepeater } from '@wix/headless-media/react';

// Or use namespace import (recommended)
import { InstagramFeed } from '@wix/headless-instagram/react';
import { InstagramMedia } from '@wix/headless-media/react';
```
