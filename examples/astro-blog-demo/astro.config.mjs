import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import wix from '@wix/astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.WIX_PUBLIC_URL || 'https://example.com',
  integrations: [react(), wix({ enableHtmlEmbeds: false }), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
