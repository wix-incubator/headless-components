import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed } from '@wix/headless-instagram/react';
import { MediaGallery } from '@wix/headless-media/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '@wix/headless-instagram/services';
import { MediaGalleryServiceDefinition } from '@wix/headless-media/services';
import { type InstagramFeedServiceConfig } from '@wix/headless-instagram/services';
// useService already imported above

// No custom image rendering; gallery components handle images (like Stores)

export default function IndexPage(props: {
  instagramConfig: InstagramFeedServiceConfig;
}) {
  const { instagramConfig } = props;

  const [value, setValue] = React.useState(instagramConfig.accountId || '');
  const onApply = () => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set('accountId', value);
    else url.searchParams.delete('accountId');
    window.location.href = url.toString();
  };

  return (
    <InstagramLayout>
      <div>
        <h1 className="text-3xl font-semibold mb-3 text-center">
          Instagram Feed
        </h1>

        <InstagramFeed.Root instagramFeedServiceConfig={instagramConfig}>
          <p className="text-center opacity-80 mb-8">
            Follow our journey and stay connected with our latest updates,
            behind-the-scenes moments, and community highlights.
          </p>

          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-12 mb-10">
            <div className="mx-auto w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-2xl mb-6">
              📷
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm opacity-80">Follow Us on Instagram</div>
              <div className="text-lg font-medium">
                <InstagramFeed.UserName />
              </div>
              <div className="opacity-70 text-sm">
                <InstagramFeed.Hashtag />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3">Latest Posts</h2>

          {/* Feed-level gallery: Instagram urls are external, so render with asChild */}
          <InstagramFeed.FeedMediaGalleries>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <MediaGallery.Viewport className="col-span-full rounded-lg mb-4" />

              <FeedCaptionAndDate className="col-span-full -mt-2 mb-4 text-sm opacity-80" />
              <MediaGallery.Thumbnails>
                <MediaGallery.ThumbnailRepeater>
                  <MediaGallery.ThumbnailItem className="aspect-square rounded-md" />
                </MediaGallery.ThumbnailRepeater>
              </MediaGallery.Thumbnails>
            </div>
          </InstagramFeed.FeedMediaGalleries>
        </InstagramFeed.Root>
      </div>
    </InstagramLayout>
  );
}

function FeedCaptionAndDate(props: { className?: string }) {
  const feed = useService(InstagramFeedServiceDefinition);
  const gallery = useService(MediaGalleryServiceDefinition);

  const items = feed.feedData.get().mediaItems;
  const index = gallery.selectedMediaIndex.get();
  const item = items[index];
  if (!item) return null;

  const date = new Date(item.timestamp);
  const formatted = isNaN(date.getTime())
    ? item.timestamp
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

  return (
    <div className={props.className}>
      <div className="font-medium">{item.caption || ''}</div>
      <div className="opacity-70">{formatted}</div>
    </div>
  );
}
