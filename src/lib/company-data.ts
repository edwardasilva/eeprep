// The company list's compact row format, shared by the page's build-time
// frontmatter and its browser script. No Node imports, so the browser can
// load it.

/** One company as the page ships it in its inline JSON. */
export type Company = {
	n: string;
	w: string;
	c?: string;
	i: string;
	il: string;
	f?: string;
	fl?: string;
	ci: string;
	s: string;
	cs?: string[];
	ss?: string[];
	// Notes, the one search field the row does not already hold.
	x?: string;
	// Country, when it is not the US.
	k?: string;
	// The whole search text, shipped only when it cannot be rebuilt from the
	// fields above, as for a company merged from rows with different notes.
	q?: string;
};

/** The order the list sorts text in, on the server and in the browser. */
export const compare = (a: string, b: string) =>
	a.localeCompare(b, 'en', { sensitivity: 'base', numeric: true });

/** The text each sort option sorts by. */
export const sortKeys: Record<string, (c: Company) => string> = {
	name: (c) => c.n,
	industry: (c) => c.il,
	field: (c) => c.fl ?? '',
	city: (c) => c.ci,
	state: (c) => c.s,
};

/**
 * The lower-case text a search matches, built from the row's fields in the
 * same order as the loader's search string.
 */
export function searchText(c: Company): string {
	return (
		c.q ??
		[c.n, c.ci, c.s, c.k ?? 'US', c.i, c.il, c.f, c.fl, c.x]
			.filter(Boolean)
			.join(' ')
			.toLowerCase()
	);
}
