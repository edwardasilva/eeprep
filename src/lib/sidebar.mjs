// The sidebar, in reading order. astro.config.mjs passes it to Starlight, and
// src/pages/llms.txt.ts reads it so /llms.txt lists pages in the same order.
export const sidebar = [
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
						label: 'Startups',
						slug: 'advice/getting-hired/startups',
					},
					{
						label: 'Job market',
						slug: 'advice/getting-hired/job-market',
					},
					{
						label: 'Career paths',
						slug: 'advice/getting-hired/career-paths',
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
		],
	},
];
