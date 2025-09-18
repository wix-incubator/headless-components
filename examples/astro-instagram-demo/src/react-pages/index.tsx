import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed } from '@wix/headless-instagram/react';
import { MediaGallery } from '@wix/headless-media/react';
import {
  type InstagramFeedServiceConfig,
  InstagramMediaItemServiceDefinition,
} from '@wix/headless-instagram/services';
import { useService } from '@wix/services-manager-react';

function MediaCard({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  // Access the original Instagram media item from service to check if it's a video
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = mediaItemService.mediaItem.get();
  const isVideo = mediaItem.type === 'video';

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
      <div className="aspect-square overflow-hidden relative">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-2 backdrop-blur-sm">
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-3 py-2 text-xs opacity-80">
        <span>{isVideo ? '🎥' : '📷'}</span>
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

          <InstagramFeed.Gallery>
            <InstagramFeed.GalleryItems>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <InstagramFeed.GalleryItemRepeater>
                  <MediaGallery.ThumbnailItem asChild>
                    {({ src, alt, index }) => (
                      <MediaCard src={src} alt={alt} index={index} />
                    )}
                  </MediaGallery.ThumbnailItem>
                </InstagramFeed.GalleryItemRepeater>
              </div>
            </InstagramFeed.GalleryItems>
          </InstagramFeed.Gallery>
        </InstagramFeed.Root>
      </div>
    </InstagramLayout>
  );
}
