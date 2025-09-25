import React from 'react';
import InstagramLayout from '../layouts/InstagramLayout';
import { InstagramFeed, InstagramMedia } from '@wix/headless-instagram/react';
import { MediaGallery } from '@wix/headless-media/react';
import { type InstagramFeedServiceConfig } from '@wix/headless-instagram/services';

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
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-12 mb-10">
              <div className="text-center space-y-1">
                <InstagramFeed.Title title="Follow Us on Instagram" className="text-sm opacity-80" />
                <div className="text-lg font-medium">
                  <InstagramFeed.UserName />
                </div>
                <div className="opacity-70 text-sm">
                  <InstagramFeed.Hashtag hashtag={instagramConfig.accountId || 'instagram'} />
                </div>
              </div>
          </div>

          <h2 className="text-xl font-semibold mb-3">Latest Posts</h2>

          <InstagramFeed.InstagramMedias>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <InstagramFeed.InstagramMediaRepeater>
                <MediaGallery.Viewport asChild>
                  {({ src, alt }) => (
                    <img
                      src={src}
                      alt={alt || ''}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  )}
                </MediaGallery.Viewport>
              </InstagramFeed.InstagramMediaRepeater>
            </div>
          </InstagramFeed.InstagramMedias>
        </InstagramFeed.Root>
      </div>

      {/* Instagram Card Layout */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <InstagramFeed.Root instagramFeedServiceConfig={instagramConfig}>
            <InstagramFeed.InstagramMedias>
              <InstagramFeed.InstagramMediaRepeater>

                <div className="flex min-h-[500px]">
                  {/* Left Side - Image */}
                  <div className="flex-1 bg-gray-900 flex items-center justify-center">
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
                  <div className="w-96 bg-white flex flex-col border-l border-gray-200">
                    {/* Navigation and Title Area */}
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <span className="text-xs">📷</span>
                          </div>
                        </div>
                        <InstagramMedia.UserName className="font-semibold text-gray-900" />
                      </div>
                    </div>
                    <div className="p-6 border-b border-gray-200 flex-1">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-6">
                          <MediaGallery.Previous className="text-gray-600 hover:text-gray-800 text-2xl cursor-pointer">
                            ‹
                          </MediaGallery.Previous>
                          <MediaGallery.Next className="text-gray-600 hover:text-gray-800 text-2xl cursor-pointer">
                            ›
                          </MediaGallery.Next>
                        </div>
                      </div>

                      <div className="text-xl font-medium text-gray-900 mb-8">
                        <InstagramMedia.Caption />
                      </div>
                    </div>

                    {/* Timestamp Area */}
                    <div className="p-6 mt-auto bg-gray-50">
                      <div className="text-sm text-gray-600">
                        <InstagramMedia.Timestamp />
                      </div>
                    </div>
                  </div>
                </div>

              </InstagramFeed.InstagramMediaRepeater>
            </InstagramFeed.InstagramMedias>
          </InstagramFeed.Root>
        </div>
      </div>
    </InstagramLayout>

  );
}
