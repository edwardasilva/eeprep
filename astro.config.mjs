import {
	existsSync,
	readFileSync,
	renameSync,
	rmdirSync,
	writeFileSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import wikiLinkPlugin from 'remark-wiki-link';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeEqIds from './src/plugins/rehype-eq-ids.mjs';
import rehypeExternalLinks from './src/plugins/rehype-external-links.mjs';
import rehypeTableLabels from './src/plugins/rehype-table-labels.mjs';
import remarkWikilinkLabels from './src/plugins/remark-wikilink-labels.mjs';
import {
	loadWikiIndex,
	normalizeWikiName,
	resolveWikiTarget,
	splitWikiTarget,
} from './src/lib/wiki-index.mjs';

const wiki = loadWikiIndex();

// The 404 page is a docs page (src/content/docs/404.md), so Astro writes it to
// dist/404/index.html. Cloudflare's not_found_handling "404-page" looks for
// dist/404.html, so move it there after the build.
const flatNotFoundPage = {
	name: 'flat-404-page',
	hooks: {
		'astro:build:done': ({ dir }) => {
			const from = fileURLToPath(new URL('404/index.html', dir));
			const to = fileURLToPath(new URL('404.html', dir));
			if (!existsSync(from)) return;
			renameSync(from, to);
			rmdirSync(fileURLToPath(new URL('404/', dir)));
		},
	},
};

// Old URLs: moved pages go to their new address, removed pages to the closest
// page that is left.
const redirects = {
	'/get-hired/': '/advice/resume/',
	'/get-hired/resume/': '/advice/resume/',
	'/get-hired/resume-workshop/': '/advice/resume/workshop/',
	'/get-hired/first-internship/': '/advice/getting-hired/first-internship/',
	'/get-hired/the-job-market/': '/help/',
	'/succeed-in-school/': '/',
	'/succeed-in-school/how-to-study/': '/',
	'/advice/resume-workshop/': '/advice/resume/workshop/',
	'/advice/first-internship/': '/advice/getting-hired/first-internship/',
	'/advice/hardware-experience/': '/advice/projects/hardware/',
	'/advice/how-to-interview/': '/advice/getting-hired/how-to-interview/',
	'/advice/getting-hired/authors-story/': '/advice/authors-story/',
	'/advice/about/': '/advice/authors-story/',
	'/about/': '/advice/authors-story/',
	'/advice/simple/': '/advice/resume/quick-setup/',
	'/advice/resume/simple/': '/advice/resume/quick-setup/',
	'/advice/resume/portfolio/': '/advice/projects/portfolio/',
	'/advice/ai-use/': '/help/ai-use/',
	'/advice/non-technical/': '/advice/getting-hired/non-technical/',
	'/help-links/': '/help/',
	'/help-links/all-links/': '/help/all-links/',
	'/help-links/contributing/': '/roadmap/contributing/',
	'/help/contributing/': '/roadmap/contributing/',
	'/help-links/sitemap/': '/sitemap/',
	'/help/sitemap/': '/sitemap/',
	'/reference/': '/help/',
	'/reference/job-links/': '/help/',
	'/reference/signals-and-dsp/': '/help/',
};

// Astro builds each redirect as a 200 page with a meta refresh. Cloudflare
// reads dist/_redirects and answers with a real 301 before it serves that page.
// Both slash forms get a rule, because a rule matches the literal path.
// Write the file from the list above so the two cannot drift apart.
const permanentRedirects = {
	name: 'permanent-redirects',
	hooks: {
		'astro:build:done': ({ dir }) => {
			const lines = Object.entries(redirects).flatMap(([from, to]) => [
				`${from} ${to} 301`,
				`${from.replace(/\/$/, '')} ${to} 301`,
			]);
			writeFileSync(
				fileURLToPath(new URL('_redirects', dir)),
				`${lines.join('\n')}\n`,
			);
		},
	},
};
const lightCodeTheme = JSON.parse(
	readFileSync(
		new URL('./src/styles/ec-eeprep-light.json', import.meta.url),
		'utf8',
	),
);
const darkCodeTheme = JSON.parse(
	readFileSync(
		new URL('./src/styles/ec-eeprep-dark.json', import.meta.url),
		'utf8',
	),
);

export default defineConfig({
	site: 'https://eeprep.com',
	redirects,
	trailingSlash: 'always',
	markdown: {
		processor: unified({
			gfm: true,
			smartypants: false,
			remarkPlugins: [
				[
					wikiLinkPlugin,
					{
						aliasDivider: '|',
						// remark-wiki-link only calls permalinks.indexOf() to decide whether a link
						// exists. A permalink here is "page" or "page#heading", and it exists when the
						// page part does, so the #heading survives to hrefTemplate.
						permalinks: {
							indexOf: (permalink) =>
								wiki.byKey.has(permalink.split('#')[0] ?? '') ? 0 : -1,
						},
						pageResolver(name) {
							const { page, heading } = splitWikiTarget(name);
							const key = normalizeWikiName(page);
							return [heading ? `${key}#${heading}` : key];
						},
						hrefTemplate(permalink) {
							const { href } = resolveWikiTarget(permalink, wiki.byKey);
							return (
								href ?? `/missing-wikilink/${encodeURIComponent(permalink)}/`
							);
						},
						wikiLinkClassName: 'wikilink',
						newClassName: 'wikilink-missing',
					},
				],
				[remarkWikilinkLabels, { wiki }],
				remarkMath,
			],
			rehypePlugins: [
				rehypeKatex,
				rehypeEqIds,
				rehypeExternalLinks,
				[
					rehypeTableLabels,
					{ files: ['src/content/docs/roadmap.md'], className: 'eep-roadmap' },
				],
			],
		}),
	},
	integrations: [
		starlight({
			disable404Route: true,
			title: 'eeprep',
			lastUpdated: true,
			description:
				'A guide to job searching for electrical engineers & computer scientists.',
			credits: false,
			routeMiddleware: './src/route-data.ts',
			favicon: '/favicon.svg',
			customCss: [
				'./src/styles/fonts.css',
				'./src/styles/theme.css',
				'./src/styles/site.css',
				'katex/dist/katex.min.css',
			],
			head: [
				// The dev site must never be indexed. Production builds leave SITE_ENV unset.
				...(process.env.SITE_ENV === 'dev'
					? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } }]
					: []),
				// Starlight replaces its own viewport tag with this one.
				{
					tag: 'meta',
					attrs: {
						name: 'viewport',
						content: 'width=device-width, initial-scale=1, viewport-fit=cover',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#fbfbfc',
						media: '(prefers-color-scheme: light)',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#0d1524',
						media: '(prefers-color-scheme: dark)',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon-32.png',
						type: 'image/png',
						sizes: '32x32',
						media: '(prefers-color-scheme: light)',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon-32-dark.png',
						type: 'image/png',
						sizes: '32x32',
						media: '(prefers-color-scheme: dark)',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon-16.png',
						type: 'image/png',
						sizes: '16x16',
						media: '(prefers-color-scheme: light)',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon-16-dark.png',
						type: 'image/png',
						sizes: '16x16',
						media: '(prefers-color-scheme: dark)',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'apple-touch-icon',
						href: '/apple-touch-icon-180.png',
						sizes: '180x180',
					},
				},
			],
			components: {
				Head: './src/components/Head.astro',
				Footer: './src/components/Footer.astro',
				Header: './src/components/Header.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
				PageTitle: './src/components/PageTitle.astro',
				PageFrame: './src/components/PageFrame.astro',
				PageSidebar: './src/components/PageSidebar.astro',
				Sidebar: './src/components/Sidebar.astro',
				SiteTitle: './src/components/SiteTitle.astro',
			},
			// First dark theme, then first light theme. Starlight maps those to the site theme.
			expressiveCode: {
				themes: [darkCodeTheme, lightCodeTheme],
				useStarlightDarkModeSwitch: true,
				// Keep exact palette colors; no automatic contrast shifts.
				minSyntaxHighlightingColorContrast: 0,
				// Shell snippets get the plain code frame, not a fake terminal window.
				defaultProps: { frame: 'code' },
				styleOverrides: {
					// Expressive Code adds the border width, so the outer radius matches figures.
					borderRadius: 'calc(var(--eep-radius) - 1px)',
					borderColor: 'var(--eep-silver)',
					borderWidth: '1px',
					codeBackground: 'var(--eep-sunken)',
					codeForeground: 'var(--eep-ink)',
					codeFontFamily: 'var(--eep-font-mono)',
					codeFontSize: '0.875rem',
					codeLineHeight: '1.75',
					codePaddingBlock: '1.125rem',
					codePaddingInline: '1.375rem',
					uiFontFamily: 'var(--eep-font-serif)',
					uiFontSize: '0.8125rem',
					uiFontWeight: '400',
					frames: {
						shadowColor: 'transparent',
						frameBoxShadowCssValue: 'none',
						editorBackground: 'var(--eep-sunken)',
						editorTabBarBackground: 'var(--eep-sunken)',
						editorTabBarBorderColor: 'transparent',
						editorTabBarBorderBottomColor: 'var(--eep-silver)',
						editorActiveTabBackground: 'var(--eep-sunken)',
						editorActiveTabForeground: 'var(--eep-ink-2)',
						editorActiveTabBorderColor: 'transparent',
						editorActiveTabIndicatorTopColor: 'transparent',
						editorActiveTabIndicatorBottomColor: 'transparent',
						terminalBackground: 'var(--eep-sunken)',
						terminalTitlebarBackground: 'var(--eep-sunken)',
						terminalTitlebarForeground: 'var(--eep-ink-2)',
						terminalTitlebarBorderBottomColor: 'var(--eep-silver)',
						terminalTitlebarDotsOpacity: '0',
						inlineButtonBackground: 'transparent',
						inlineButtonBorder: 'transparent',
						inlineButtonForeground: 'var(--eep-ink-2)',
						tooltipSuccessBackground: 'var(--eep-ink)',
						tooltipSuccessForeground: 'var(--eep-paper)',
					},
				},
			},
			sidebar: [
				{
					label: 'Advice',
					items: [
						{ label: 'Advice', slug: 'advice' },
						{ label: 'Quick setup', slug: 'advice/resume/quick-setup' },
						{
							label: 'Projects',
							items: [
								{ label: 'Projects', slug: 'advice/projects' },
								{ label: 'Software', slug: 'advice/projects/software' },
								{ label: 'Hardware', slug: 'advice/projects/hardware' },
								{ label: 'Career paths', slug: 'advice/projects/career-paths' },
								{ label: 'Portfolio', slug: 'advice/projects/portfolio' },
							],
						},
						{
							label: 'Resume',
							items: [
								{ label: 'Resume', slug: 'advice/resume' },
								{ label: 'Walkthrough', slug: 'advice/resume/walkthrough' },
								{ label: 'Cleanup', slug: 'advice/resume/cleanup' },
								{ label: 'Workshop', slug: 'advice/resume/workshop' },
							],
						},
						{
							label: 'Getting hired',
							items: [
								{ label: 'Getting hired', slug: 'advice/getting-hired' },
								{
									label: 'Networking',
									slug: 'advice/getting-hired/networking',
								},
								{
									label: 'Job market',
									slug: 'advice/getting-hired/job-market',
								},
								{
									label: 'How to interview',
									slug: 'advice/getting-hired/how-to-interview',
								},
								{
									label: 'Non-technical skills',
									slug: 'advice/getting-hired/non-technical',
								},
								{
									label: 'First internship',
									slug: 'advice/getting-hired/first-internship',
								},
								{
									label: 'First full-time role',
									slug: 'advice/getting-hired/first-full-time-role',
								},
							],
						},
						{
							label: 'Forever learning',
							items: [
								{ label: 'Forever learning', slug: 'advice/forever-learning' },
								{
									label: 'Getting into graduate study',
									slug: 'advice/forever-learning/getting-into-graduate-study',
								},
								{
									label: 'Graduate study',
									slug: 'advice/forever-learning/graduate-study',
								},
								{
									label: 'Professional societies',
									slug: 'advice/forever-learning/societies',
								},
							],
						},
						{ label: "Author's story", slug: 'advice/authors-story' },
					],
				},
				{
					// The Help sub-pages are in alphabetical order.
					label: 'Help',
					items: [
						{ label: 'Help', slug: 'help' },
						{ label: 'AI use', slug: 'help/ai-use' },
						{ label: 'Company list', slug: 'help/company-list' },
						{ label: 'Job boards', slug: 'help/job-boards' },
						{ label: 'Resources', slug: 'help/resources' },
						{ label: 'Sources', slug: 'help/all-links' },
					],
				},
				{
					label: 'Roadmap',
					items: [
						{ label: 'Roadmap', slug: 'roadmap' },
						{ label: 'Contributing', slug: 'roadmap/contributing' },
					],
				},
				{
					label: 'Sitemap',
					items: [
						{ label: 'Sitemap', slug: 'sitemap' },
						{ label: 'Table of contents', slug: 'sitemap/contents' },
						{ label: 'Table of figures', slug: 'sitemap/figures' },
						{ label: 'Table of tables', slug: 'sitemap/tables' },
					],
				},
			],
		}),
		flatNotFoundPage,
		permanentRedirects,
	],
});
