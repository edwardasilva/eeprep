// Fixture checks for .github/scripts/check-link-case.mjs.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const fixtures = path.resolve('.github/scripts/fixtures/link-case');

/** @param {string} dir */
const check = (dir) =>
	spawnSync(
		process.execPath,
		['.github/scripts/check-link-case.mjs', path.join(fixtures, dir, 'site')],
		{ encoding: 'utf8' },
	);

// Sentence, item, cell and heading starts, proper nouns, acronyms, internal
// capitals, quotes and brackets, the footer and link cards are all fine.
const good = check('good');
assert.equal(good.status, 0, `${good.stdout}\n${good.stderr}`);
assert.equal(good.stderr, '');
assert.match(good.stdout, /Link text has sentence case in \d+ links/);

// A capital after "The", after a colon and inside a sentence is flagged. The
// "(opens in a new tab)" tail is dropped from the reported text.
const bad = check('bad');
assert.equal(bad.status, 1);
assert.match(bad.stderr, /guide\/index\.html: link text "Resume page" starts/);
assert.match(bad.stderr, /link text "Layout" starts/);
assert.match(bad.stderr, /link text "Where to look" starts/);
assert.match(bad.stderr, /link text "Ask a professor" starts/);
assert.doesNotMatch(bad.stderr, /link text "resume page"/);
assert.doesNotMatch(bad.stderr, /Alex's finished page/);
assert.equal(
	bad.stderr
		.trim()
		.split('\n')
		.filter((line) => line.includes('link text')).length,
	4,
	bad.stderr,
);

const absent = check('no-such-fixture');
assert.equal(absent.status, 1);
assert.match(absent.stderr, /is missing\. Run npm run build first\./);

console.log('Link case checks pass.');
