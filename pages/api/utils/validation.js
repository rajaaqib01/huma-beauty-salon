// pages/api/utils/validation.js

/**
 * Validate contact form data
 */
export const validateContactForm = (data) => {
  const errors = {};

  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2 || data.name.length > 100) {
    errors.name = 'Name must be 2-100 characters';
  }

  // Phone validation (Pakistani format support)
  if (!data.phone || typeof data.phone !== 'string') {
    errors.phone = 'Phone is required';
  } else if (!/^[\d\s\-\+\(\)]{7,20}$/.test(data.phone)) {
    errors.phone = 'Invalid phone format';
  }

  // Email validation (optional but if provided must be valid)
  if (data.email && typeof data.email === 'string') {
    if (data.email.length > 254) {
      errors.email = 'Email is too long';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
  }

  // Message validation
  if (!data.message || typeof data.message !== 'string') {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 5 || data.message.length > 5000) {
    errors.message = 'Message must be 5-5000 characters';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate booking form data
 */
export const validateBookingForm = (data) => {
  const errors = {};

  // Name validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.length > 100) {
    errors.name = 'Valid name required (2-100 characters)';
  }

  // Phone validation
  if (!data.phone || typeof data.phone !== 'string' || !/^[\d\s\-\+\(\)]{7,20}$/.test(data.phone)) {
    errors.phone = 'Valid phone required';
  }

  // Email validation
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Valid email required';
  }

  // Service validation
  if (!data.service || typeof data.service !== 'string' || data.service.length < 2 || data.service.length > 100) {
    errors.service = 'Valid service required';
  }

  // Date validation (must be future date)
  if (!data.date || typeof data.date !== 'string') {
    errors.date = 'Date is required';
  } else {
    const selectedDate = new Date(data.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (selectedDate < tomorrow) {
      errors.date = 'Date must be in the future';
    }
  }

  // Time validation
  if (!data.time || typeof data.time !== 'string' || !/^\d{2}:\d{2}/.test(data.time)) {
    errors.time = 'Valid time required';
  }

  // Notes validation (optional but if provided must be valid)
  if (data.notes && typeof data.notes === 'string') {
    if (data.notes.length > 1000) {
      errors.notes = 'Notes must be less than 1000 characters';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
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
  const contentLength = parseInt(req.headers['content-length'] || 0);
  return contentLength <= maxSizeBytes;
};
