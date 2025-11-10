// @ts-check
import { defineConfig } from "astro/config";
import wix from "@wix/astro";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [wix(), react()],

  image: {
    domains: ["static.wixstatic.com"],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
  }),
});