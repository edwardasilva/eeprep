/**
 * Give each body cell of a Markdown table a data-label with its column's
 * header text, and mark the table with a class, so CSS can stack rows on
 * narrow screens with the column name above each cell. Every table gets
 * `className`. A table in a file listed in an `extra` rule (matched by path
 * suffix) also gets that rule's class.
 *
 * @param {{ className: string, extra?: { files: string[], className: string }[] }} options
 */
export default function rehypeTableLabels({ className, extra = [] }) {
	return (tree, file) => {
		const path = String(file.path ?? file.history?.[0] ?? '');
		const classes = [
			className,
			...extra
				.filter((rule) => rule.files.some((f) => path.endsWith(f)))
				.map((rule) => rule.className),
		];
		walk(tree, classes);
	};
}

/** @param {any} node @param {string[]} classes */
function walk(node, classes) {
	if (node?.type === 'element' && node.tagName === 'table') {
		label(node, classes);
		return;
	}
	for (const child of node?.children ?? []) walk(child, classes);
}

/** @param {any} table @param {string[]} classes */
function label(table, classes) {
	const existing = table.properties.className ?? [];
	table.properties.className = [...existing, ...classes];
	const sections = table.children.filter((n) => n.type === 'element');
	const head = sections.find((n) => n.tagName === 'thead');
	const body = sections.find((n) => n.tagName === 'tbody');
	if (!head || !body) return;
	const headers = cells(rows(head)[0] ?? { children: [] }).map(textOf);
	for (const row of rows(body)) {
		cells(row).forEach((cell, i) => {
			if (headers[i]) cell.properties.dataLabel = headers[i];
		});
	}
}

/** @param {any} node */
const rows = (node) =>
	node.children.filter((n) => n.type === 'element' && n.tagName === 'tr');

/** @param {any} row */
const cells = (row) =>
	row.children.filter(
		(n) => n.type === 'element' && (n.tagName === 'th' || n.tagName === 'td'),
	);

/** @param {any} node @returns {string} */
function textOf(node) {
	if (node?.type === 'text') return node.value;
	return (node?.children ?? []).map(textOf).join('').trim();
}
