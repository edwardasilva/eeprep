// Fixture checks for scripts/check-citations.mjs.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const fixtures = path.resolve('scripts/fixtures/citations');

/** @param {string} dir */
const check = (dir) =>
	spawnSync(process.execPath, ['scripts/check-citations.mjs'], {
		env: {
			...process.env,
			CONTENT_ROOT: path.join(fixtures, dir, 'docs'),
			BIB_PATH: path.join(fixtures, dir, 'references.bib'),
		},
		encoding: 'utf8',
	});

const good = check('good');
assert.equal(good.status, 0, `${good.stdout}\n${good.stderr}`);
assert.equal(good.stderr, '');

const missing = check('missing-key');
assert.equal(missing.status, 1);
assert.match(missing.stderr, /page\.md:3: citation key "missing-key" is not in /);
assert.match(missing.stderr, /page\.md:4: citation key "also-missing" is not in /);
assert.doesNotMatch(missing.stderr, /present-key/);

const duplicate = check('duplicate');
assert.equal(duplicate.status, 1);
assert.match(duplicate.stderr, /references\.bib:6: duplicate citation key "Dup-Key"/);

const absent = check('no-bib');
assert.equal(absent.status, 0, absent.stderr);
assert.match(absent.stdout, /is not in this checkout, so citation keys were not checked/);
assert.doesNotMatch(`${absent.stdout}\n${absent.stderr}`, /orphan-key/);

const title = check('missing-title');
assert.equal(title.status, 1);
assert.match(title.stderr, /references\.bib:1: citation entry "no-title" is missing a title/);

const locator = check('missing-locator');
assert.equal(locator.status, 1);
assert.match(locator.stderr, /references\.bib:1: citation entry "no-locator" is missing a url, doi, or publisher/);

console.log('Citation checks pass.');
