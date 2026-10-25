import fs from 'node:fs';
import path from 'node:path';

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
 * @param {string} target Raw wikilink target, without brackets. May include #heading and |alias.
 * @param {Map<string, string>} byKey
 */
export function resolveWikiTarget(target, byKey) {
	const withoutAlias = target.split('|')[0] ?? '';
	const [page, hash] = withoutAlias.split('#');
	const key = normalizeWikiName(page ?? '');
	const href = key ? byKey.get(key) : undefined;
	if (!href) return { href: null, key, hash: hash ?? '' };
	return { href: hash ? `${href}#${hash}` : href, key, hash: hash ?? '' };
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
