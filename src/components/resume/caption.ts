import { splitTail } from '../../plugins/external-link-tail.mjs';

// Figure captions are plain HTML, so the Markdown plugin that marks external
// links never sees them. This gives caption links the same markup: a new tab,
// rel, the external-link class, a screen-reader hint, the last word in a
// span that CSS draws the arrow after and keeps on one line with it, and a
// wrapper that keeps a period or comma right after the link with the arrow.
export function externalLinks(html: string): string {
	return html.replace(
		/<a href="(https?:\/\/[^"]+)">([^<]*)<\/a>([.,;:!?)\]]*)/g,
		(_, href: string, text: string, after: string) => {
			const [head, tail] = splitTail(text);
			const body = `<span class="eep-ext-text">${head}<span class="eep-ext-last">${tail}</span></span>`;
			const link = `<a href="${href}" class="external-link" target="_blank" rel="noopener noreferrer">${body}<span class="sr-only"> (opens in a new tab)</span></a>`;
			return after ? `<span class="eep-ext">${link}${after}</span>` : link;
		},
	);
}
