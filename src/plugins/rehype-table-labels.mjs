/**
 * Give each body cell of a Markdown table a data-label with its column's
 * header text, and mark the table with a class, so CSS can stack rows on
 * narrow screens with the column name above each cell. Runs only on the
 * files listed in `files` (matched by path suffix).
 *
 * @param {{ files: string[], className: string }} options
 */
export default function rehypeTableLabels({ files, className }) {
	return (tree, file) => {
		const path = String(file.path ?? file.history?.[0] ?? '');
		if (!files.some((f) => path.endsWith(f))) return;
		walk(tree, className);
	};
}

/** @param {any} node @param {string} className */
function walk(node, className) {
	if (node?.type === 'element' && node.tagName === 'table') {
		label(node, className);
		return;
	}
	for (const child of node?.children ?? []) walk(child, className);
}

/** @param {any} table @param {string} className */
function label(table, className) {
	const classes = table.properties.className ?? [];
	table.properties.className = [...classes, className];
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
