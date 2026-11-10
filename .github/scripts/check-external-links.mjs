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
	// Drops every scripted connection without answering, as of November 2026.
	'www.solidworks.com',
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
const refused = [];
const failed = [];

const queue = urls.filter((url) => {
	if (!skipHosts.has(new URL(url).hostname)) return true;
	skipped.push(url);
	return false;
});
// URLs actually fetched, after the skipped hosts.
const checked = queue.length;

// Eight requests in flight at once. The list spans many hosts, so no one host
// sees a burst, and the run takes minutes instead of most of an hour.
await Promise.all(
	Array.from({ length: 8 }, async () => {
		for (let url = queue.shift(); url; url = queue.shift()) {
			const status = await fetchStatus(url);
			if (status >= 200 && status < 400) continue;
			// A 403 is a bot wall, not a dead page. Several university career
			// sites and newsrooms answer every script that way.
			if (status === 403) {
				refused.push(url);
				continue;
			}
			failed.push({ url, status });
			console.error(`${status || 'no response'} ${url}`);
		}
	}),
);

const summary = [
	`Checked ${checked} of ${urls.length} source URLs. ${failed.length} failed, ${refused.length} refused a script, ${skipped.length} skipped.`,
	'',
	...(failed.length
		? [
				'Failed:',
				...failed.map((f) => `- ${f.status || 'no response'} ${f.url}`),
				'',
			]
		: []),
	...(refused.length
		? [
				'Refused with 403 (a bot wall, check by hand if the page matters):',
				...refused.map((u) => `- ${u}`),
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
	const head = await attempt(url, 'HEAD');
	// A server that refuses HEAD gets one GET. A host that did not answer at
	// all is not asked twice.
	if (head === 0) return 0;
	return [403, 404, 405].includes(head) ? attempt(url, 'GET') : head;
}

/**
 * One request. The body is cancelled as soon as the status is known.
 * @param {string} url
 * @param {'HEAD' | 'GET'} method
 */
async function attempt(url, method) {
	try {
		const res = await fetch(url, {
			method,
			headers,
			redirect: 'follow',
			signal: AbortSignal.timeout(timeoutMs),
		});
		await res.body?.cancel();
		return res.status;
	} catch {
		return 0;
	}
}
