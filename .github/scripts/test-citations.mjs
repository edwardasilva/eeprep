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
assert.match(locator.stderr, /citation entry "no-locator" is missing a url/);
assert.doesNotMatch(locator.stderr, /not linked from any page/);

const doiOnly = check('doi-only');
assert.equal(doiOnly.status, 1);
assert.match(doiOnly.stderr, /citation entry "doi-only" is missing a url/);
assert.match(
	doiOnly.stderr,
	/citation entry "publisher-only" is missing a url/,
);
assert.doesNotMatch(doiOnly.stderr, /not linked from any page/);
assert.doesNotMatch(doiOnly.stderr, /entry "with-url"/);

const absent = check('no-bib');
assert.equal(absent.status, 1);
assert.match(absent.stderr, /bibliography file not found/);
assert.doesNotMatch(
	`${absent.stdout}\n${absent.stderr}`,
	/example\.com\/orphan/,
);

const badText = check('bad-link-text');
assert.equal(badText.status, 1);
assert.match(
	badText.stderr,
	/link text "reddit-2026-bad-key" starts with a citation key/,
);
assert.match(badText.stderr, /link text "x-short" starts with a citation key/);
assert.match(badText.stderr, /link text "note @handle" contains "@"/);
assert.match(
	badText.stderr,
	/link text "https:\/\/example\.com\/bare" is a bare URL/,
);
assert.match(
	badText.stderr,
	/link text "www\.example\.com\/plain" is a bare URL/,
);
assert.match(
	badText.stderr,
	/link text "https:\/\/example\.com\/auto" is a bare URL/,
);
assert.match(
	badText.stderr,
	/link text "abcdefghijklmnopqrstu" is a single token over 20 characters/,
);
assert.doesNotMatch(badText.stderr, /not linked from any page/);
assert.doesNotMatch(badText.stderr, /is not in /);

const pandoc = check('pandoc-cite');
assert.equal(pandoc.status, 1);
assert.match(pandoc.stderr, /Pandoc citation "\[@study-key\]" is not allowed/);
assert.match(
	pandoc.stderr,
	/Pandoc citation "\[@key1; @key2\]" is not allowed/,
);
assert.doesNotMatch(pandoc.stderr, /not linked from any page/);
assert.doesNotMatch(pandoc.stderr, /link text /);

const ownLine = check('own-line');
assert.equal(ownLine.status, 1);
assert.match(ownLine.stderr, /page\.md:7: line is only Markdown links/);
assert.match(ownLine.stderr, /page\.md:9: line is only Markdown links/);
assert.match(ownLine.stderr, /page\.md:13: line is only Markdown links/);
assert.match(ownLine.stderr, /page\.md:21: line is only Markdown links/);
assert.doesNotMatch(ownLine.stderr, /page\.md:5:/);
assert.doesNotMatch(ownLine.stderr, /page\.md:11:/);
assert.doesNotMatch(ownLine.stderr, /page\.md:15:/);
assert.doesNotMatch(ownLine.stderr, /page\.md:18:/);
assert.doesNotMatch(ownLine.stderr, /page\.md:23:/);
assert.doesNotMatch(ownLine.stderr, /link text /);
assert.doesNotMatch(ownLine.stderr, /not linked from any page/);
assert.doesNotMatch(ownLine.stderr, /is not in /);

const handle = check('handle-prose');
assert.equal(handle.status, 1);
assert.match(handle.stderr, /prose contains a handle "@ada_writer"/);
assert.doesNotMatch(handle.stderr, /not linked from any page/);

const handleOk = check('handle-ok');
assert.equal(handleOk.status, 0, `${handleOk.stdout}\n${handleOk.stderr}`);
assert.equal(handleOk.stderr, '');
assert.match(
	handleOk.stdout,
	/Citation URLs match 1 bibliography entries across 1 pages/,
);

console.log('Citation checks pass.');
