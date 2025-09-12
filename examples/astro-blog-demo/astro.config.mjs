import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import wix from '@wix/astro';
import { defineConfig } from 'astro/config';
import fs from 'fs';

const hasCertificates = fs.existsSync('./localhost+2-key.pem');

// https://astro.build/config
export default defineConfig({
  site: process.env.WIX_PUBLIC_URL || 'http://localhost:4321/',
  base: '/blog',
  integrations: [
    react(),
    wix({ enableAuthRoutes: true, enableHtmlEmbeds: false }),
    sitemap(),
  ],
  vite: {
    server: {
      https: hasCertificates
        ? {
            key: './localhost+2-key.pem',
            cert: './localhost+2.pem',
          }
        : undefined,
      host: true,
    },
    plugins: [tailwindcss()],
  },
});
