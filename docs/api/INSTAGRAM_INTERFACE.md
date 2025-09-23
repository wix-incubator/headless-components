# Instagram Components

Headless Instagram components with render props following the stores pattern. Display Instagram feed content with customizable layout and styling.

## Usage

### Basic Instagram Feed

```tsx
import { InstagramFeed } from '@wix/headless-instagram/react';
import { MediaGallery } from '@wix/headless-media/react';

<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'instagram_account_123', limit: 6 }}>
  <div>
    <InstagramFeed.Title />
    <InstagramFeed.UserName />
    <InstagramFeed.Hashtag />
  </div>

  <InstagramFeed.InstagramMedias>
    <InstagramFeed.InstagramMediaItems emptyState={<div>No media available</div>}>
      <InstagramFeed.InstagramMediaRepeater>
        <InstagramMedia.Root>
          <InstagramMedia.Caption />
          <InstagramMedia.MediaType />
          <InstagramMedia.UserName />
          <InstagramMedia.Timestamp />
          <InstagramMedia.MediaGalleries>
            <InstagramMedia.MediaGalleryItems>
              <InstagramMedia.MediaGalleryRepeater>
                <MediaGallery.Root mediaGalleryServiceConfig={{ media: [] }} />
              </InstagramMedia.MediaGalleryRepeater>
            </InstagramMedia.MediaGalleryItems>
          </InstagramMedia.MediaGalleries>
        </InstagramMedia.Root>
      </InstagramFeed.InstagramMediaRepeater>
    </InstagramFeed.InstagramMediaItems>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

### Complete Feed with Custom Layout

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'myaccount', limit: 12 }}>
  <header className="mb-6">
    <InstagramFeed.Title className="text-3xl font-bold" />
    <div className="flex items-center gap-2 mt-2">
      <span className="text-gray-600">@</span>
      <InstagramFeed.UserName className="font-medium" />
      <InstagramFeed.Hashtag className="text-blue-500" />
    </div>
  </header>

  <InstagramFeed.InstagramMedias>
    <InstagramFeed.InstagramMediaItems
      emptyState={<div className="text-center py-8">No Instagram posts found</div>}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <InstagramFeed.InstagramMediaRepeater>
          <MediaGallery.Root
            mediaGalleryServiceConfig={{ media: [] }}
            className="aspect-square object-cover rounded-lg hover:opacity-80 transition-opacity"
          />
        </InstagramFeed.InstagramMediaRepeater>
      </div>
    </InstagramFeed.InstagramMediaItems>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

## Customization

### With Custom Styling

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.Title className="text-4xl font-bold text-center mb-2" />
  <InstagramFeed.UserName className="text-xl text-gray-600 text-center mb-6" />

  <InstagramFeed.InstagramMedias>
    <InstagramFeed.InstagramMediaItems>
      <div className="grid grid-cols-3 gap-2">
        <InstagramFeed.InstagramMediaRepeater>
          <MediaGallery.Root
            mediaGalleryServiceConfig={{ media: [] }}
            className="aspect-square rounded hover:scale-105 transition-transform"
          />
        </InstagramFeed.InstagramMediaRepeater>
      </div>
    </InstagramFeed.InstagramMediaItems>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

### With Custom Elements

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.Title asChild>
    <h1 className="instagram-title" />
  </InstagramFeed.Title>

  <InstagramFeed.UserName asChild>
    <span className="username-display" />
  </InstagramFeed.UserName>

  <InstagramFeed.InstagramMedias asChild>
    <section className="instagram-medias" />
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

### With Custom Components

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.Title asChild>
    {React.forwardRef(({ title, ...props }, ref) => (
      <h2 ref={ref} {...props} className="custom-title">
        📷 {title}
      </h2>
    ))}
  </InstagramFeed.Title>

  <InstagramFeed.UserName asChild>
    {React.forwardRef(({ username, ...props }, ref) => (
      <a
        ref={ref}
        {...props}
        href={`https://instagram.com/${username}`}
        className="username-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        @{username}
      </a>
    ))}
  </InstagramFeed.UserName>

  <InstagramFeed.InstagramMedias>
    <InstagramFeed.InstagramMediaItems>
      <div className="masonry-layout">
        <InstagramFeed.InstagramMediaRepeater>
          <MediaGallery.Root
            mediaGalleryServiceConfig={{ media: [] }}
            asChild
          >
            {({ src, alt }) => (
              <CustomInstagramCard
                src={src}
                alt={alt}
                className="masonry-item"
              />
            )}
          </MediaGallery.Root>
        </InstagramFeed.InstagramMediaRepeater>
      </div>
    </InstagramFeed.InstagramMediaItems>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

### With Empty States

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.Title />

  <InstagramFeed.InstagramMedias>
    <InstagramFeed.InstagramMediaItems
      emptyState={
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-gray-600">Check back later for new content!</p>
        </div>
      }
    >
      <InstagramFeed.InstagramMediaRepeater>
        <MediaGallery.Root mediaGalleryServiceConfig={{ media: [] }} />
      </InstagramFeed.InstagramMediaRepeater>
    </InstagramFeed.InstagramMediaItems>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

