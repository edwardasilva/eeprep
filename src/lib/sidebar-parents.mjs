// Sidebar groups that open with a link to their own page.
//
// A group whose first item is a link with the same label as the group is a
// parent page: the sidebar shows that link as the group label and the other
// items as its sub-pages.
//
//   {
//     label: 'Help links',
//     items: [
//       { label: 'Help links', slug: 'help-links' },
//       { label: 'Sources', slug: 'help-links/all-links' },
//     ],
//   }

/**
 * @typedef {{ type: 'link', label: string, href: string, isCurrent: boolean }} Link
 * @typedef {{ type: 'group', label: string, entries: Entry[], collapsed: boolean }} Group
 * @typedef {Link | Group} Entry
 */

/**
 * The parent link and the sub-pages of a parent-page group, or null for any
 * other entry.
 * @template {Entry} T
 * @param {T} entry
 * @returns {{ parent: Extract<T, { type: 'link' }>, children: T[] } | null}
 */
export function splitParentGroup(entry) {
	if (entry.type !== 'group') return null;
	const [first, ...children] = entry.entries;
	if (first?.type !== 'link') return null;
	if (first.label.trim() !== entry.label.trim()) return null;
	return /** @type {any} */ ({ parent: first, children });
}

/**
 * True when the current page is anywhere inside the entry.
 * @param {Entry} entry
 * @returns {boolean}
 */
export function hasCurrent(entry) {
	if (entry.type === 'link') return entry.isCurrent;
	return entry.entries.some(hasCurrent);
}
