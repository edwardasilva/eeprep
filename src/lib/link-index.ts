import { z } from 'astro/zod';
import GithubSlugger from 'github-slugger';
import data from '../data/link-index.json';

// src/data/link-index.json is the Sources table. Its order is the display
// order, and each category's table starts where its first entry appears. The
// build fails if an entry is missing a field or has an empty one.
// .github/scripts/check-link-index.mjs keeps it in sync with the built site.
const text = z.string().trim().min(1);
const schema = z
	.array(
		z.strictObject({
			url: z.url({ protocol: /^https?$/ }),
			title: text,
			category: text,
			summary: text,
			pages: z.array(text).min(1),
		}),
	)
	.min(1);

export type LinkEntry = z.infer<typeof schema>[number];
export interface LinkGroup {
	/** Heading id. The table of contents links to it. */
	id: string;
	name: string;
	entries: LinkEntry[];
}

/** The page that renders the table. */
export const linkIndexPage = 'help/all-links';

/**
 * Entries grouped by category, in file order. The page headings and the
 * table of contents both come from this, so they can't drift apart.
 */
export const linkGroups: LinkGroup[] = group(schema.parse(data));

function group(entries: LinkEntry[]): LinkGroup[] {
	const slugger = new GithubSlugger();
	const groups: LinkGroup[] = [];
	for (const entry of entries) {
		let current = groups.at(-1);
		if (current?.name !== entry.category) {
			if (groups.some((g) => g.name === entry.category))
				throw new Error(
					`src/data/link-index.json: category "${entry.category}" is split. Keep its entries together.`,
				);
			current = {
				id: slugger.slug(entry.category),
				name: entry.category,
				entries: [],
			};
			groups.push(current);
		}
		current.entries.push(entry);
	}
	return groups;
}
