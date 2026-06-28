/** Browser tab / bookmark icon only — vector mark for a crisp favicon. */
export const FAVICON_URL = "/CartShip.png";

/**
 * Brand image shown in the UI (navbar, footer, auth, admin).
 * Set `NEXT_PUBLIC_LOGO_URL` (e.g. CDN with `?v=2`) to bust cache when you replace the file.
 */
export const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL?.trim() || "/CartShip.png";
