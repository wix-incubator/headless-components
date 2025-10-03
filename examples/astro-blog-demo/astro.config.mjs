import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import wix from "@wix/astro";
import { defineConfig } from "astro/config";
import fs from "fs";

const hasCertificates = fs.existsSync("./localhost+2-key.pem");

// https://astro.build/config
export default defineConfig({
  site: process.env.WIX_PUBLIC_URL || "http://localhost:4321/",
  integrations: [
    react(),
    wix({ enableAuthRoutes: true, enableHtmlEmbeds: false }),
    sitemap(),
    tailwind({ applyBaseStyles: false }),
  ],
  vite: {
    server: {
      https: hasCertificates
        ? {
            key: "./localhost+2-key.pem",
            cert: "./localhost+2.pem",
          }
        : undefined,
      host: true,
    },
    resolve: {
      // Vite: Mimick exported sdk from @wix/blog
      alias: {
        "@wix/blog/components": "@wix/headless-blog/react",
        "@wix/blog/services": "@wix/headless-blog/services",
        "@wix/pricing-plans/components": "@wix/headless-pricing-plans/react",
        "@wix/pricing-plans/services": "@wix/headless-pricing-plans/services",
      },
    },
  },
});
