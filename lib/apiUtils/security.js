// pages/api/utils/security.js

/**
 * Escape HTML special characters to prevent XSS attacks
 */
export const escapeHtml = (text) => {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Sanitize HTML by removing dangerous tags and attributes
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
};

export const sanitizeObject = (value, { preserveUrlFields = false, urlFields = null } = {}) => {
  if (typeof value === 'string') {
    return escapeHtml(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeObject(item, { preserveUrlFields, urlFields }));
  }
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((acc, key) => {
      const shouldPreserve = preserveUrlFields && urlFields?.has?.(key);
      acc[key] = shouldPreserve ? value[key] : sanitizeObject(value[key], { preserveUrlFields, urlFields });
      return acc;
    }, {});
  }
  return value;
};

/**
 * Generate CSRF token
 */
export const generateCsrfToken = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
};
