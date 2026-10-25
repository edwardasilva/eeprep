import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import wikiLinkPlugin from 'remark-wiki-link';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeCallouts from 'rehype-callouts';
import starlightSiteGraph from 'starlight-site-graph';
import rehypeEqIds from './src/plugins/rehype-eq-ids.mjs';
import { loadWikiIndex } from './src/lib/wiki-index.mjs';

const wiki = loadWikiIndex();

export default defineConfig({
	site: 'https://eeprep.com',
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
						permalinks: [...wiki.byKey.keys()],
						pageResolver(name) {
							const page = name.split('#')[0]?.split('|')[0] ?? name;
							return [page.trim().toLowerCase()];
						},
						hrefTemplate(permalink) {
							return wiki.byKey.get(permalink) ?? `/missing-wikilink/${encodeURIComponent(permalink)}/`;
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
