import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import { marketingOrigin, publicPagePaths } from './src/application/site-metadata.mjs';

const environment = loadEnv(process.env.NODE_ENV || 'production', fileURLToPath(new URL('.', import.meta.url)), 'PUBLIC_');
const siteOrigin = marketingOrigin(process.env.PUBLIC_SITE_ORIGIN ?? environment.PUBLIC_SITE_ORIGIN ?? '');

export default defineConfig({
  output: "static",
  site: siteOrigin || undefined,
  integrations: [react(), ...(siteOrigin ? [sitemap({ filter: page => publicPagePaths.includes(new URL(page).pathname) })] : [])],
  trailingSlash: "ignore",
  build: { inlineStylesheets: "always" },
  vite: {
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'motion-runtime',
                test: /(?:node_modules[\\/](?:gsap|lenis)[\\/]|src[\\/]runtime[\\/](?:landing-runtime|hero-media|capital-bridge|thesis-motion|smooth-scroll|landing-session)\.)/,
                priority: 20,
              },
              { name: 'icons', test: /node_modules[\\/]@phosphor-icons[\\/]/, priority: 10 },
            ],
          },
        },
      },
    },
  },
  devToolbar: { enabled: false },
});
