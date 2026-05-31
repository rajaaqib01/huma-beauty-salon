// pages/api/utils/rateLimit.js

const requestCounts = new Map();

/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests per IP
 */
export const rateLimit = (handler, limit = 5, windowMs = 60000) => {
  return async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();

    // Initialize or get existing request timestamps for this IP
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip);
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(t => now - t < windowMs);

    // Check if limit exceeded
    if (validTimestamps.length >= limit) {
      const retryAfterSeconds = Math.ceil((windowMs - (now - validTimestamps[0])) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        error: `Too many requests. Please wait ${retryAfterSeconds} second${retryAfterSeconds === 1 ? '' : 's'} and try again.`
      });
    }

    // Add current request timestamp
    validTimestamps.push(now);
    requestCounts.set(ip, validTimestamps);

    // Clean up very old entries to prevent memory leak
    if (validTimestamps.length === 0) {
      requestCounts.delete(ip);
    }

    return handler(req, res);
  };
};

/**
 * Clear rate limit cache periodically
 */
export const clearOldEntries = () => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  for (const [ip, timestamps] of requestCounts.entries()) {
    const validTimestamps = timestamps.filter(t => now - t < maxAge);
    if (validTimestamps.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, validTimestamps);
    }
  }
};

// Run cleanup every hour
if (typeof window === 'undefined') {
  setInterval(clearOldEntries, 60 * 60 * 1000);
}
