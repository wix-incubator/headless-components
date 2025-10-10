// @ts-check
import { defineConfig } from 'astro/config';
import wix from "@wix/astro";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [
    wix(),
    react(),
    tailwind({ applyBaseStyles: false }),
  ],

  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
  }),

  image: {
    domains: ["static.wixstatic.com"],
  },

  output: "server",
});
