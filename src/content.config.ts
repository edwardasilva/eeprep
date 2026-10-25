import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				pageType: z.enum(['guide', 'study', 'resources']).optional(),
				chapter: z.string().optional(),
				section: z.string().optional(),
				lede: z.string().optional(),
				readingTime: z.string().optional(),
				keyTerms: z.array(z.string()).optional(),
				values: z.array(z.string()).optional(),
				placeholder: z.boolean().optional(),
			}),
		}),
	}),
	resources: defineCollection({
		loader: glob({ pattern: '**/*.{md,yml,yaml}', base: './src/content/resources' }),
		schema: z.object({
			title: z.string(),
			url: z.string().url(),
			why: z.string().min(20).max(140),
		}),
	}),
};
