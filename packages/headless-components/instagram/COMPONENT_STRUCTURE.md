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
    <InstagramFeed.InstagramMediaRepeater>
      <InstagramMedia.caption></InstagramMedia.caption>
      <InstagramMedia.mediaType></InstagramMedia.mediaType>
      <InstagramMedia.userName></InstagramMedia.userName>
      <InstagramMedia.timestamp></InstagramMedia.timestamp>
      <InstagramMedia.MediaGalleries>
        <InstagramMedia.MediaGalleryRepeater>
          <MediaGallery.Root />
        </InstagramMedia.MediaGalleryRepeater>
      </InstagramMedia.MediaGalleries>
    </InstagramFeed.InstagramMediaRepeater>
  </InstagramFeed.InstagramMedias>


</InstagramFeed.Root>
```

## Notes

- Use `InstagramFeed.InstagramMedias` as the list container with empty state support.
- Use `InstagramFeed.InstagramMediaRepeater` to iterate media items and provide per-item context.
- Use the `InstagramMedia.*` namespace for item-level subcomponents such as `caption`, `mediaType`, `userName`, `timestamp`, and nested `MediaGalleries`/`MediaGalleryRepeater`.
