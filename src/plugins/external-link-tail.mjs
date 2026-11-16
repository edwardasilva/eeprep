/**
 * Splits external link text into the part that wraps as usual and a short
 * tail that CSS keeps on one line with the link's arrow, which it draws after
 * the tail. The tail is the last
 * word, so the arrow never starts a line by itself. A last word longer than
 * 12 characters, such as r/EngineeringResumes, keeps only its last character
 * in the tail, so the word can still break at a narrow width.
 *
 * @param {string} text
 * @returns {[string, string]} the head and the tail
 */
export function splitTail(text) {
	const space = text.search(/\s\S*$/);
	const word = space < 0 ? text : text.slice(space + 1);
	const cut = word.length > 12 ? text.length - 1 : space < 0 ? 0 : space + 1;
	return [text.slice(0, cut), text.slice(cut)];
}
