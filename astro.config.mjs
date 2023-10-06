import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";

import preact from "@astrojs/preact";

// https://astro.build/config
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), preact(), sitemap()],
  output: "server",
  site: "https://www.mattkbrat.com",
  adapter: cloudflare()
});