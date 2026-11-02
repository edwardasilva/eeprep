/**
 * Draft pages are left out of production builds. A link to one would 404, so
 * keep the link text and drop the link until the page is published.
 * @param {{ hrefs?: string[] }} options
 */
export default function rehypeUnlinkDrafts({ hrefs = [] } = {}) {
	const drafts = new Set(hrefs);
	return (tree) => {
		if (drafts.size === 0 || process.env.NODE_ENV !== 'production') return;
		unlink(tree, drafts);
	};
}

/** @param {any} node @param {Set<string>} drafts */
function unlink(node, drafts) {
	for (const child of node?.children ?? []) {
		if (child.type === 'element' && child.tagName === 'a') {
			const href = String(child.properties?.href ?? '').split('#')[0];
			if (drafts.has(href)) {
				child.tagName = 'span';
				child.properties = {};
			}
		}
		unlink(child, drafts);
	}
}
