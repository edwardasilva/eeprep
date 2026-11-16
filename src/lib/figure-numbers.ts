// Figure numbers run through the whole site in sidebar order, so each figure
// has one number. The table of contents and the page CSS both read the count
// from here, so they cannot disagree.
import path from 'node:path';
import { getCollection } from 'astro:content';
import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import { itemsOf } from './site-index.mjs';

type Entry = StarlightRouteData['sidebar'][number];

let cache: Map<string, number> | undefined;

/** For each sidebar href, how many figures come before that page. */
export async function figureStarts(sidebar: Entry[]) {
	if (cache) return cache;
	const docs = new Map<string, { body: string; file: string }>();
	for (const doc of await getCollection('docs')) {
		docs.set(doc.id, {
			body: doc.body ?? '',
			file: path.resolve(doc.filePath ?? ''),
		});
	}
	const starts = new Map<string, number>();
	let count = 0;
	const walk = (entries: Entry[]) => {
		for (const entry of entries) {
			if (entry.type === 'group') {
				walk(entry.entries);
				continue;
			}
			const doc = docs.get(entry.href.replace(/^\/|\/$/g, ''));
			if (!doc) continue;
			starts.set(entry.href, count);
			count += itemsOf(doc.body, doc.file).figures.length;
		}
	};
	walk(sidebar);
	cache = starts;
	return starts;
}
