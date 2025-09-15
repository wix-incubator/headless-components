// @ts-check
import { defineConfig } from "astro/config";
import wix from "@wix/astro";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://kitchensink-netanelg4.wix-host.com",
  output: "server",

  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
  }),

  vite: {
    plugins: [tailwindcss()],
    // Bundle @wix/image for SSR compatibility to fix module loading issues
    ssr: {
      noExternal: ["@wix/image"],
    },
  },

  integrations: [
    react(),
    wix(),
    sitemap(),
  ],

  image: {
    domains: ["static.wixstatic.com"],
  },
});