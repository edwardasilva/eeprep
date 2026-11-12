import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { linkGroups, linkIndexPage } from './lib/link-index';
import { figureStarts } from './lib/figure-numbers';

// The Sources page draws its category headings in a component, and
// Starlight only builds "On this page" from Markdown headings. Add one entry
// per category, with the same ids the component gives its headings.
export const onRequest = defineRouteMiddleware(async (context) => {
	const route = context.locals.starlightRoute;
	// Figures are numbered through the whole site. Start this page's counter
	// after the figures on the pages before it in the sidebar.
	const start = (await figureStarts(route.sidebar)).get(
		new URL(context.url).pathname,
	);
	if (start) {
		route.head.push({
			tag: 'style',
			content: '.sl-markdown-content{counter-reset:eep-fig ' + start + '}',
		});
	}
	if (route.id !== linkIndexPage || !route.toc) return;
	route.toc.items.push(
		...linkGroups.map((group) => ({
			depth: 2,
			slug: group.id,
			text: group.name,
			children: [],
		})),
	);
});
