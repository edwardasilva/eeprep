const actor = process.env.PR_ACTOR ?? '';
const sender = process.env.PR_SENDER ?? '';
const labels = readLabels(process.env.PR_LABELS ?? '[]');
const body = process.env.PR_BODY ?? '';

if (
	actor === 'dependabot[bot]' ||
	sender === 'dependabot[bot]' ||
	labels.includes('no-epic')
) {
	console.log('PR body check skipped for an exempt change.');
	process.exit(0);
}

const hasPartOf = body.split(/\r?\n/).some((line) => {
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith('<!--') || trimmed.startsWith('-->'))
		return false;
	return /^Part of #\d+\b/.test(trimmed);
});

if (!hasPartOf) {
	console.error(
		'PR body must include a line "Part of #<epic issue>", for example "Part of #2".',
	);
	process.exit(1);
}

console.log('PR body names its epic issue.');

/** @param {string} raw */
function readLabels(raw) {
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed)
			? parsed.filter((item) => typeof item === 'string')
			: [];
	} catch {
		return [];
	}
}
