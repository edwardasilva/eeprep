// Loads every built page at phone widths in both themes against `astro preview`
// and fails on horizontal scroll, overlapping header controls, small tap
// targets, and figure problems. Run `npm run build` first.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { chromium } from 'playwright';

/* global window, document, getComputedStyle */

const widths = [375, 390];
const themes = ['light', 'dark'];
const minTap = 44;
const minLabelPx = 11;
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
const problems = [];
let browser;

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
			for (const route of pages) {
				await page.goto(base + route, { waitUntil: 'load' });
				const found = await page.evaluate(auditPage, { minTap, minLabelPx });
				for (const message of found)
					problems.push(`${route} @${width}px ${theme}: ${message}`);
			}
			await context.close();
		}
	}
} finally {
	await browser?.close();
	preview?.kill();
}

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
