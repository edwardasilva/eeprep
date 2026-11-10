// Reads the page sources to list headings, figures, and tables, so the three
// pages under the sitemap (contents, figures, tables) never need a manual
// edit. A new heading, figure, or table shows up on the next build.
//
// Figures: a figure component imported into a page and used as <Name />. The
// figure id and title come from the component file. The title is its
// .eep-kicker line. A figure with no id or no title fails the build, so a new
// figure can't go missing from the list.
// Tables: a markdown table in a page, titled by the heading above it, and a
// <table> inside a figure component, titled by that figure.
import fs from 'node:fs';
import path from 'node:path';
import { slug as slugify } from 'github-slugger';

const clean = (text) =>
	text
		.replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]*>/g, '')
		.replace(/[`*_]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

/** Headings of level 2 and 3, with the anchor Starlight gives each one. */
export function headingsOf(body) {
	const seen = new Map();
	const out = [];
	let fenced = false;
	for (const line of body.split('\n')) {
		if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
		if (fenced) continue;
		const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
		if (!m) continue;
		const text = clean(m[2]);
		const base = slugify(text);
		const n = seen.get(base) ?? 0;
		seen.set(base, n + 1);
		out.push({
			level: m[1].length,
			text,
			id: n === 0 ? base : `${base}-${n}`,
		});
	}
	return out;
}

const figureCache = new Map();
function readFigure(file) {
	if (figureCache.has(file)) return figureCache.get(file);
	const src = fs.readFileSync(file, 'utf8');
	const rel = path.relative(process.cwd(), file);
	const tag = /<figure\b[^>]*\bclass="[^"]*\beep-fig\b[^"]*"[^>]*>/.exec(src);
	let info = null;
	if (tag) {
		const id = /\bid="([^"]+)"/.exec(tag[0])?.[1];
		const title = /<p class="eep-kicker"[^>]*>([\s\S]*?)<\/p>/.exec(src)?.[1];
		if (!id) throw new Error(`${rel}: the figure needs an id for the list`);
		if (!title)
			throw new Error(`${rel}: the figure needs an .eep-kicker title`);
		info = { id, title: clean(title), hasTable: /<table\b/.test(src) };
	}
	figureCache.set(file, info);
	return info;
}

/** Figures and tables of one page, in page order. */
export function itemsOf(body, docFile) {
	const imports = new Map();
	for (const m of body.matchAll(
		/^import\s+(\w+)\s+from\s+['"]([^'"]+\.astro)['"]/gm,
	)) {
		imports.set(m[1], path.resolve(path.dirname(docFile), m[2]));
	}
	const headings = headingsOf(body);
	const figures = [];
	const tables = [];
	let heading = null;
	let h = 0;
	let fenced = false;
	let inTable = false;
	for (const line of body.split('\n')) {
		if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
		if (fenced) continue;
		if (/^#{2,3}\s+/.test(line)) heading = headings[h++] ?? heading;
		if (/^\|.*\|\s*$/.test(line)) {
			if (!inTable) {
				tables.push({
					title: heading ? heading.text : null,
					id: heading ? heading.id : null,
				});
			}
			inTable = true;
			continue;
		}
		inTable = false;
		for (const m of line.matchAll(/<(\w+)\s*\/>/g)) {
			const file = imports.get(m[1]);
			const info = file && readFigure(file);
			if (!info) continue;
			figures.push({ id: info.id, title: info.title });
			if (info.hasTable) tables.push({ title: info.title, id: info.id });
		}
	}
	return { figures, tables };
}
