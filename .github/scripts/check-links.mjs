import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
	console.error('dist/ is missing. Run npm run build first.');
	process.exit(1);
}

const htmlFiles = listHtml(dist);
let failed = false;

for (const file of htmlFiles) {
	const html = fs.readFileSync(file, 'utf8');
	const rel = path.relative(dist, file);
	for (const href of hrefsIn(html)) {
		if (href.includes('/missing-wikilink/')) {
			console.error(`${rel}: broken wikilink href ${href}`);
			failed = true;
			continue;
		}
		const target = resolveLocal(href, rel);
		if (!target) continue;
		const dest = fileFor(target.pathname);
		if (!dest || !fs.existsSync(dest)) {
			console.error(`${rel}: missing ${href}`);
			failed = true;
			continue;
		}
		if (target.hash && !hasId(fs.readFileSync(dest, 'utf8'), target.hash)) {
			console.error(`${rel}: missing #${target.hash} in ${href}`);
			failed = true;
		}
	}
}

if (failed) process.exit(1);
console.log(`Checked links in ${htmlFiles.length} HTML files.`);

/** @param {string} dir @param {string[]} out */
function listHtml(dir, out = []) {
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) listHtml(full, out);
		else if (ent.name.endsWith('.html')) out.push(full);
	}
	return out;
}

/** @param {string} html */
function hrefsIn(html) {
	return [...html.matchAll(/\shref="([^"]+)"/g)].map((match) =>
		decode(match[1] ?? ''),
	);
}

/**
 * @param {string} href
 * @param {string} fromFile path relative to dist
 * @returns {{ pathname: string, hash: string } | null}
 */
function resolveLocal(href, fromFile) {
	if (href === '#') return null;
	if (href.startsWith('#')) {
		return { pathname: `/${fromFile}`, hash: href.slice(1) };
	}
	if (
		!href ||
		href.startsWith('mailto:') ||
		href.startsWith('javascript:') ||
		href.startsWith('data:')
	) {
		return null;
	}
	let pathname = href;
	if (/^[a-z]+:/i.test(href)) {
		let url;
		try {
			url = new URL(href);
		} catch {
			return null;
		}
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
		if (url.hostname !== 'eeprep.com') return null;
		pathname = `${url.pathname}${url.hash}`;
	}
	const hashAt = pathname.indexOf('#');
	const hash = hashAt >= 0 ? pathname.slice(hashAt + 1) : '';
	pathname =
		(hashAt >= 0 ? pathname.slice(0, hashAt) : pathname).split('?')[0] ?? '';
	if (!pathname) return { pathname: `/${path.posix.dirname(fromFile)}/`, hash };
	if (!pathname.startsWith('/')) {
		const dir = path.posix.dirname(fromFile);
		pathname = path.posix.normalize(path.posix.join('/', dir, pathname));
	}
	return { pathname, hash };
}

/** @param {string} pathname */
function fileFor(pathname) {
	const rel = decode(pathname).replace(/^\/+/, '');
	// Starlight emits the not-found page as dist/404.html, and links to /404/.
	if (rel === '404' || rel === '404/' || rel === '404.html')
		return path.join(dist, '404.html');
	if (rel === '' || rel.endsWith('/'))
		return path.join(dist, rel, 'index.html');
	const direct = path.join(dist, rel);
	if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
	return path.join(dist, rel, 'index.html');
}

/** @param {string} html @param {string} id */
function hasId(html, id) {
	const needle = `id="${id}"`;
	const needle2 = `id='${id}'`;
	return html.includes(needle) || html.includes(needle2);
}

/** @param {string} value */
function decode(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}
