// Loads every built page at phone widths in both themes against `astro preview`
// and fails on horizontal scroll, overlapping header controls, small tap
// targets, and figure problems. It also checks that the header and its
// controls sit at the same pixels on every page, at phone and desktop widths,
// and that text in figures renders at 12px or more. Before loading pages it
// fails if any built page or stylesheet has an emoji or an icon-style symbol.
// Run `npm run build` first.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { chromium } from 'playwright';

/* global window, document, getComputedStyle, NodeFilter */

const widths = [375, 390];
const desktopWidths = [1280, 1440];
const themes = ['light', 'dark'];
const minTap = 44;
const minLabelPx = 11;
const minFigurePx = 12;
// Smallest source font size, in viewBox units, of each SVG figure. The SVGs
// draw text as outlines, so the size can't be read from the file. The
// path-map sizes are measured from the drawing.
const svgMinFont = {
	'path-map': 10,
	'path-map-mobile': 10,
};
// HTML figures still waiting for their own fix. Listed, like the SVG
// figures, but they don't fail yet.
const knownSmall = new Set(['fig-3']);
// Figures below the minimum that are listed but don't fail yet.
const smallFigures = new Map();
const dist = path.resolve('dist');

if (!fs.existsSync(dist)) {
	console.error('dist/ is missing. Run npm run build first.');
	process.exit(1);
}

const pages = listPages(dist);
// Set PREVIEW_URL to audit a preview server that is already running.
const external = process.env.PREVIEW_URL?.replace(/\/$/, '');
const port = external ? 0 : await freePort();
const preview = external
	? null
	: spawn(
			process.execPath,
			[
				path.resolve('node_modules/astro/bin/astro.mjs'),
				'preview',
				'--port',
				String(port),
			],
			{ stdio: 'ignore' },
		);
const base = external ?? `http://localhost:${port}`;
const problems = emojiProblems(dist);
let browser;
let desktop;

try {
	await waitForServer(base);
	browser = await chromium.launch();
	for (const theme of themes) {
		for (const width of widths) {
			const context = await browser.newContext({
				viewport: { width, height: 812 },
				deviceScaleFactor: 1,
				hasTouch: true,
				isMobile: true,
			});
			await context.addInitScript((t) => {
				localStorage.setItem('starlight-theme', t);
			}, theme);
			const page = await context.newPage();
			const checkHeader = headerCheck(`@${width}px ${theme}`);
			for (const route of pages) {
				await page.goto(base + route, { waitUntil: 'load' });
				const found = await page.evaluate(auditPage, { minTap, minLabelPx });
				for (const message of found)
					problems.push(`${route} @${width}px ${theme}: ${message}`);
				checkHeader(route, await page.evaluate(headerBoxes));
				await checkFigureText(route, `@${width}px ${theme}`, page);
			}
			await context.close();
		}
	}
	// Desktop: show real scrollbars, so a page that scrolls and one that
	// doesn't are compared the way a reader sees them.
	desktop = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
	for (const width of desktopWidths) {
		const context = await desktop.newContext({
			viewport: { width, height: 800 },
			deviceScaleFactor: 1,
		});
		const page = await context.newPage();
		const checkHeader = headerCheck(`@${width}px desktop`);
		for (const route of pages) {
			await page.goto(base + route, { waitUntil: 'load' });
			checkHeader(route, await page.evaluate(headerBoxes));
			await checkFigureText(route, `@${width}px desktop`, page);
		}
		await context.close();
	}
} finally {
	await browser?.close();
	await desktop?.close();
	preview?.kill();
}

for (const [fig, px] of smallFigures)
	console.log(`Note: the smallest text in ${fig} renders at about ${px}px.`);
for (const problem of problems) console.error(problem);
const checks = pages.length * widths.length * themes.length;
if (problems.length) {
	console.error(`${problems.length} mobile problems in ${checks} page loads.`);
	process.exit(1);
}
console.log(
	`Mobile audit passed: ${pages.length} pages x ${widths.length} widths x ${themes.length} themes (${checks} page loads).`,
);

/**
 * Runs in the page. Returns one message per problem.
 * @param {{ minTap: number, minLabelPx: number }} limits
 */