### With Custom Title

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.Title title="Latest Posts" className="text-3xl font-bold" />
  <InstagramFeed.UserName />

  {/* Rest of the component */}
</InstagramFeed.Root>
```

## Core Components (Advanced)

Use core components for maximum control with render props:

```tsx
import { InstagramFeed } from '@wix/headless-instagram/core';

<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.Title>
    {({ title }) => (
      <h2 className="custom-title">{title}</h2>
    )}
  </InstagramFeed.Title>

  <InstagramFeed.UserName>
    {({ username }) => (
      <span className="custom-username">@{username}</span>
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

### InstagramFeed.Title
```tsx
interface TitleProps {
  asChild?: boolean;
  children?: AsChildChildren<{ title: string }>;
  className?: string;
  title?: string; // Defaults to "Instagram Feed"
}
```

### InstagramFeed.UserName
```tsx
interface UserNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ username: string }>;
  className?: string;
}
```

### InstagramFeed.Hashtag
```tsx
interface HashtagProps {
  asChild?: boolean;
  children?: AsChildChildren<{ hashtag: string }>;
  className?: string;
}
```

### InstagramFeed.InstagramMedias
```tsx
interface InstagramMediasProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

### InstagramFeed.InstagramMediaItems
```tsx
interface InstagramMediaItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}
```

### InstagramFeed.InstagramMediaRepeater
```tsx
interface InstagramMediaRepeaterProps {
  children: React.ReactNode;
}
```

### InstagramMedia.Root
```tsx
interface InstagramMediaRootProps {
  children: React.ReactNode;
  media?: InstagramMediaItem;
  asChild?: boolean;
  className?: string;
}
```

### InstagramMedia.MediaGalleries
```tsx
interface MediaGalleriesProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

### InstagramMedia.MediaGalleryItems
```tsx
interface MediaGalleryItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}
```

### InstagramMedia.MediaGalleryRepeater
```tsx
interface MediaGalleryRepeaterProps {
  children: React.ReactNode;
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

```tsx
import { loadInstagramFeedServiceConfig } from '@wix/headless-instagram/services';

// In your SSR handler or server action
export async function getServerSideProps() {
  const configResult = await loadInstagramFeedServiceConfig('account123', 12);

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

## Integration with Media Gallery

Instagram components integrate seamlessly with Media Gallery components:

```tsx
<InstagramFeed.Root instagramFeedServiceConfig={{ accountId: 'account123' }}>
  <InstagramFeed.InstagramMedias>
    <InstagramFeed.InstagramMediaItems>
      <InstagramFeed.InstagramMediaRepeater>
        {/* Use MediaGallery following stores pattern */}
        <MediaGallery.Root mediaGalleryServiceConfig={{ media: [] }} />
      </InstagramFeed.InstagramMediaRepeater>
    </InstagramFeed.InstagramMediaItems>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

## Architecture

```
InstagramFeed.Root (Service Provider)
├── InstagramFeed.Title (Entity Display)
├── InstagramFeed.UserName (Entity Display)
├── InstagramFeed.Hashtag (Entity Display)
└── InstagramFeed.InstagramMedias (List Container - 3-Level Pattern)
    └── InstagramFeed.InstagramMediaItems (List Container Level with emptyState)
        └── InstagramFeed.InstagramMediaRepeater (Repeater Level - renders InstagramMedia.Root)
            └── InstagramMedia.Root (Entity Root)
                ├── InstagramMedia.Caption (Entity Component)
                ├── InstagramMedia.MediaType (Entity Component)
                ├── InstagramMedia.UserName (Entity Component)
                ├── InstagramMedia.Timestamp (Entity Component)
                └── InstagramMedia.MediaGalleries (Nested List Container)
                    └── InstagramMedia.MediaGalleryItems (Nested List Container Level)
                        └── InstagramMedia.MediaGalleryRepeater (Nested Repeater - renders MediaGallery.Root)
                            └── MediaGallery.Root (Media Component)
```

**Key Principles:**
- **Services Pattern**: WixServices manages reactive Instagram feed data
- **3-Level List Pattern**: InstagramMedias → InstagramMediaItems → InstagramMediaRepeater
- **Entity Delegation**: Repeaters render entity Root components (InstagramMedia.Root, MediaGallery.Root)
- **Empty State Support**: List container level supports emptyState prop
- **Conditional Rendering**: Container level doesn't render if list is empty
- **Media Gallery Integration**: Seamless integration with Media Gallery components
- **No React Context**: Data flows through services, metadata through props
- **AsChild Support**: Full customization with asChild pattern
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
import { Root, InstagramMedias, InstagramMediaItems, InstagramMediaRepeater } from '@wix/headless-instagram/react';

// Or use namespace import (recommended)
import { InstagramFeed } from '@wix/headless-instagram/react';
```
