// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import wix from '@wix/astro';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://kitchensink-netanelg4.wix-host.com',
  output: 'server',
  adapter: cloudflare(),
  integrations: [react(), wix(), sitemap(), tailwind()],
  vite: {
    resolve: {
      alias: {
        '@wix/events/components': '@wix/headless-events/react',
        '@wix/events/services': '@wix/headless-events/services',
      },
    },
  },
});
