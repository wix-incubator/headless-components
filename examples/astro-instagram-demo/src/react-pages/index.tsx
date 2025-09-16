import React, { useMemo } from 'react';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import { createServicesManager, createServicesMap } from '@wix/services-manager';
import { InstagramFeed as Instagram } from '@wix/headless-instagram/react';
import {
  InstagramFeedService,
  InstagramFeedServiceDefinition,
  type InstagramFeedServiceConfig,
} from '@wix/headless-instagram/services';

function useInstagramServicesManager(config: InstagramFeedServiceConfig) {
  return useMemo(() => {
    return createServicesManager(
      createServicesMap().addService(
        InstagramFeedServiceDefinition,
        InstagramFeedService as any,
        config as any,
      ),
    );
  }, [config]);
}

export default function IndexPage(props: {
  instagramConfig: InstagramFeedServiceConfig;
}) {
  const { instagramConfig } = props;
  const servicesManager = useInstagramServicesManager(instagramConfig);

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <main className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-semibold mb-6">Instagram Feed</h1>

          <Instagram.Root instagramFeedServiceConfig={instagramConfig}>
            <Instagram.Header className="mb-4">
              <div className="text-sm opacity-80">Latest posts from</div>
              <div className="text-xl font-medium">
                <Instagram.UserName />
              </div>
            </Instagram.Header>

            <Instagram.Gallery>
              <Instagram.GalleryItems>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Instagram.GalleryRepeater>
                    <Instagram.GalleryItem>
                      <a href="#" className="block rounded overflow-hidden border">
                        <Instagram.Media />
                      </a>
                    </Instagram.GalleryItem>
                  </Instagram.GalleryRepeater>
                </div>
              </Instagram.GalleryItems>
            </Instagram.Gallery>
          </Instagram.Root>
        </div>
      </main>
    </ServicesManagerProvider>
  );
}
