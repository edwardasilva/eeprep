// Checks wikilink #heading handling: the shared resolver and check-wikilinks.mjs on fixtures.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { buildPageLinks, loadWikiIndex, pageHeadingIds, resolveWikiTarget } from '../src/lib/wiki-index.mjs';

const fixtures = path.resolve('scripts/fixtures/wikilinks');
const good = loadWikiIndex(path.join(fixtures, 'good'));

assert.equal(resolveWikiTarget('Target page', good.byKey).href, '/target-page/');
assert.equal(resolveWikiTarget('Target page#Cutoff frequency', good.byKey).href, '/target-page/#cutoff-frequency');
assert.equal(resolveWikiTarget('target page#Cutoff frequency|the cutoff', good.byKey).href, '/target-page/#cutoff-frequency');
assert.equal(resolveWikiTarget("Target page#Ohm's law and V = IR", good.byKey).href, '/target-page/#ohms-law-and-v--ir');
assert.equal(resolveWikiTarget('Nowhere#Cutoff frequency', good.byKey).href, null);

const ids = pageHeadingIds('---\ntitle: x\n---\n\n## Cutoff frequency\n\n## Cutoff frequency\n\n```md\n## In a fence\n```\n');
assert.deepEqual([...ids], ['_top', 'cutoff-frequency', 'cutoff-frequency-1']);

const links = buildPageLinks(good);
assert.deepEqual(links['target-page/']?.backlinks, ['linker/']);

/** @param {string} dir */
const check = (dir) =>
	spawnSync(process.execPath, ['scripts/check-wikilinks.mjs'], {
		env: { ...process.env, CONTENT_ROOT: path.join(fixtures, dir) },
		encoding: 'utf8',
	});
const ok = check('good');
assert.equal(ok.status, 0, ok.stderr);
const bad = check('bad-heading');
assert.equal(bad.status, 1);
assert.match(bad.stderr, /has no heading "No such heading" \(#no-such-heading\)/);

console.log('Wikilink heading tests pass.');
