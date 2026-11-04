// Fixture checks for .github/scripts/check-link-index.mjs.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const fixtures = path.resolve('.github/scripts/fixtures/link-index');

/** @param {string} dir */
const check = (dir) =>
	spawnSync(process.execPath, ['.github/scripts/check-link-index.mjs'], {
		env: {
			...process.env,
			DIST_DIR: path.join(fixtures, dir, 'site'),
			LINK_INDEX: path.join(fixtures, dir, 'link-index.json'),
		},
		encoding: 'utf8',
	});

// Case, www., utm_*, the fragment and a trailing slash don't matter. Own
// hosts, workers.dev, relative links, mailto, <link> tags, the footer license
// links, redirect stubs and the All links page itself are skipped.
const good = check('good');
assert.equal(good.status, 0, `${good.stdout}\n${good.stderr}`);
assert.equal(good.stderr, '');
assert.match(good.stdout, /Link index matches 2 outside URLs across 2 pages/);

const drift = check('drift');
assert.equal(drift.status, 1);
assert.match(
	drift.stderr,
	/https:\/\/example\.com\/new-link: linked on the site but has no entry\. Add an entry to src\/data\/link-index\.json with "url": "https:\/\/example\.com\/new-link" and "pages": \["index"\]\./,
);
assert.match(
	drift.stderr,
	/https:\/\/example\.com\/gone: has an entry but is not linked on any page\. Remove its entry from src\/data\/link-index\.json\./,
);
assert.match(
	drift.stderr,
	/https:\/\/www\.example\.com\/twice\/#top: two entries share the normalized URL https:\/\/example\.com\/twice \(the other is https:\/\/example\.com\/twice\)\. Remove one of them/,
);
assert.match(
	drift.stderr,
	/https:\/\/example\.com\/listed\/: "pages" differs from where it is linked\. In src\/data\/link-index\.json, add "guide" to its "pages" and remove "roadmap" from its "pages"\./,
);
assert.doesNotMatch(drift.stderr, /twice: "pages" differs/);
assert.equal(drift.stderr.trim().split('\n').length, 4, drift.stderr);

const absent = check('no-such-fixture');
assert.equal(absent.status, 1);
assert.match(absent.stderr, /is missing\. Run npm run build first\./);

console.log('Link index checks pass.');
