// Figure captions are plain HTML, so the Markdown plugin that marks external
// links never sees them. This gives caption links the same markup: a new tab,
// rel, the external-link class (CSS draws the arrow) and a screen-reader hint.
export function externalLinks(html: string): string {
	return html.replace(
		/<a href="(https?:\/\/[^"]+)">([\s\S]*?)<\/a>/g,
		(_, href: string, text: string) =>
			`<a href="${href}" class="external-link" target="_blank" rel="noopener noreferrer">${text}<span class="sr-only"> (opens in a new tab)</span></a>`,
	);
}
