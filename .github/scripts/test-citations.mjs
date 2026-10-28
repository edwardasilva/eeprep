// Fixture checks for .github/scripts/check-citations.mjs.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const fixtures = path.resolve('.github/scripts/fixtures/citations');

/** @param {string} dir */
const check = (dir) =>
	spawnSync(process.execPath, ['.github/scripts/check-citations.mjs'], {
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
assert.match(
	good.stdout,
	/Citation URLs match 4 bibliography entries across 1 pages/,
);

const missing = check('missing-url');
assert.equal(missing.status, 1);
assert.match(
	missing.stderr,
	/page\.md:\d+: source URL https:\/\/example\.com\/missing is not in /,
);
assert.doesNotMatch(missing.stderr, /example\.com\/kept/);
assert.match(
	missing.stderr,
	/bibliography entry "real-key" is not linked from any page/,
);

const uncited = check('uncited');
assert.equal(uncited.status, 1);
assert.match(
	uncited.stderr,
	/bibliography entry "unused-source" is not linked from any page/,
);
assert.doesNotMatch(uncited.stderr, /entry "used-source"/);

const duplicate = check('duplicate');
assert.equal(duplicate.status, 1);
assert.match(duplicate.stderr, /duplicate citation key "Dup-Key"/);

const title = check('missing-title');
assert.equal(title.status, 1);
assert.match(title.stderr, /citation entry "no-title" is missing a title/);

const locator = check('missing-locator');
assert.equal(locator.status, 1);
assert.match(
	locator.stderr,
	/citation entry "no-locator" is missing a url, doi, or publisher/,
);

const absent = check('no-bib');
assert.equal(absent.status, 1);
assert.match(absent.stderr, /bibliography file not found/);
assert.doesNotMatch(
	`${absent.stdout}\n${absent.stderr}`,
	/example\.com\/orphan/,
);

console.log('Citation checks pass.');
