import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed, InstagramMedia } from '@wix/headless-instagram/react';
import { InstagramMediaItemServiceDefinition } from '@wix/headless-instagram/services';
import { MediaGallery } from '@wix/headless-media/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '@wix/headless-instagram/services';
import { MediaGalleryServiceDefinition } from '@wix/headless-media/services';
import { type InstagramFeedServiceConfig } from '@wix/headless-instagram/services';
// useService already imported above

// No custom image rendering; gallery components handle images (like Stores)

function ClickableViewport({ src, alt }: { src: string; alt: string }) {
  const gallery = useService(MediaGalleryServiceDefinition);
  const onClick = () => {
    // Advance to next image on click to mimic interactive viewport
    if (gallery.hasNextMedia()) gallery.nextMedia();
  };
  return (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      className="col-span-full rounded-lg mb-4 w-full h-auto cursor-pointer"
    />
  );
}

function ItemLightbox() {
  const [open, setOpen] = React.useState(false);
  const gallery = useService(MediaGalleryServiceDefinition);
  const feed = useService(InstagramFeedServiceDefinition);
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const items = feed.feedData.get().mediaItems;
  const feedIndex = mediaItemService.index.get();
  console.log({items});

  return (
    <>
    {/* <MediaGallery.Thumbnails>
      <MediaGallery.ThumbnailRepeater>
        <MediaGallery.ThumbnailItem asChild>
          {({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              onClick={() => setOpen(true)}
              className="col-span-full rounded-lg mb-4 w-full h-auto cursor-pointer"
            />
          )}
        </MediaGallery.ThumbnailItem>
      </MediaGallery.ThumbnailRepeater>
    </MediaGallery.Thumbnails> */}
      <MediaGallery.Viewport asChild>
        {({ src, alt }) => (
          <img
            src={src}
            alt={alt || ''}
            onClick={() => setOpen(true)}
            className="col-span-full rounded-lg mb-4 w-full h-auto cursor-pointer"
          />
        )}
      </MediaGallery.Viewport>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="max-w-3xl w-full p-4" onClick={(e) => e.stopPropagation()}>
            <LightboxGallery
              initialIndex={feedIndex}
              images={items.map((it) => ({ image: (it.type === 'video' ? (it.thumbnailUrl || it.mediaUrl) : it.mediaUrl) || '', altText: it.altText }))}
              feedItems={items}
            />
            <div className="mt-3 text-right">
              <button className="px-3 py-1 rounded bg-white/10 hover:bg-white/20" onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LightboxGallery({ initialIndex, images, feedItems }: { initialIndex: number; images: { image: string; altText?: string | null }[]; feedItems: any[] }) {
  return (
    <MediaGallery.Root mediaGalleryServiceConfig={{ media: images, infinite: true }}>
      <SetSelectedIndex index={initialIndex} />
      <div className="relative">
        <MediaGallery.Viewport asChild>
          {({ src, alt }) => (
            <img src={src} alt={alt || ''} className="w-full h-auto rounded-md" />
          )}
        </MediaGallery.Viewport>
        <div className="absolute inset-x-0 top-0 flex justify-between p-2">
          <MediaGallery.Previous className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Prev</MediaGallery.Previous>
          <MediaGallery.Next className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Next</MediaGallery.Next>
        </div>
      </div>
      <div className="mt-3 text-sm">
        <ActiveCaptionAndDate feedItems={feedItems} />
      </div>
    </MediaGallery.Root>
  );
}

function SetSelectedIndex({ index }: { index: number }) {
  const g = useService(MediaGalleryServiceDefinition);
  React.useEffect(() => {
    g.setSelectedMediaIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  return null;
}

function ActiveCaptionAndDate({ feedItems }: { feedItems: any[] }) {
  const g = useService(MediaGalleryServiceDefinition);
  const index = g.selectedMediaIndex.get();
  const currentItem = feedItems[index];
  if (!currentItem) return null;
  const d = new Date(currentItem.timestamp);
  const formatted = isNaN(d.getTime())
    ? currentItem.timestamp
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  return (
    <>
      <div className="font-medium">{currentItem.caption || ''}</div>
      <div className="opacity-70">{formatted}</div>
    </>
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
            <InstagramFeed.InstagramMediaItems>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <InstagramFeed.InstagramMediaRepeater>
                  <InstagramMedia.MediaGalleries>
                    <InstagramMedia.MediaGalleryItems>
                      <InstagramMedia.MediaGalleryRepeater>
                        <MediaGallery.Root mediaGalleryServiceConfig={{ media: [], infinite: true }}>
                          <ItemLightbox />
                        </MediaGallery.Root>
                      </InstagramMedia.MediaGalleryRepeater>
                    </InstagramMedia.MediaGalleryItems>
                  </InstagramMedia.MediaGalleries>
                </InstagramFeed.InstagramMediaRepeater>
              </div>
            </InstagramFeed.InstagramMediaItems>
          </InstagramFeed.InstagramMedias>
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
