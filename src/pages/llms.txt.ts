// Builds /llms.txt, the plain-text page index that AI tools read to find a
// site's pages (https://llmstxt.org). It lists every guide page in sidebar
// order, one section per sidebar group, so a new page shows up on the next
// build. A page outside the sidebar goes under "Other".
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { homeDescription } from '../lib/home';
import { sidebar } from '../lib/sidebar.mjs';

type Item = { slug?: string; items?: Item[] };

const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Every slug under a sidebar item, in order. */
const slugsOf = (item: Item): string[] => [
	...(item.slug ? [item.slug] : []),
	...(item.items ?? []).flatMap(slugsOf),
];

export const GET: APIRoute = async ({ site }) => {
	const base = site ?? new URL('https://eeprep.com');
	const pages = new Map(
		(await getCollection('docs'))
			.filter((page) => page.id !== '404')
			.map((page) => [page.id, page]),
	);

	const groups = (sidebar as (Item & { label: string })[]).map((group) => ({
		label: group.label,
		ids: slugsOf(group).filter((id) => pages.has(id)),
	}));
	const listed = new Set(groups.flatMap((group) => group.ids));
	const other = [...pages.keys()].filter((id) => !listed.has(id)).sort();
	if (other.length > 0) groups.push({ label: 'Other', ids: other });

	const line = (id: string) => {
		const { title, description } = pages.get(id)!.data;
		const url = new URL(`/${id}/`, base).href;
		return description
			? `- [${title}](${url}): ${oneLine(description)}`
			: `- [${title}](${url})`;
	};

	const lines = [
		'# eeprep',
		'',
		`> ${oneLine(homeDescription)}`,
		'',
		'Every claim on the site cites a public source. Guide text is licensed CC BY 4.0, and code is MIT.',
		'',
		...groups
			.filter((group) => group.ids.length > 0)
			.flatMap((group) => [
				`## ${group.label}`,
				'',
				...group.ids.map(line),
				'',
			]),
		'## Tools',
		'',
		`- [eeprep resume skill](${new URL('/skills/eeprep-resume/SKILL.md', base).href}): An agent skill that writes, reviews, and tailors a one-page engineering resume to the rules on this site.`,
		'- [resume-generator](https://github.com/edwardasilva/resume-generator): Turns one JSON file into a one-page PDF resume.',
		'- [company-lists](https://github.com/edwardasilva/company-lists): Companies by region, each with a public source, for students looking for employers near them.',
		'- [Source code](https://github.com/edwardasilva/eeprep): The repository that builds eeprep.com.',
		'',
	];

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
