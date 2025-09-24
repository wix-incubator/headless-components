# Instagram Component Structure

This document presents the current usage structure for the Instagram headless components integrating with Media Gallery.

## Usage

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

## Notes

- Use `InstagramFeed.InstagramMedias` as the list container with empty state support.
- Use `InstagramFeed.InstagramMediaRepeater` to iterate media items and provide per-item context.
- Use the `InstagramMedia.*` namespace for item-level subcomponents such as `caption`, `mediaType`, `userName`, `timestamp`, and nested `MediaGalleries`/`MediaGalleryRepeater`.
