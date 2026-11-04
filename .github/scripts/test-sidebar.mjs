// Checks the sidebar parent-page convention in src/lib/sidebar-parents.mjs.
import assert from 'node:assert/strict';
import {
	hasCurrent,
	splitParentGroup,
} from '../../src/lib/sidebar-parents.mjs';

/** @param {string} label @param {boolean} [isCurrent] */
const link = (label, isCurrent = false) => ({
	type: /** @type {const} */ ('link'),
	label,
	href: `/${label.toLowerCase().replaceAll(' ', '-')}/`,
	isCurrent,
});
/** @param {string} label @param {any[]} entries */
const group = (label, entries) => ({
	type: /** @type {const} */ ('group'),
	label,
	entries,
	collapsed: false,
});

const helpLinks = group('Help links', [
	link('Help links'),
	link('All links', true),
]);
const split = splitParentGroup(helpLinks);
assert.ok(split);
assert.equal(split.parent.label, 'Help links');
assert.deepEqual(
	split.children.map((e) => e.label),
	['All links'],
);
assert.equal(hasCurrent(helpLinks), true);

// A parent page with no sub-pages yet is still a parent group.
const lone = splitParentGroup(group('Projects', [link('Projects')]));
assert.ok(lone);
assert.equal(lone.children.length, 0);

// A plain group keeps its label: the first item has a different label.
const advice = group('Advice', [link('Resume'), link('Workshop')]);
assert.equal(splitParentGroup(advice), null);
assert.equal(hasCurrent(advice), false);

// A group that opens with a group, and a link entry, are not parent groups.
assert.equal(splitParentGroup(group('Advice', [helpLinks])), null);
assert.equal(splitParentGroup(link('Roadmap')), null);

// The current page is found at any depth.
assert.equal(hasCurrent(group('Advice', [link('Resume'), helpLinks])), true);

console.log('test-sidebar: ok');
