/**
 * Give each display equation an id from its KaTeX \tag, so "0.1" becomes eq-0-1.
 */
export default function rehypeEqIds() {
	return (tree) => {
		walk(tree);
	};
}

/** @param {any} node */
function walk(node) {
	if (node?.type === 'element' && hasClass(node, 'katex-display')) {
		const tag = findTagText(node);
		if (tag) {
			const num = tag.replace(/[()]/g, '').trim();
			if (num) node.properties.id = `eq-${num.replaceAll('.', '-')}`;
		}
	}
	for (const child of node?.children ?? []) walk(child);
}

/** @param {any} node */
function findTagText(node) {
	if (node?.type === 'element' && hasClass(node, 'tag')) return textOf(node);
	for (const child of node?.children ?? []) {
		const found = findTagText(child);
		if (found) return found;
	}
	return '';
}

/** @param {any} node */
function textOf(node) {
	if (node.type === 'text') return node.value ?? '';
	return (node.children ?? []).map(textOf).join('');
}

/** @param {any} node @param {string} name */
function hasClass(node, name) {
	const list = node.properties?.className;
	return Array.isArray(list) && list.includes(name);
}
