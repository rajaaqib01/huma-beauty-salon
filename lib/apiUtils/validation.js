// pages/api/utils/validation.js

/**
 * Normalize phone — keep digits, require 10–15 digits (Pakistani + intl).
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Validate contact form data
 */
export const validateContactForm = (data) => {
  const errors = {};

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (name.length < 2 || name.length > 100) {
    errors.name = 'Name must be 2-100 characters';
  }

  if (!isValidPhone(data.phone)) {
    errors.phone = 'Enter a valid phone number (10-15 digits)';
  }

  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (email) {
    if (email.length > 254) {
      errors.email = 'Email is too long';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }
  }

  const message = typeof data.message === 'string' ? data.message.trim() : '';
  if (message.length < 2) {
    errors.message = 'Message is required (at least 2 characters)';
  } else if (message.length > 5000) {
    errors.message = 'Message must be less than 5000 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Parse YYYY-MM-DD as local calendar date (avoids UTC timezone shift).
 */
function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  return date;
}

/**
 * Validate booking form data
 */
export const validateBookingForm = (data) => {
  const errors = {};

  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.length > 100) {
    errors.name = 'Valid name required (2-100 characters)';
  }

  // Phone validation (digits only — allows dots, slashes, spaces in input)
  if (!isValidPhone(typeof data.phone === 'string' ? data.phone.trim() : '')) {
    errors.phone = 'Enter a valid phone number (10-15 digits)';
  }

  // Email validation
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Valid email required';
  }

  // Service validation
  if (!data.service || typeof data.service !== 'string' || data.service.trim().length < 2 || data.service.length > 200) {
    errors.service = 'Valid service required';
  }

  // Date validation (today or future — matches available slot logic)
  const selectedDate = parseLocalDate(data.date);
  if (!selectedDate) {
    errors.date = 'Valid date is required';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.date = 'Date cannot be in the past';
    }
  }

  // Time validation
  const timeStr = String(data.time || '').trim();
  const time24 = /^([01]?\d|2[0-3]):([0-5]\d)$/.test(timeStr);
  const time12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.test(timeStr);
  if (!timeStr || (!time24 && !time12)) {
    errors.time = 'Valid time required';
  }

  // Notes validation (optional but if provided must be valid)
  if (data.notes && typeof data.notes === 'string') {
    if (data.notes.length > 1000) {
      errors.notes = 'Notes must be less than 1000 characters';
    }
  }

  // Price validation (optional but if provided must be valid)
  if (data.price && typeof data.price === 'string') {
    if (data.price.length > 100) {
      errors.price = 'Price must be less than 100 characters';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate course admission form
 */
export const validateCourseAdmission = (data) => {
  const errors = {};

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (name.length < 2 || name.length > 100) {
    errors.name = 'Valid name required (2-100 characters)';
  }

  if (!isValidPhone(typeof data.phone === 'string' ? data.phone.trim() : '')) {
    errors.phone = 'Enter a valid phone number (10-15 digits)';
  }

  const email = typeof data.email === 'string' ? data.email.trim() : '';
  if (!email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.course_id || typeof data.course_id !== 'string') {
    errors.course_id = 'Please select a course';
  }

  const batch = String(data.batch || '').trim();
  if (!batch) {
    errors.batch = 'Please select a batch preference';
  }

  const txn = String(data.transaction_id || '').trim();
  if (txn.length < 4 || txn.length > 80) {
    errors.transaction_id = 'Enter a valid Upaisa transaction ID';
  }

  const screenshot = String(data.payment_screenshot || '').trim();
  if (!screenshot) {
    errors.payment_screenshot = 'Payment screenshot is required';
  }

  const notes = typeof data.notes === 'string' ? data.notes.trim() : '';
  if (notes.length > 1000) {
    errors.notes = 'Notes must be less than 1000 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate environment variables
 */
export const validateEnv = () => {
  const required = ['EMAIL_USER', 'EMAIL_PASSWORD'];
  const missing = required.filter(key => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

/**
 * Validate request size
 */
export const validateRequestSize = (req, maxSizeBytes = 50 * 1024) => {
  const raw = req.headers['content-length'];
  if (raw === undefined || raw === null || raw === '') return true;
  const contentLength = parseInt(String(raw), 10);
  if (Number.isNaN(contentLength)) return true;
  return contentLength <= maxSizeBytes;
};
