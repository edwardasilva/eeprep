import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { withRobotsHeader } from './dev.mjs';

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
