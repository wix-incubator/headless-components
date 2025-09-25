// @ts-check
import { defineConfig } from 'astro/config';
import wix from "@wix/astro";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [wix(), react()],

  vite: {
    plugins: [tailwindcss()],
  },

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
