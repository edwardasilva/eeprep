import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import wikiLinkPlugin from 'remark-wiki-link';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeCallouts from 'rehype-callouts';
import starlightSiteGraph from 'starlight-site-graph';
import rehypeEqIds from './src/plugins/rehype-eq-ids.mjs';
import {
	loadWikiIndex,
	normalizeWikiName,
	resolveWikiTarget,
	splitWikiTarget,
} from './src/lib/wiki-index.mjs';

const wiki = loadWikiIndex();
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
				remarkMath,
			],
			rehypePlugins: [
				rehypeKatex,
				rehypeEqIds,
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
			favicon: '/favicon.svg',
			logo: {
				light: './public/brand/eeprep-lockup-outlined.svg',
				dark: './public/brand/eeprep-lockup-dark-outlined.svg',
				replacesTitle: true,
			},
			customCss: [
				'./src/styles/fonts.css',
				'./src/styles/theme.css',
				'./src/styles/site.css',
				'katex/dist/katex.min.css',
			],
			head: [
				{
					tag: 'meta',
					attrs: { name: 'robots', content: 'noindex, nofollow' },
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
				Header: './src/components/Header.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
				PageTitle: './src/components/PageTitle.astro',
				PageSidebar: './src/components/PageSidebar.astro',
			},
			// First dark theme, then first light theme. Starlight maps those to the site theme.
			expressiveCode: {
				themes: [darkCodeTheme, lightCodeTheme],
				useStarlightDarkModeSwitch: true,
				styleOverrides: {
					borderRadius: '4px',
					borderColor: 'var(--eep-rule)',
					borderWidth: '1px',
					codeFontFamily: 'var(--eep-font-mono)',
					codeFontSize: '0.875rem',
					codeLineHeight: '1.75',
					codePaddingBlock: '1.125rem',
					codePaddingInline: '1.375rem',
					uiFontFamily: 'var(--eep-font-mono)',
					uiFontSize: '0.71875rem',
					frames: {
						shadowColor: 'transparent',
						editorTabBarBackground: 'var(--eep-sunken)',
						editorActiveTabBackground: 'var(--eep-sunken)',
						editorActiveTabIndicatorTopColor: 'transparent',
						editorActiveTabIndicatorBottomColor: 'var(--eep-accent)',
						editorTabBarBorderBottomColor: 'var(--eep-rule)',
						terminalTitlebarBackground: 'var(--eep-sunken)',
						terminalBackground: 'var(--eep-sunken)',
						frameBoxShadowCssValue: 'none',
					},
				},
			},
			sidebar: [
				{
					label: 'Get hired',
					items: [
						{ label: 'Get hired', slug: 'get-hired' },
						{ label: 'Resume', slug: 'get-hired/resume' },
						{ label: 'The job market', slug: 'get-hired/the-job-market' },
						{
							label: 'Your first internship',
							slug: 'get-hired/first-internship',
						},
					],
				},
				{
					label: 'Succeed in school',
					items: [
						{ label: 'Succeed in school', slug: 'succeed-in-school' },
						{ label: 'How to study', slug: 'succeed-in-school/how-to-study' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Reference', slug: 'reference' },
						{ label: 'Signals and DSP', slug: 'reference/signals-and-dsp' },
					],
				},
			],
			plugins: [
				starlightSiteGraph({
					overridePageSidebar: false,
					trackVisitedPages: 'disable',
					graphConfig: {
						labelFontSize: 11,
					},
				}),
			],
		}),
	],
});
