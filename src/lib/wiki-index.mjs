import fs from 'node:fs';
import path from 'node:path';
import GithubSlugger, { slug as headingSlug } from 'github-slugger';

const DEFAULT_ROOT = path.resolve('src/content/docs');

/** @typedef {{ href: string, title: string, slug: string, file: string }} WikiPage */

/**
 * Pages keyed by the names an Obsidian wikilink can use.
 * Keys are trimmed and lowercased: the title, the filename, and the slug.
 */
export function loadWikiIndex(contentRoot = process.env.CONTENT_ROOT
	? path.resolve(process.env.CONTENT_ROOT)
	: DEFAULT_ROOT) {
	/** @type {Map<string, string>} */
	const byKey = new Map();
	/** @type {WikiPage[]} */
	const pages = [];

	if (!fs.existsSync(contentRoot)) return { byKey, pages, contentRoot };

	/** @param {string} dir */
	function walk(dir) {
		for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, ent.name);
			if (ent.isDirectory()) {
				walk(full);
				continue;
			}
			if (!/\.mdx?$/.test(ent.name)) continue;
			const rel = path.relative(contentRoot, full).replaceAll('\\', '/');
			const slug = rel.replace(/\.mdx?$/, '').replace(/\/index$/, '');
			const href = `/${slug}/`;
			const stem = ent.name.replace(/\.mdx?$/, '');
			const text = fs.readFileSync(full, 'utf8');
			const title = frontmatterTitle(text, stem.replaceAll('-', ' '));
			const page = { href, title, slug, file: rel };
			pages.push(page);
			const keys = [
				title,
				stem,
				stem.replaceAll('-', ' '),
				slug,
				slug.split('/').at(-1) ?? slug,
				(slug.split('/').at(-1) ?? slug).replaceAll('-', ' '),
			];
			for (const key of keys) {
				const normalized = normalizeWikiName(key);
				if (!normalized || byKey.has(normalized)) continue;
				byKey.set(normalized, href);
			}
		}
	}

	walk(contentRoot);
	return { byKey, pages, contentRoot };
}

/** @param {string} name */
export function normalizeWikiName(name) {
	return name.trim().toLowerCase();
}

/**
 * Splits a raw wikilink target into its page name and #heading, dropping any |alias.
 * @param {string} target Raw wikilink target, without brackets.
 */
export function splitWikiTarget(target) {
	const withoutAlias = target.split('|')[0] ?? '';
	const cut = withoutAlias.indexOf('#');
	if (cut < 0) return { page: withoutAlias.trim(), heading: '' };
	return { page: withoutAlias.slice(0, cut).trim(), heading: withoutAlias.slice(cut + 1).trim() };
}

/**
 * The id a heading gets on the built page. Astro's rehypeHeadingIds, which Starlight
 * uses, slugs heading text with github-slugger, so a wikilink hash goes through the same
 * slug. A repeated heading gets a -1 suffix on the page; a link reaches the first one.
 * @param {string} heading
 */
export function wikiHeadingId(heading) {
	return headingSlug(heading);
}

/**
 * @param {string} target Raw wikilink target, without brackets. May include #heading and |alias.
 * @param {Map<string, string>} byKey
 */
export function resolveWikiTarget(target, byKey) {
	const { page, heading } = splitWikiTarget(target);
	const key = normalizeWikiName(page);
	const hash = heading ? wikiHeadingId(heading) : '';
	const href = key ? byKey.get(key) : undefined;
	if (!href) return { href: null, key, hash };
	return { href: hash ? `${href}#${hash}` : href, key, hash };
}

/**
 * Heading ids on a guide page, slugged the way Astro does it, for checking wikilink hashes.
 * Reads ATX headings outside code fences and strips inline Markdown first.
 * @param {string} text Page source.
 */
export function pageHeadingIds(text) {
	const slugger = new GithubSlugger();
	const ids = new Set(['_top']);
	let body = text;
	if (body.startsWith('---')) {
		const end = body.indexOf('\n---', 3);
		if (end >= 0) body = body.slice(end + 4);
	}
	body = body.replace(/```[\s\S]*?```/g, '');
	for (const match of body.matchAll(/^#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm)) {
		const plain = (match[1] ?? '')
			.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
			.replace(/\[\[([^\]]+)\]\]/g, '$1')
			.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
			.replace(/[`*_]/g, '');
		ids.add(slugger.slug(plain));
	}
	return ids;
}

/** @param {string} text @param {string} fallback */
function frontmatterTitle(text, fallback) {
	if (!text.startsWith('---')) return fallback;
	const end = text.indexOf('\n---', 3);
	if (end < 0) return fallback;
	const match = text.slice(0, end).match(/^title:\s*(.+)\s*$/m);
	if (!match) return fallback;
	let title = match[1].trim();
	if (
		(title.startsWith('"') && title.endsWith('"')) ||
		(title.startsWith("'") && title.endsWith("'"))
	) {
		title = title.slice(1, -1);
	}
	return title;
}

/**
 * @typedef {{
 *   external: boolean,
 *   exists: boolean,
 *   title: string,
 *   links: string[],
 *   backlinks: string[],
 * }} PageNode
 */

/**
 * Links and backlinks between guide pages, for the "Linked from" card.
 * starlight-site-graph builds its server-side backlinks from a Markdown scan that only
 * sees [text](url) links, so it misses every wikilink. Keys are slugs with a trailing
 * slash and no leading slash, like the plugin's.
 * @param {{ pages: WikiPage[], contentRoot: string, byKey: Map<string, string> }} wiki
 * @returns {Record<string, PageNode>}
 */
export function buildPageLinks(wiki) {
	const toKey = (href) => href.replace(/^\/+/, '');
	/** @type {Record<string, PageNode>} */
	const sitemap = {};
	for (const page of wiki.pages) {
		sitemap[toKey(page.href)] = { external: false, exists: true, title: page.title, links: [], backlinks: [] };
	}
	for (const page of wiki.pages) {
		const from = toKey(page.href);
		const text = fs.readFileSync(path.join(wiki.contentRoot, page.file), 'utf8');
		const body = stripFrontmatterAndCode(text);
		/** @type {Set<string>} */
		const targets = new Set();
		for (const match of body.matchAll(/\[\[([^\]]+)\]\]/g)) {
			const { href } = resolveWikiTarget(match[1] ?? '', wiki.byKey);
			if (href) targets.add(toKey(href.split('#')[0]));
		}
		for (const match of body.matchAll(/\]\((\/[^)\s#]*)/g)) {
			const key = toKey(match[1].endsWith('/') ? match[1] : `${match[1]}/`);
			if (sitemap[key]) targets.add(key);
		}
		targets.delete(from);
		for (const to of targets) {
			if (!sitemap[to]) continue;
			sitemap[from].links.push(to);
			sitemap[to].backlinks.push(from);
		}
	}
	return sitemap;
}

/** @param {string} text */
function stripFrontmatterAndCode(text) {
	let body = text;
	if (body.startsWith('---')) {
		const end = body.indexOf('\n---', 3);
		if (end >= 0) body = body.slice(end + 4);
	}
	return body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}
