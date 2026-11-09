import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import wikiLinkPlugin from 'remark-wiki-link';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeCallouts from 'rehype-callouts';
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
	'/advice/getting-hired/authors-story/': '/about/',
	'/advice/about/': '/about/',
	'/advice/simple/': '/advice/resume/simple/',
	'/advice/ai-use/': '/help/ai-use/',
	'/help-links/': '/help/',
	'/help-links/ai-use/': '/help/ai-use/',
	'/help-links/all-links/': '/help/all-links/',
	'/help-links/contributing/': '/help/contributing/',
	'/help-links/sitemap/': '/help/sitemap/',
	'/reference/': '/help/',
	'/reference/job-links/': '/help/',
	'/reference/signals-and-dsp/': '/help/',
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
	vite: {
		plugins: [
			{
				// The site graph's client script imports micromatch 4, whose picomatch 2 reads
				// process.platform and process.version, and those throw in the browser.
				// picomatch 4's posix build has the same isMatch and no Node globals.
				// Swap it only for the browser build. On the server, picomatch/posix is
				// CommonJS and Vite's SSR runner can't evaluate it inline.
				name: 'eeprep:micromatch-browser',
				enforce: 'pre',
				applyToEnvironment: (env) => env.config.consumer === 'client',
				resolveId(id, importer, options) {
					if (id !== 'micromatch') return null;
					return this.resolve('picomatch/posix', importer, {
						...options,
						skipSelf: true,
					});
				},
			},
		],
		optimizeDeps: { include: ['picomatch/posix'] },
	},
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
				[
					rehypeCallouts,
					{
						theme: 'obsidian',
						callouts: {
							definition: { title: 'Definition' },
							question: { title: 'Check yourself' },
						},
					},
				],
			],
		}),
	},
	integrations: [
		starlight({
			title: 'EE Prep',
			description: 'A prep guide for electrical engineering students.',
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
						{
							label: 'Projects',
							items: [
								{ label: 'Projects', slug: 'advice/projects' },
								{ label: 'Software', slug: 'advice/projects/software' },
								{ label: 'Hardware', slug: 'advice/projects/hardware' },
							],
						},
						{
							label: 'Resume',
							items: [
								{ label: 'Resume', slug: 'advice/resume' },
								{ label: 'Simple', slug: 'advice/resume/simple' },
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
									label: 'How to interview',
									slug: 'advice/getting-hired/how-to-interview',
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
						{ label: 'Forever learning', slug: 'advice/forever-learning' },
					],
				},
				{
					label: 'Help',
					items: [
						{ label: 'Help', slug: 'help' },
						{ label: 'AI use', slug: 'help/ai-use' },
						{ label: 'Sources', slug: 'help/all-links' },
						{ label: 'Contributing', slug: 'help/contributing' },
						{ label: 'Sitemap', slug: 'help/sitemap' },
					],
				},
				{ label: 'About', slug: 'about' },
				{ label: 'Roadmap', slug: 'roadmap' },
			],
		}),
	],
});
