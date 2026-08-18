// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  redirects: {
    "/": "/resume",
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    starlight({
      pagefind: false,
      title: "Matthew Bratrsovsky",
      customCss: ["./src/styles/main.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/mattkbrat",
        },
      ],
      components: {
        Hero: "./src/components/hero.astro",
      },
    }),
  ],
});
