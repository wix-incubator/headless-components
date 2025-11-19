import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed, InstagramMedia } from '@wix/headless-instagram/react';
import { MediaGallery } from '@wix/headless-media/react';
import { type InstagramFeedServiceConfig } from '@wix/headless-instagram/services';
// useService already imported above

// No custom image rendering; gallery components handle images (like Stores)

export default function IndexPage(props: {
  instagramConfig: InstagramFeedServiceConfig;
}) {
  const { instagramConfig } = props;

  return (
    <InstagramLayout>
      <div>
        <h1 className="text-3xl font-semibold mb-3 text-center">
          Instagram Feed
        </h1>

        <InstagramFeed.Root instagramFeedServiceConfig={instagramConfig}>
          <div className="max-w-4xl mx-auto rounded-2xl border border-foreground bg-background backdrop-blur p-12 mb-10">
            <div className="text-center space-y-1">
              <div className="text-lg font-medium">
                <InstagramFeed.UserName />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3">Latest Posts</h2>

          <InstagramFeed.InstagramMedias>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <InstagramMedia.MediaGalleries>
                <InstagramMedia.MediaGalleryRepeater>
                  {() => (
                    <MediaGallery.Viewport asChild>
                      {({ src, alt }) => {
                        return (
                          <img
                            src={src}
                            alt={alt || ''}
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        );
                      }}
                    </MediaGallery.Viewport>
                  )}
                </InstagramMedia.MediaGalleryRepeater>
              </InstagramMedia.MediaGalleries>
            </div>
          </InstagramFeed.InstagramMedias>
        </InstagramFeed.Root>
      </div>

      {/* Instagram Card Layout */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="space-y-4">
          <InstagramFeed.Root instagramFeedServiceConfig={instagramConfig}>
            <InstagramMedia.MediaGalleries>
              <InstagramMedia.MediaGalleryRepeater>
                {({ mediaItem, index }) => (
                  <div className="bg-background rounded-xl overflow-hidden border border-foreground">
                    <div className="flex min-h-[500px]">
                      {/* Left Side - Image */}
                      <div className="flex-1 bg-background flex items-center justify-center">
                        <div className="relative w-full h-full flex items-center justify-center">
                          <MediaGallery.Viewport asChild>
                            {({ src, alt }) => (
                              <img
                                src={src}
                                alt={alt || ''}
                                className="max-w-full max-h-full object-contain"
                              />
                            )}
                          </MediaGallery.Viewport>
                        </div>
                      </div>

                      {/* Right Side - Content */}
                      <div className="w-96 bg-background flex flex-col border-l border-foreground">
                        {/* Header */}
                        <div className="bg-background border-b border-foreground p-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full border border-foreground flex items-center justify-center mr-3">
                              <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
                                <span className="text-xs">📷</span>
                              </div>
                            </div>
                            <InstagramMedia.UserName className="font-semibold text-foreground" />
                          </div>
                          {/* Now you can access mediaItem and index directly */}
                          <div className="text-sm text-secondary-foreground mt-2">
                            Post #{index + 1} • {mediaItem.type}
                          </div>
                        </div>

                        {/* Navigation and Caption */}
                        <div className="p-6 border-b border-foreground flex-1">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-6">
                              <MediaGallery.Previous className="text-foreground text-2xl cursor-pointer">
                                ‹
                              </MediaGallery.Previous>
                              <MediaGallery.Next className="text-foreground text-2xl cursor-pointer">
                                ›
                              </MediaGallery.Next>
                            </div>
                          </div>
                          <div className="text-xl font-medium text-foreground mb-8 max-h-60 overflow-auto">
                            <InstagramMedia.Caption />
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="p-6 mt-auto bg-background">
                          <div className="text-sm text-foreground opacity-70">
                            <InstagramMedia.Timestamp />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </InstagramMedia.MediaGalleryRepeater>
            </InstagramMedia.MediaGalleries>
          </InstagramFeed.Root>
        </div>
      </div>
    </InstagramLayout>
  );
}
