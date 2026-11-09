// Fetches every source URL in src/content/references.bib and reports the ones
// that no longer answer. It runs on a schedule, not on pull requests, because
// outside sites go down for reasons that have nothing to do with a change
// here. Hosts that refuse automated clients on purpose are skipped and listed,
// so the report says what it did not check.
//
// Exit code 1 means at least one URL failed. With --report, the script also
// writes a Markdown summary to the file named by GITHUB_STEP_SUMMARY.
import fs from 'node:fs';
import path from 'node:path';

const bibPath = path.resolve('src/content/references.bib');
// These sites block scripted requests or need a login, so a failure here says
// nothing about the link. A person checks them by hand.
const skipHosts = new Set([
	'x.com',
	'www.x.com',
	'reddit.com',
	'www.reddit.com',
	'www.linkedin.com',
	'linkedin.com',
]);
const timeoutMs = 20_000;
const headers = {
	'user-agent':
		'Mozilla/5.0 (X11; Linux x86_64) eeprep-link-check (+https://eeprep.com)',
	accept: 'text/html,application/xhtml+xml,application/pdf,*/*;q=0.8',
};

const urls = [
	...new Set(
		[
			...fs
				.readFileSync(bibPath, 'utf8')
				.matchAll(/^\s*url\s*=\s*\{([^}]+)\}/gm),
		].map((m) => m[1].trim()),
	),
];
const skipped = [];
const failed = [];
let checked = 0;

for (const url of urls) {
	const host = new URL(url).hostname;
	if (skipHosts.has(host)) {
		skipped.push(url);
		continue;
	}
	checked++;
	const status = await fetchStatus(url);
	if (status >= 200 && status < 400) continue;
	failed.push({ url, status });
	console.error(`${status || 'no response'} ${url}`);
}

const summary = [
	`Checked ${checked} of ${urls.length} source URLs. ${failed.length} failed, ${skipped.length} skipped.`,
	'',
	...(failed.length
		? [
				'Failed:',
				...failed.map((f) => `- ${f.status || 'no response'} ${f.url}`),
				'',
			]
		: []),
	...(skipped.length
		? [
				'Skipped (block automated clients, check by hand):',
				...skipped.map((u) => `- ${u}`),
			]
		: []),
];
console.log(summary[0]);
if (process.argv.includes('--report') && process.env.GITHUB_STEP_SUMMARY) {
	fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary.join('\n')}\n`);
}
if (failed.length) process.exit(1);

/**
 * HEAD first, then GET for servers that refuse HEAD. 0 means no response.
 * @param {string} url
 */
async function fetchStatus(url) {
	for (const method of ['HEAD', 'GET']) {
		try {
			const res = await fetch(url, {
				method,
				headers,
				redirect: 'follow',
				signal: AbortSignal.timeout(timeoutMs),
			});
			if (
				method === 'HEAD' &&
				(res.status === 405 || res.status === 403 || res.status === 404)
			)
				continue;
			return res.status;
		} catch {
			if (method === 'GET') return 0;
		}
	}
	return 0;
}
