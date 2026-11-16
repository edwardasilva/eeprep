import { normalizeWikiName, splitWikiTarget } from '../lib/wiki-index.mjs';

/**
 * A wikilink with no |alias shows its raw target, such as "Resume#Layout".
 * Show the heading ("Layout") or the page title ("Resume") instead.
 * Runs after remark-wiki-link.
 * @param {{ wiki: { byKey: Map<string, string>, pages: { href: string, title: string }[] } }} options
 */
export default function remarkWikilinkLabels({ wiki }) {
	const titleByHref = new Map(
		wiki.pages.map((page) => [page.href, page.title]),
	);
	return (tree) => {
		visit(tree, (node) => {
			if (node.type !== 'wikiLink' || !node.data) return;
			if (node.data.alias !== node.value) return;
			const { page, heading } = splitWikiTarget(node.value ?? '');
			const href = wiki.byKey.get(normalizeWikiName(page));
			const label = heading || (href && titleByHref.get(href)) || page;
			node.data.alias = label;
			node.data.hChildren = [{ type: 'text', value: label }];
		});
	};
}

/** @param {any} node @param {(node: any) => void} fn */
function visit(node, fn) {
	fn(node);
	for (const child of node?.children ?? []) visit(child, fn);
}
