import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import wikiLinkPlugin from 'remark-wiki-link';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeCallouts from 'rehype-callouts';
import starlightSiteGraph from 'starlight-site-graph';
import rehypeEqIds from './src/plugins/rehype-eq-ids.mjs';
import { loadWikiIndex, normalizeWikiName, resolveWikiTarget, splitWikiTarget } from './src/lib/wiki-index.mjs';

const wiki = loadWikiIndex();

export default defineConfig({
	site: 'https://eeprep.com',
	trailingSlash: 'always',
	vite: {
		resolve: {
			// The site graph's client script imports micromatch 4, whose picomatch 2 reads
			// process.platform and process.version, and those throw in the browser.
			// picomatch 4's posix build has the same isMatch and no Node globals.
			alias: [{ find: /^micromatch$/, replacement: 'picomatch/posix' }],
		},
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
							indexOf: (permalink) => (wiki.byKey.has(permalink.split('#')[0] ?? '') ? 0 : -1),
						},
						pageResolver(name) {
							const { page, heading } = splitWikiTarget(name);
							const key = normalizeWikiName(page);
							return [heading ? `${key}#${heading}` : key];
						},
						hrefTemplate(permalink) {
							const { href } = resolveWikiTarget(permalink, wiki.byKey);
							return href ?? `/missing-wikilink/${encodeURIComponent(permalink)}/`;
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
			customCss: [
				'./src/styles/fonts.css',
				'./src/styles/theme.css',
				'./src/styles/site.css',
				'katex/dist/katex.min.css',
			],
			head: [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }],
			components: {
				Head: './src/components/Head.astro',
				Header: './src/components/Header.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
				PageTitle: './src/components/PageTitle.astro',
				PageSidebar: './src/components/PageSidebar.astro',
			},
			sidebar: [
				{
					label: 'Get hired',
					items: [
						{ label: 'Get hired', slug: 'get-hired' },
						{ label: 'Your first internship', slug: 'get-hired/first-internship' },
						{ label: 'Resume', slug: 'get-hired/resume' },
						{ label: 'The job market', slug: 'get-hired/the-job-market' },
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
						{ label: 'Sample page', slug: 'reference/sample-page' },
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
