import type { Context, Next } from 'hono';
import { getPropelAuthUrl, getSquadApiUrl } from '../helpers/config.js';

/**
 * Build CSP header at startup (environment doesn't change at runtime)
 */
function buildCspHeader(): string {
  const propelAuthUrl = getPropelAuthUrl();
  const squadApiUrl = getSquadApiUrl();

  const cspDirectives = [
    // Default: only allow same-origin
    "default-src 'self'",

    // Scripts: allow same-origin only (no inline scripts, no eval)
    "script-src 'self'",

    // Styles: allow same-origin and inline styles (needed for inspector UI)
    "style-src 'self' 'unsafe-inline'",

    // Images: allow same-origin and data URIs
    "img-src 'self' data:",

    // Fonts: allow same-origin
    "font-src 'self'",

    // Connect (fetch/XHR): allow same-origin, PropelAuth, and Squad API
    `connect-src 'self' ${propelAuthUrl} ${squadApiUrl}`,

    // Media: allow same-origin only
    "media-src 'self'",

    // Objects: disallow all
    "object-src 'none'",

    // Frames: disallow all iframes
    "frame-src 'none'",

    // Base URI: restrict to same-origin
    "base-uri 'self'",

    // Form actions: restrict to same-origin
    "form-action 'self'",

    // Frame ancestors: disallow embedding in iframes
    "frame-ancestors 'none'",

    // Upgrade insecure requests to HTTPS
    'upgrade-insecure-requests',

    // Block all mixed content
    'block-all-mixed-content',
  ];

  return cspDirectives.join('; ');
}

/**
 * Pre-built CSP header (computed once at module load)
 */
const CSP_HEADER = buildCspHeader();

/**
 * Content Security Policy middleware for ChatGPT app store compliance.
 * Tightly restricts resources to only the domains we fetch from.
 */
export async function cspMiddleware(c: Context, next: Next) {
  c.header('Content-Security-Policy', CSP_HEADER);
  await next();
}
