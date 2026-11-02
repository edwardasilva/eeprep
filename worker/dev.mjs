// Worker for the dev site. It serves the same built files as eeprep.com and
// adds a noindex header to every response, including the 404 page, so search
// engines skip the dev site. eeprep.com does not run this Worker.

/**
 * @param {Response} response
 * @param {string | undefined} siteEnv
 * @returns {Response}
 */
export function withRobotsHeader(response, siteEnv) {
	if (siteEnv !== 'dev') return response;
	const out = new Response(response.body, response);
	out.headers.set('X-Robots-Tag', 'noindex, nofollow');
	return out;
}

export default {
	/**
	 * @param {Request} request
	 * @param {{ ASSETS: { fetch: typeof fetch }, SITE_ENV?: string }} env
	 */
	async fetch(request, env) {
		return withRobotsHeader(await env.ASSETS.fetch(request), env.SITE_ENV);
	},
};
