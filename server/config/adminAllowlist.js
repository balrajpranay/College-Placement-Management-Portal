/**
 * Campus Connect — Placement Admin Allowlist & Security Configuration
 *
 * Enforces strict backend-only authorization for Placement Administrator access.
 * Exactly three authorized administrator email addresses are permitted.
 *
 * Environment variables:
 * - ADMIN_EMAIL_1: pranay.b9106@gmail.com
 * - ADMIN_EMAIL_2: ayeshaeram2005@gmail.com
 * - ADMIN_EMAIL_3: kethapagabhavani9980@gmail.com
 */

require('dotenv').config();

const DEFAULT_ADMIN_EMAILS = Object.freeze([
  'pranay.b9106@gmail.com',
  'ayeshaeram2005@gmail.com',
  'kethapagabhavani9980@gmail.com'
]);

/**
 * Returns the array of authorized admin email addresses,
 * read from environment variables ADMIN_EMAIL_1, ADMIN_EMAIL_2, ADMIN_EMAIL_3,
 * normalized (trimmed and lowercased).
 *
 * @returns {string[]}
 */
function getAuthorizedAdminEmails() {
  const envEmails = [
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2,
    process.env.ADMIN_EMAIL_3
  ]
    .filter(Boolean)
    .map(e => String(e).trim().toLowerCase());

  if (envEmails.length > 0) {
    return envEmails;
  }

  return [...DEFAULT_ADMIN_EMAILS];
}

/**
 * Checks whether a given email address is in the authorized admin allowlist.
 * Performs rigorous normalization: trims whitespace and lowercases.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isAuthorizedAdminEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  const allowlist = getAuthorizedAdminEmails();
  return allowlist.includes(normalized);
}

module.exports = {
  getAuthorizedAdminEmails,
  isAuthorizedAdminEmail,
  DEFAULT_ADMIN_EMAILS
};