function auditPage({ minTap, minLabelPx }) {
	const out = [];
	const vw = window.innerWidth;
	const label = (el) => {
		const text = (el.getAttribute('aria-label') || el.textContent || '')
			.trim()
			.replace(/\s+/g, ' ')
			.slice(0, 30);
		const cls =
			typeof el.className === 'string' ? el.className.split(' ')[0] : '';
		return `<${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}> "${text}"`;
	};
	const shown = (el) => {
		if (!el) return false;
		const r = el.getBoundingClientRect();
		const cs = getComputedStyle(el);
		return (
			r.width > 0 &&
			r.height > 0 &&
			cs.visibility !== 'hidden' &&
			cs.display !== 'none'
		);
	};

	if (document.documentElement.scrollWidth > vw)
		out.push(
			`horizontal scroll (${document.documentElement.scrollWidth}px wide)`,
		);

	// Header controls, the mobile table-of-contents button, the hero, and the
	// first paragraph. None of these may overlap each other.
	const header = document.querySelector('header.header');
	const controls = [
		...document.querySelectorAll(
			'header .site-title, header .eep-nav a, header button, starlight-menu-button button',
		),
	].filter(shown);
	const tocButton = document.querySelector('mobile-starlight-toc summary');
	const blocks = [
		tocButton,
		...document.querySelectorAll('.eep-hero > *'),
		document.querySelector('.sl-markdown-content > p'),
		document.querySelector('h1#_top'),
	].filter(shown);
	const boxes = [...controls, ...blocks];
	for (let i = 0; i < boxes.length; i++) {
		for (let j = i + 1; j < boxes.length; j++) {
			const a = boxes[i];
			const b = boxes[j];
			if (a.contains(b) || b.contains(a)) continue;
			const ra = a.getBoundingClientRect();
			const rb = b.getBoundingClientRect();
			const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
			const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
			if (w > 1 && h > 1) out.push(`${label(a)} overlaps ${label(b)}`);
		}
	}

	// Header controls stay inside the header box and are big enough to tap.
	const hr = header?.getBoundingClientRect();
	for (const el of controls) {
		const r = el.getBoundingClientRect();
		if (hr && (r.bottom > hr.bottom + 1 || r.top < hr.top - 1))
			out.push(`${label(el)} spills out of the header`);
		if (r.width < minTap - 0.5 || r.height < minTap - 0.5)
			out.push(
				`${label(el)} tap target is ${Math.round(r.width)}x${Math.round(r.height)}px`,
			);
	}

	// Figures.
	for (const el of document.querySelectorAll(
		'.sl-markdown-content :is(img, picture, svg[role="img"])',
	)) {
		if (!shown(el)) continue;
		const r = el.getBoundingClientRect();
		const box = el.parentElement.getBoundingClientRect();
		if (r.width > box.width + 1)
			out.push(
				`${label(el)} is ${Math.round(r.width)}px wide in a ${Math.round(box.width)}px box`,
			);
		if (r.right > vw + 1) out.push(`${label(el)} runs off the screen`);
		if (el.tagName === 'IMG') {
			if (!el.hasAttribute('width') || !el.hasAttribute('height'))
				out.push(`${el.getAttribute('src')} has no width and height`);
			if (r.top > window.innerHeight && el.getAttribute('loading') !== 'lazy')
				out.push(
					`${el.getAttribute('src')} is below the fold without loading="lazy"`,
				);
		}
		if (el.tagName.toLowerCase() === 'svg') {
			for (const text of el.querySelectorAll('text')) {
				const ctm = text.getScreenCTM();
				const size =
					parseFloat(getComputedStyle(text).fontSize) *
					(ctm ? Math.hypot(ctm.a, ctm.b) : 1);
				if (size && size < minLabelPx) {
					out.push(`${label(text)} renders at ${size.toFixed(1)}px`);
					break;
				}
			}
		}
	}
	return out;
}

/** @param {string} dir @param {string} [prefix] */
// Records the header boxes of the first page and reports any page where one
// of them is somewhere else.
// Text in an HTML figure must render at minFigurePx or more. For SVG figures
// the size is estimated as source size times rendered width over viewBox
// width, and only listed for now.
async function checkFigureText(route, label, page) {
	const { html, svg } = await page.evaluate(figureText, svgMinFont);
	const note = (fig, px) => {
		const key = `${route}#${fig}`;
		smallFigures.set(key, Math.min(px, smallFigures.get(key) ?? Infinity));
	};
	for (const { fig, px, text } of html) {
		if (px >= minFigurePx) continue;
		if (knownSmall.has(fig)) note(fig, px);
		else
			problems.push(
				`${route} ${label}: ${fig} text "${text}" renders at ${px}px, under ${minFigurePx}px`,
			);
	}
	for (const { fig, px } of svg) if (px < minFigurePx) note(fig, px);
}

