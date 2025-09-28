# Instagram Headless Component

A headless component for displaying Instagram feeds with full customization support.

## Installation

```bash
npm install @wix/headless-instagram
```

## Basic Usage

```tsx
import { InstagramFeed, InstagramMedia } from '@wix/headless-instagram/react';
import { MediaGallery } from '@wix/headless-media/react';

function InstagramWidget() {
  return (
    <InstagramFeed.Root
      instagramFeedServiceConfig={{
        accountId: 'instagram_account_123',
        limit: 6,
      }}
      className="w-full max-w-4xl mx-auto"
    >
      <div>
        <InstagramFeed.Title className="text-3xl font-bold text-gray-900 mb-2" />
        <InstagramFeed.UserName className="text-xl text-gray-600 mb-1" />
        <InstagramFeed.Hashtag className="text-blue-600 font-medium" />
      </div>

      <InstagramFeed.InstagramMedias>
        <InstagramFeed.InstagramMediaRepeater>
          <InstagramMedia.Caption />
          <InstagramMedia.MediaType />
          <InstagramMedia.UserName />
          <InstagramMedia.Timestamp />
          <InstagramMedia.MediaGalleries>
            <InstagramMedia.MediaGalleryRepeater>
              <MediaGallery.Root />
            </InstagramMedia.MediaGalleryRepeater>
          </InstagramMedia.MediaGalleries>
        </InstagramFeed.InstagramMediaRepeater>
      </InstagramFeed.InstagramMedias>
    </InstagramFeed.Root>
  );
}
```

## Component Structure

The Instagram headless component follows the established 3-level architecture pattern:

### Root Container

- `InstagramFeed.Root` - Main container with service configuration

### Header Components

- `InstagramFeed.Title` - Feed title display
- `InstagramFeed.UserName` - Instagram username/display name
- `InstagramFeed.Hashtag` - Associated hashtag

### Media Components (3-Level Pattern)

1. **Container Level**: `InstagramFeed.InstagramMedias`
   - Main container that provides context and conditional rendering
   - Does NOT render if the list is empty

2. **Repeater Level**: `InstagramFeed.InstagramMediaRepeater`
   - Maps over media items and provides context for each item

### Individual InstagramMedia Components

- `InstagramMedia.Caption` - Displays the Instagram media caption
- `InstagramMedia.MediaType` - Shows the media type (image/video/carousel)
- `InstagramMedia.UserName` - Instagram username
- `InstagramMedia.Timestamp` - Media timestamp with formatting
- `InstagramMedia.MediaGalleries` - Container for media gallery
- `InstagramMedia.MediaGalleryRepeater` - Renders MediaGallery.Root for each item

## Advanced Usage with AsChild Pattern

```tsx
// Custom Title with Icon
<InstagramFeed.Title asChild>
  {React.forwardRef(({ title, ...props }, ref) => (
    <h2 ref={ref} {...props} className="flex items-center gap-2 text-2xl font-bold">
      📷 {title}
    </h2>
  ))}
</InstagramFeed.Title>

// Custom Caption with styling
<InstagramMedia.Caption asChild>
  {React.forwardRef(({ caption, ...props }, ref) => (
    <p ref={ref} {...props} className="text-sm text-gray-600 line-clamp-2">
      {caption}
    </p>
  ))}
</InstagramMedia.Caption>

// Custom MediaType with badge
<InstagramMedia.MediaType asChild>
  {React.forwardRef(({ mediaType, ...props }, ref) => (
    <span ref={ref} {...props} className={`badge ${mediaType === 'video' ? 'badge-video' : 'badge-image'}`}>
      {mediaType === 'video' ? '📹' : '📷'} {mediaType}
    </span>
  ))}
</InstagramMedia.MediaType>
```

## Configuration

### InstagramFeedServiceConfig

```tsx
interface InstagramFeedServiceConfig {
  accountId?: string; // Instagram account ID
  limit?: number; // Number of items to fetch
  feedData?: InstagramFeedData; // Initial feed data (for SSR)
}
```

### InstagramMediaItem

```tsx
interface InstagramMediaItem {
  id: string; // Unique identifier
  type: 'image' | 'video' | 'carousel'; // Media type
  mediaUrl: string; // URL to media content
  thumbnailUrl?: string; // Thumbnail for videos
  caption?: string; // Post caption
  permalink: string; // Link to Instagram post
  timestamp: string; // ISO timestamp
  altText?: string; // Accessibility text
}
```

## Architecture Notes

This component follows the established headless components architecture:

1. **3-Level List Pattern**: InstagramMedias → InstagramMediaRepeater → Individual Components
2. **Service-Based Architecture**: Data flows through service manager
3. **AsChild Support**: Full customization capabilities
4. **Individual Media Gallery**: Each media item can have its own MediaGallery via MediaGalleries/MediaGalleryRepeater
5. **TypeScript**: Full type safety throughout

## Service Architecture

This component follows the Wix headless service architecture pattern:

### Service Integration (When Available)

```tsx
import {
  InstagramFeedService,
  InstagramFeedServiceDefinition,
  loadInstagramFeedServiceConfig,
} from '@wix/instagram/services';
import {
  ServiceProvider,
  createServicesMap,
} from '@wix/services-manager-react';

// SSR: Load configuration
const feedConfig = await loadInstagramFeedServiceConfig(
  'instagram_account_123',
  12,
);

// Client: Set up service provider
function App() {
  return (
    <ServiceProvider
      services={createServicesMap([
        [
          InstagramFeedServiceDefinition,
          InstagramFeedService.withConfig(feedConfig.config),
        ],
      ])}
    >
      <InstagramWidget />
    </ServiceProvider>
  );
}

// Component: Use service
function InstagramWidget() {
  const feedService = useService(InstagramFeedServiceDefinition);
  const feedData = feedService.feedData.get();
  const isLoading = feedService.isLoading.get();

  return (
    <InstagramFeed.Root instagramFeedServiceConfig={{ feedData }}>
      {/* components */}
    </InstagramFeed.Root>
  );
}
```

### Current Implementation ✅ PRODUCTION READY

The service is **actively using real Instagram SDKs**:

- **✅ LIVE**: `@wix/instagram-account` SDK integration
- **✅ LIVE**: `@wix/instagram-media` SDK integration
- **✅ ACTIVE**: Real-time Instagram account and media data
- **✅ PRODUCTION**: Full TypeScript integration with SDK types
- **✅ READY**: SSR configuration loading with real data

**Real SDK Status**: ✅ **INTEGRATED** - Using `accounts.getInstagramAccount()` and `media.listInstagramAccountMedia()` with live Instagram data. See [SDK_REAL_INTEGRATION_STATUS.md](./SDK_REAL_INTEGRATION_STATUS.md) for complete details.

## SDK Integration Status

✅ **COMPLETED**: Real Instagram SDK integration
✅ **LIVE**: Production-ready component with real Instagram data
✅ **ACTIVE**: `@wix/instagram-account` v1.0.16 and `@wix/instagram-media` v1.0.13

## Future Enhancements

- Enhanced pagination support
- Real-time feed updates
- Advanced filtering and sorting options
- Analytics and insights integration
- Video playback controls
- Carousel media support
