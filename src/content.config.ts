import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import * as z from 'astro/zod';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(), schema: docsSchema({
      extend: z.object({
        links: z.optional(z.array(z.string()))
      })
	}) }),
};
