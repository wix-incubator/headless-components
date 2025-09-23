import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed, InstagramMedia, useInstagramMediasContext } from '@wix/headless-instagram/react';
import { InstagramMediaGallery, useExpandMode } from '../components/media';
import {
  type InstagramFeedServiceConfig,
} from '@wix/headless-instagram/services';

// Component that uses Instagram context and provides expand functionality
function InstagramMediasWithExpandMode() {
  const { hasItems, mediaItems } = useInstagramMediasContext();

  // Convert Instagram media items to expand mode format
  const expandMediaItems = React.useMemo(() =>
    mediaItems.map((item: any) => ({
      image: item.type === 'video'
        ? item.thumbnailUrl || item.mediaUrl
        : item.mediaUrl,
      altText: item.altText || item.caption || `Instagram ${item.type}`,
    })),
    [mediaItems]
  );

  // Use expand mode hook
  const { expand, ExpandModal } = useExpandMode(expandMediaItems);

  // Track current index externally
  let currentIndex = -1;

  if (!hasItems) return null;

  return (
    <>
      <InstagramFeed.InstagramMediaItems>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <InstagramFeed.InstagramMediaRepeater>
            <InstagramMediaWithExpand
              onExpand={(index) => expand(index)}
              getCurrentIndex={() => ++currentIndex}
            />
          </InstagramFeed.InstagramMediaRepeater>
        </div>
      </InstagramFeed.InstagramMediaItems>

      {/* Expand Modal */}
      <ExpandModal />
    </>
  );
}

// Individual Instagram media item with expand functionality
interface InstagramMediaWithExpandProps {
  onExpand: (index: number) => void;
  getCurrentIndex: () => number;
}

function InstagramMediaWithExpand({ onExpand, getCurrentIndex }: InstagramMediaWithExpandProps) {
  const index = getCurrentIndex();

  return (
    <InstagramMedia.Root>
      <InstagramMedia.MediaGalleries>
        <InstagramMedia.MediaGalleryItems>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden group">
            <InstagramMedia.MediaGalleryRepeater>
              <InstagramMediaGallery.Viewport
                clickable={true}
                onImageClick={() => onExpand(index)}
              />
            </InstagramMedia.MediaGalleryRepeater>
          </div>
        </InstagramMedia.MediaGalleryItems>
      </InstagramMedia.MediaGalleries>
    </InstagramMedia.Root>
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

        <InstagramFeed.InstagramMedias>
          <InstagramMediasWithExpandMode />
        </InstagramFeed.InstagramMedias>
        </InstagramFeed.Root>
      </div>
    </InstagramLayout>
  );
}
