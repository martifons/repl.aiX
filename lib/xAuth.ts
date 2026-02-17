/**
 * X (Twitter) auth: cookie name used to persist provider_token so API routes can use it.
 * Set in auth/callback, read in api/x/* routes, cleared on logout.
 */
export const X_TOKEN_COOKIE = 'replaix_x_token';
