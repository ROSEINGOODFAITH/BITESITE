/**
 * Verified brand settings (BRAND_CONTENT.md §0 + §6). Anything marked
 * TBD-CONFIRM in the content doc is intentionally NOT hardcoded here.
 */

export const BRAND_NAME = 'Laurel Bath House';
export const BRAND_SHORT = 'LBH';

/** $29+ free US shipping — verified from announcement bar + cart drawer. */
export const FREE_SHIPPING_THRESHOLD = 29;

export const SUPPORT_PHONE = '(562) 566-5599';
// TBD-CONFIRM: replace with a support@ alias before launch (davidt@ is personal).
export const SUPPORT_EMAIL = 'davidt@laurelbathhouse.com';
export const INSTAGRAM_HANDLE = 'laurelbathhouse';
export const INSTAGRAM_URL = 'https://www.instagram.com/laurelbathhouse';
export const YOUTUBE_URL = 'https://www.youtube.com/@laurelbathhouse'; // Nudie Radio

export const HQ_ADDRESS = '16140 Leadwell Street, Van Nuys, CA 91406';

export const SUBSCRIPTION_PROGRAM_NAME = 'Soap-scribe & Save';

/** Announcement bar variants (copy deck §5.5). First entry is default. */
export const ANNOUNCEMENT_MESSAGES = [
  {
    text: "✦ FREE US SHIPPING OVER $29 — your bathroom called, it's bored →",
    to: '/collections/all',
  },
  {
    // TBD-CONFIRM: pair with discount % once confirmed
    text: '✦ SOAP-SCRIBE & SAVE — never run dry again →',
    to: '/collections/body-wash',
  },
  {
    text: '✦ SHIPPING INSURANCE ON US — 100% coverage, zero drama →',
    to: '/pages/faq',
  },
] as const;

export const POSITIONING_LINE =
  'Luxury natural body care made in Los Angeles — niacinamide body wash, serum deodorant, and fine fragrance with complex natural scents. Vegan & cruelty-free.';

export const MISSION_HEADLINE = 'Not all natural brands have the same mission.';

export const MISSION_BODY =
  'Our mission starts with you — high-performing daily essentials that take care of people and the planet. Each scent story is a reminder to enjoy the things that make us happy. And yes: every bottle helps replant trees.';
