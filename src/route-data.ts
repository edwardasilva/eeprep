import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { linkGroups, linkIndexPage } from './lib/link-index';

// The Sources page draws its category headings in a component, and
// Starlight only builds "On this page" from Markdown headings. Add one entry
// per category, with the same ids the component gives its headings.
export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;
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
