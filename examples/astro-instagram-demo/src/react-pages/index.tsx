import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed, InstagramMedia, useInstagramMediasContext } from '@wix/headless-instagram/react';
import { InstagramMediaGallery, useExpandMode } from '../components/media';
import {
  type InstagramFeedServiceConfig,
} from '@wix/headless-instagram/services';
import { MediaGallery } from '@wix/headless-media/react';
// Component that uses Instagram context and provides expand functionality
function InstagramMediasWithExpandMode() {
  const { hasItems, mediaItems } = useInstagramMediasContext();
  console.log('InstagramMediasWithExpandMode - hasItems:', hasItems, 'mediaItems:', mediaItems);

  // Convert Instagram media items to expand mode format
  // Flatten carousel posts to include all individual images
  const { expandMediaItems, postIndexToExpandIndex } = React.useMemo(() => {
    const flattenedImages: { image: string; altText: string }[] = [];
    const indexMap: number[] = []; // Maps Instagram post index to flattened image starting index

    mediaItems.forEach((item: any, postIndex: number) => {
      indexMap[postIndex] = flattenedImages.length; // Store starting index for this post

      if (item.type === 'carousel' && item.children && item.children.length > 0) {
        // For carousel posts, add all individual images
        item.children.forEach((carouselItem: any, carouselIndex: number) => {
          const imageUrl = carouselItem.type === 'video'
            ? carouselItem.thumbnailUrl || carouselItem.mediaUrl
            : carouselItem.mediaUrl;

          flattenedImages.push({
            image: imageUrl,
            altText: carouselItem.altText || item.caption || `Instagram carousel item ${carouselIndex + 1}`,
          });
        });
      } else {
        // For single posts, add the single image
        const imageUrl = item.type === 'video'
          ? item.thumbnailUrl || item.mediaUrl
          : item.mediaUrl;

        flattenedImages.push({
          image: imageUrl,
          altText: item.altText || item.caption || `Instagram ${item.type}`,
        });
      }
    });

    return {
      expandMediaItems: flattenedImages,
      postIndexToExpandIndex: indexMap
    };
  }, [mediaItems]);

  // Use expand mode hook
  const { expand, ExpandModal } = useExpandMode(expandMediaItems);

  // Track current index externally
  let currentIndex = -1;

  if (!hasItems) return null;

  return (
    <>
        <InstagramFeed.InstagramMediaItems>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <InstagramFeed.InstagramMediaRepeater>
              <InstagramMediaWithExpand
                onExpand={(index) => expand(postIndexToExpandIndex[index])}
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
  console.log('InstagramMediaWithExpand rendering for index:', index);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Instagram Metadata */}
      <div className="p-4 border-b">
        <InstagramMedia.Caption className="text-sm text-gray-700 mb-2" />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <InstagramMedia.MediaType />
          <InstagramMedia.Timestamp />
        </div>
        <InstagramMedia.UserName className="font-medium text-gray-900 mt-1" />
      </div>

      {/* Main Media Display with Expand on Click */}
      <InstagramMedia.MediaGalleries>
        <InstagramMedia.MediaGalleryItems>
          <InstagramMedia.MediaGalleryRepeater>
            <div className="relative aspect-square bg-gray-100">
              <MediaGallery.Viewport
                asChild={true}
                className="w-full h-full cursor-pointer group"
                emptyState={
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                }
              >
                {React.forwardRef<HTMLDivElement, { src: string; alt: string }>((imgProps, ref) => (
                  <div
                    ref={ref}
                    className="w-full h-full relative group cursor-pointer"
                    onClick={() => onExpand(index)}
                  >
                    <img
                      src={imgProps.src}
                      alt={imgProps.alt}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                          {/* Expand overlay on hover */}
                          <div className="absolute inset-0 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-70 rounded-full p-2">
                              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                  </div>
                ))}
              </MediaGallery.Viewport>

              {/* Navigation controls for carousels */}
              <MediaGallery.Previous className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </MediaGallery.Previous>
              <MediaGallery.Next className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </MediaGallery.Next>
              <MediaGallery.Indicator className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs" />
            </div>

            {/* Thumbnail strip for carousels */}
            <div className="p-3 bg-gray-50">
              <MediaGallery.Thumbnails>
                <div className="flex gap-2 overflow-x-auto">
                  <MediaGallery.ThumbnailRepeater>
                    <MediaGallery.ThumbnailItem asChild>
                      {({ src, alt, isActive, select }) => (
                        <img
                          src={src}
                          alt={alt}
                          onClick={select}
                          className={`w-12 h-12 flex-shrink-0 rounded cursor-pointer object-cover border-2 transition-all ${
                            isActive
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        />
                      )}
                    </MediaGallery.ThumbnailItem>
                  </MediaGallery.ThumbnailRepeater>
                </div>
              </MediaGallery.Thumbnails>
            </div>
          </InstagramMedia.MediaGalleryRepeater>
        </InstagramMedia.MediaGalleryItems>
      </InstagramMedia.MediaGalleries>
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

        <InstagramFeed.InstagramMedias>
          <InstagramMediasWithExpandMode />
        </InstagramFeed.InstagramMedias>
        </InstagramFeed.Root>
      </div>
    </InstagramLayout>
  );
}
