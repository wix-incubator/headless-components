# Instagram Headless Component

A headless component for displaying Instagram feeds with full customization support.

## Installation

```bash
npm install @wix/headless-instagram
```

## Basic Usage

```tsx
import { InstagramFeed } from '@wix/headless-instagram/react';

function InstagramWidget() {
  return (
    <InstagramFeed.Root
      instagramFeedServiceConfig={{
        accountId: 'instagram_account_123',
        limit: 6
      }}
      className="w-full max-w-4xl mx-auto"
    >
      <div>
        <InstagramFeed.Title className="text-3xl font-bold text-gray-900 mb-2" />
        <InstagramFeed.UserName className="text-xl text-gray-600 mb-1" />
        <InstagramFeed.Hashtag className="text-blue-600 font-medium" />
      </div>

      {/* Gallery Section - Following 3-Level Pattern */}
      <InstagramFeed.Gallery className="gallery-container">
        <InstagramFeed.GalleryItems
          emptyState={
            <div className="text-center text-gray-500 py-8">
              No Instagram posts to display
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InstagramFeed.GalleryRepeater>
              <InstagramFeed.GalleryItem className="group relative overflow-hidden rounded-lg">
                <InstagramFeed.Media className="w-full h-64 object-cover transition-transform group-hover:scale-105" />
              </InstagramFeed.GalleryItem>
            </InstagramFeed.GalleryRepeater>
          </div>
        </InstagramFeed.GalleryItems>
      </InstagramFeed.Gallery>
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

### Gallery Components (3-Level Pattern)

1. **Container Level**: `InstagramFeed.Gallery`
   - Main container that provides context and conditional rendering
   - Does NOT render if the list is empty

2. **List Container Level**: `InstagramFeed.GalleryItems`
   - Container for the gallery items with empty state support
   - Supports `emptyState` prop for when no media items exist

3. **Repeater Level**: `InstagramFeed.GalleryRepeater`
   - Maps over media items and provides context for each item

### Individual Item Components
- `InstagramFeed.GalleryItem` - Wrapper for each media item
- `InstagramFeed.Media` - Displays the actual Instagram media (image/video)

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

// Custom Media with Overlay
<InstagramFeed.Media asChild>
  {React.forwardRef(({ mediaItem, index, ...props }, ref) => (
    <div ref={ref} {...props} className="relative group">
      <img
        src={mediaItem.mediaUrl}
        alt={mediaItem.altText || `Instagram post ${index + 1}`}
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
        <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-sm font-medium">{mediaItem.caption}</p>
        </div>
      </div>
    </div>
  ))}
</InstagramFeed.Media>
```

## Configuration

### InstagramFeedServiceConfig

```tsx
interface InstagramFeedServiceConfig {
  accountId?: string;          // Instagram account ID
  limit?: number;              // Number of items to fetch
  feedData?: InstagramFeedData; // Initial feed data (for SSR)
}
```

### InstagramMediaItem

```tsx
interface InstagramMediaItem {
  id: string;             // Unique identifier
  type: 'image' | 'video' | 'carousel'; // Media type
  mediaUrl: string;       // URL to media content
  thumbnailUrl?: string;  // Thumbnail for videos
  caption?: string;       // Post caption
  permalink: string;      // Link to Instagram post
  timestamp: string;      // ISO timestamp
  altText?: string;       // Accessibility text
}
```

## Data Attributes

All components include proper `data-testid` attributes following the naming convention:

- `data-testid="instagram-feed-root"`
- `data-testid="instagram-feed-title"`
- `data-testid="instagram-feed-username"`
- `data-testid="instagram-feed-hashtag"`
- `data-testid="instagram-feed-gallery"`
- `data-testid="instagram-feed-gallery-items"`
- `data-testid="instagram-feed-gallery-item"`
- `data-testid="instagram-feed-media"`

## Architecture Notes

This component follows the established headless components architecture:

1. **3-Level List Pattern**: Gallery → GalleryItems → GalleryRepeater
2. **Context Pattern**: Data flows through React contexts
3. **AsChild Support**: Full customization capabilities
4. **TestIds Enum**: Centralized test ID management
5. **TypeScript**: Full type safety throughout

## Service Architecture

This component follows the Wix headless service architecture pattern:

### Service Integration (When Available)

```tsx
import {
  InstagramFeedService,
  InstagramFeedServiceDefinition,
  loadInstagramFeedServiceConfig
} from '@wix/instagram/services';
import { ServiceProvider, createServicesMap } from '@wix/services-manager-react';

// SSR: Load configuration
const feedConfig = await loadInstagramFeedServiceConfig('instagram_account_123', 12);

// Client: Set up service provider
function App() {
  return (
    <ServiceProvider services={createServicesMap([
      [InstagramFeedServiceDefinition, InstagramFeedService.withConfig(feedConfig.config)]
    ])}>
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