// Runs in the page. Smallest rendered text in each figure.
function figureText(sources) {
	const round = (n) => Math.round(n * 10) / 10;
	const html = [];
	const svg = [];
	for (const fig of document.querySelectorAll('figure')) {
		const name = fig.id || 'figure';
		const walker = document.createTreeWalker(fig, NodeFilter.SHOW_TEXT);
		let min = null;
		while (walker.nextNode()) {
			const node = walker.currentNode;
			const el = node.parentElement;
			if (!node.textContent.trim() || !el || el.closest('svg')) continue;
			if (!el.getClientRects().length) continue;
			const px = parseFloat(getComputedStyle(el).fontSize);
			if (!min || px < min.px)
				min = { fig: name, px: round(px), text: node.textContent.trim() };
		}
		if (min) html.push(min);
		for (const img of fig.querySelectorAll('img')) {
			if (!img.getClientRects().length) continue;
			const file = (img.getAttribute('src') ?? '').split('/').pop() ?? '';
			const key = file
				.replace(/(\.[\w-]{6,})?\.svg$/, '')
				.replace(/-dark$/, '');
			const source = sources[key];
			const width = Number(img.getAttribute('width'));
			if (!source || !width) continue;
			const px = (source * img.getBoundingClientRect().width) / width;
			svg.push({ fig: `${name} (${key}.svg)`, px: round(px) });
		}
	}
	return { html, svg };
}

function headerCheck(label) {
	let first = null;
	return (route, boxes) => {
		if (!first) {
			first = { route, boxes };
			return;
		}
		for (const [name, box] of Object.entries(boxes)) {
			const want = first.boxes[name];
			if (want !== box)
				problems.push(
					`${route} ${label}: header ${name} is at ${box}, but ${want} on ${first.route}`,
				);
		}
	};
}

// Runs in the page. Position and size of the header and each control in it.
function headerBoxes() {
	const round = (n) => Math.round(n * 10) / 10;
	const box = (el) => {
		if (!el) return 'missing';
		const r = el.getBoundingClientRect();
		return [r.x, r.y, r.width, r.height].map(round).join(',');
	};
	const out = {
		header: box(document.querySelector('header.header')),
		title: box(document.querySelector('header .site-title')),
		search: box(document.querySelector('header button[data-open-modal]')),
		theme: box(document.querySelector('header .eep-theme')),
	};
	document
		.querySelectorAll('header .eep-nav a')
		.forEach((a, i) => (out[`nav ${i + 1}`] = box(a)));
	return out;
}

// Emoji, dingbats such as check marks, arrows, stars and the emoji variation
// selector. Some platforms draw these as color emoji, so icons are SVG instead.
// CSS escapes such as \2197 count too.
function emojiProblems(dir) {
	const ranges = [
		[0x2190, 0x21ff],
		[0x231a, 0x231b],
		[0x23e9, 0x23fa],
		[0x2600, 0x27bf],
		[0x2b00, 0x2bff],
		[0xfe0f, 0xfe0f],
		[0x1f000, 0x1faff],
	];
	const isEmoji = (cp) => ranges.some(([lo, hi]) => cp >= lo && cp <= hi);
	const out = [];
	const walk = (d) => {
		for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
			const file = path.join(d, ent.name);
			if (ent.isDirectory()) {
				if (ent.name !== 'pagefind') walk(file);
				continue;
			}
			if (!/\.(html|css)$/.test(ent.name)) continue;
			const text = fs.readFileSync(file, 'utf8');
			const escapes = [...text.matchAll(/\\([0-9a-f]{4,6})(?![0-9a-f])/gi)];
			const cps = [
				...[...text].map((c) => c.codePointAt(0)),
				...escapes.map((m) => parseInt(m[1], 16)),
			];
			for (const cp of new Set(cps.filter(isEmoji))) {
				const hex = cp.toString(16).toUpperCase().padStart(4, '0');
				out.push(`${path.relative(dir, file)}: emoji or symbol U+${hex}`);
			}
		}
	};
	walk(dir);
	return out;
}

function listPages(dir, prefix = '/') {
	const routes = [];
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		if (ent.isDirectory()) {
			if (['_astro', 'pagefind'].includes(ent.name)) continue;
			routes.push(
				...listPages(path.join(dir, ent.name), `${prefix}${ent.name}/`),
			);
		} else if (ent.name === 'index.html') {
			const html = fs.readFileSync(path.join(dir, ent.name), 'utf8');
			// Redirect stubs for removed pages have no layout to audit.
			if (!/http-equiv="refresh"/i.test(html)) routes.push(prefix);
		}
	}
	return routes.sort();
}

function freePort() {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		server.once('error', reject);
		server.listen(0, () => {
			const { port } = /** @type {net.AddressInfo} */ (server.address());
			server.close(() => resolve(port));
		});
	});
}

/** @param {string} url */
async function waitForServer(url) {
	const deadline = Date.now() + 60_000;
	while (Date.now() < deadline) {
		try {
			const res = await fetch(`${url}/`);
			if (res.ok) return;
		} catch {
			// Not up yet.
		}
		await new Promise((r) => setTimeout(r, 250));
	}
	throw new Error(`astro preview did not start at ${url}`);
}
