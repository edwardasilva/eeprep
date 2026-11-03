/**
 * Open links to other sites in a new tab. Each one gets target="_blank",
 * rel="noopener noreferrer", the external-link class (CSS draws a small arrow
 * after it), and a screen-reader hint. Links on eeprep.com stay in the same tab.
 */
const ownHosts = new Set(['eeprep.com', 'www.eeprep.com']);

export default function rehypeExternalLinks() {
	return (tree) => {
		walk(tree);
	};
}

/** @param {any} node */
function walk(node) {
	if (node?.type === 'element' && node.tagName === 'a' && isExternal(node)) {
		mark(node);
	}
	for (const child of node?.children ?? []) walk(child);
}

/** @param {any} node */
function isExternal(node) {
	const href = String(node.properties?.href ?? '');
	if (!/^https?:\/\//i.test(href)) return false;
	try {
		return !ownHosts.has(new URL(href).hostname.toLowerCase());
	} catch {
		return false;
	}
}

/** @param {any} node */
function mark(node) {
	const classes = node.properties.className ?? [];
	node.properties.className = [
		...(Array.isArray(classes) ? classes : [classes]),
		'external-link',
	];
	node.properties.target = '_blank';
	node.properties.rel = ['noopener', 'noreferrer'];
	node.children.push({
		type: 'element',
		tagName: 'span',
		properties: { className: ['sr-only'] },
		children: [{ type: 'text', value: ' (opens in a new tab)' }],
	});
}
