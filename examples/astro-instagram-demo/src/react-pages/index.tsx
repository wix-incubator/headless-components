import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed } from '@wix/headless-instagram/react';
import { type InstagramFeedServiceConfig } from '@wix/headless-instagram/services';


function MediaCard() {
  const { mediaItem } = (InstagramFeed as any).useGalleryItemContext() as any;
  const dateLabel = mediaItem?.timestamp ? new Date(mediaItem.timestamp).toLocaleDateString() : '';
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
      <div className="aspect-square overflow-hidden">
        <InstagramFeed.Media />
      </div>
      <div className="flex items-center justify-between px-3 py-2 text-xs opacity-80">
        <span>{dateLabel}</span>
        <span>📷</span>
      </div>
    </div>
  );
}

export default function IndexPage(props: {
  instagramConfig: InstagramFeedServiceConfig;
}) {
  const { instagramConfig } = props;

  const [value, setValue] = React.useState(instagramConfig.accountId || '');
  const onApply = () => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set('accountId', value); else url.searchParams.delete('accountId');
    window.location.href = url.toString();
  };

  return (
    <InstagramLayout>
      <div>
          <h1 className="text-3xl font-semibold mb-3 text-center">Instagram Feed</h1>



          <div className="mb-6 flex items-center gap-2">
            <input
              className="border rounded px-3 py-2 w-64"
              placeholder="Enter accountId"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button className="px-3 py-2 border rounded" onClick={onApply}>Load</button>
          </div>

          <InstagramFeed.Root instagramFeedServiceConfig={instagramConfig}>
          <p className="text-center opacity-80 mb-8">Follow our journey and stay connected with our latest updates, behind-the-scenes moments, and community highlights.</p>

          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-12 mb-10">
            <div className="mx-auto w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-2xl mb-6">📷</div>
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


            <InstagramFeed.Gallery>
              <InstagramFeed.GalleryItems>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <InstagramFeed.GalleryRepeater>
                    <InstagramFeed.GalleryItem>
                      <MediaCard />
                    </InstagramFeed.GalleryItem>
                  </InstagramFeed.GalleryRepeater>
                </div>
              </InstagramFeed.GalleryItems>
            </InstagramFeed.Gallery>
          </InstagramFeed.Root>
        </div>
      

      </InstagramLayout>
  );
}
