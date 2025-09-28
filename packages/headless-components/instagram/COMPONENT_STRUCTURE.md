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

  {/* Media Section */}
  <InstagramFeed.InstagramMedias>
    <InstagramFeed.InstagramMediaRepeater>

        {/* <MediaGallery.Viewport>
             <MediaGallery.Previous/> */}
        <InstagramMedia.Caption />
        <InstagramMedia.MediaType />
        <InstagramMedia.UserName />
        <InstagramMedia.Timestamp />
        <InstagramMedia.MediaGalleries>
          <InstagramMedia.MediaGalleryRepeater>
               <MediaGallery.Viewport asChild>
                      {({ src, alt }) => (
                        <img
                          src={src}
                          alt={alt || ''}
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      )}
                    </MediaGallery.Viewport>

          </InstagramMedia.MediaGalleryRepeater>
        </InstagramMedia.MediaGalleries>
        {/*   <MediaGallery.Next/>
            </MediaGallery.Viewport> */}
    </InstagramFeed.InstagramMediaRepeater>
  </InstagramFeed.InstagramMedias>
</InstagramFeed.Root>
```

## Notes

- Use `InstagramFeed.InstagramMedias` as the list container.
- Use `InstagramFeed.InstagramMediaRepeater` to iterate media items and provide per-item context.
- `InstagramMediaRepeater` automatically sets up `MediaGallery.Root` with proper media data.
- Use `InstagramMedia.*` namespace for item-level data (caption, mediaType, userName, timestamp).
- Use plain `MediaGallery.*` components directly within the repeater - no custom wrappers needed.
