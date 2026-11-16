/**
 * Open links to other sites in a new tab. Each one gets target="_blank",
 * rel="noopener noreferrer", the external-link class, and a screen-reader hint.
 * Links on eeprep.com stay in the same tab.
 *
 * The last word of the link text goes in its own span, and CSS draws a small
 * arrow after that span and keeps the two on one line. A period, comma or
 * other closing punctuation right after the link goes with the link in a
 * wrapper span that doesn't wrap either, so the arrow never starts a line and
 * its punctuation never ends up on the next one.
 */
import { splitTail } from './external-link-tail.mjs';

const ownHosts = new Set(['eeprep.com', 'www.eeprep.com']);

export default function rehypeExternalLinks() {
	return (tree) => {
		walk(tree);
	};
}

/** @param {any} node */
function walk(node) {
	const children = node?.children ?? [];
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (
			child?.type === 'element' &&
			child.tagName === 'a' &&
			isExternal(child)
		) {
			mark(child);
			const next = children[i + 1];
			const punct =
				next?.type === 'text' ? /^[.,;:!?)\]]+/.exec(next.value) : null;
			if (punct) {
				next.value = next.value.slice(punct[0].length);
				const wrapper = {
					type: 'element',
					tagName: 'span',
					properties: { className: ['eep-ext'] },
					children: [child, { type: 'text', value: punct[0] }],
				};
				children[i] = wrapper;
				if (!next.value) children.splice(i + 1, 1);
			}
		} else {
			walk(child);
		}
	}
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
	node.children = withTail(node.children);
	node.children.push({
		type: 'element',
		tagName: 'span',
		properties: { className: ['sr-only'] },
		children: [{ type: 'text', value: ' (opens in a new tab)' }],
	});
}

/**
 * Wraps the link text in a span that wraps as usual, with the tail in its own
 * span inside it. The tail is the last word of the last text child, or the
 * whole last child when it is an element.
 *
 * @param {any[]} children
 */
function withTail(children) {
	const last = children.at(-1);
	if (!last) return children;
	const head = children.slice(0, -1);
	let tail = [last];
	if (last.type === 'text') {
		const [h, t] = splitTail(last.value);
		if (h) head.push({ type: 'text', value: h });
		tail = [{ type: 'text', value: t }];
	}
	return [
		{
			type: 'element',
			tagName: 'span',
			properties: { className: ['eep-ext-text'] },
			children: [
				...head,
				{
					type: 'element',
					tagName: 'span',
					properties: { className: ['eep-ext-last'] },
					children: tail,
				},
			],
		},
	];
}
