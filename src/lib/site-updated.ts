import { execSync } from 'node:child_process';

// The one "Last updated" date in the site footer: the date of the newest
// commit in the build. The deploy job checks out full history, so this is the
// date the site last changed. A build outside git falls back to today.
function newestCommitDate(): Date {
	try {
		const iso = execSync('git log -1 --format=%cI', {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim();
		const date = new Date(iso);
		return Number.isNaN(date.getTime()) ? new Date() : date;
	} catch {
		return new Date();
	}
}

export const siteUpdated = newestCommitDate();

export const siteUpdatedText = siteUpdated.toLocaleDateString('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC',
});
