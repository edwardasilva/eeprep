import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import worker, { securityHeaders, withRobotsHeader } from './dev.mjs';

const assets = (status = 200) => ({
	fetch: async () =>
		new Response('<!doctype html>', {
			status,
			headers: { 'Content-Type': 'text/html' },
		}),
});

test('dev responses carry the noindex header', async () => {
	for (const status of [200, 404]) {
		const res = await worker.fetch(new Request('https://dev.example/x'), {
			ASSETS: assets(status),
			SITE_ENV: 'dev',
		});
		assert.equal(res.status, status);
		assert.equal(res.headers.get('X-Robots-Tag'), 'noindex, nofollow');
		for (const [name, value] of Object.entries(securityHeaders))
			assert.equal(res.headers.get(name), value);
		assert.equal(res.headers.get('Content-Type'), 'text/html');
		assert.equal(await res.text(), '<!doctype html>');
	}
});

test('other environments get the response unchanged', async () => {
	for (const siteEnv of [undefined, '', 'production']) {
		const res = withRobotsHeader(new Response('ok'), siteEnv);
		assert.equal(res.headers.get('X-Robots-Tag'), null);
	}
});

test('the dev Worker sets the same security headers as public/_headers', () => {
	const file = fs.readFileSync(
		new URL('../public/_headers', import.meta.url),
		'utf8',
	);
	/** @type {Record<string, string>} */
	const fromFile = {};
	for (const line of file.split('\n')) {
		const match = /^\s+([A-Za-z-]+):\s*(.+?)\s*$/.exec(line);
		if (match) fromFile[match[1]] = match[2];
	}
	assert.deepEqual(securityHeaders, fromFile);
});
