// Worker for the dev site. It serves the same built files as eeprep.com and
// adds a noindex header to every response, including the 404 page, so search
// engines skip the dev site. eeprep.com does not run this Worker.
//
// Cloudflare doesn't apply public/_headers to responses that come from Worker
// code, so the Worker sets the same security headers itself. dev.test.mjs
// fails if this list and public/_headers drift apart.

export const securityHeaders = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy':
		'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
	'Content-Security-Policy':
		"frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
};

/**
 * @param {Response} response
 * @param {string | undefined} siteEnv
 * @returns {Response}
 */
export function withRobotsHeader(response, siteEnv) {
	if (siteEnv !== 'dev') return response;
	const out = new Response(response.body, response);
	for (const [name, value] of Object.entries(securityHeaders))
		out.headers.set(name, value);
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
