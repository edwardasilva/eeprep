import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				pageType: z.enum(['guide', 'study', 'resources']).optional(),
				keyTerms: z.array(z.string()).optional(),
				placeholder: z.boolean().optional(),
			}),
		}),
	}),
};
