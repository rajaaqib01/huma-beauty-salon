import nodemailer from 'nodemailer';
import { escapeHtml } from './utils/security';
import { validateContactForm, validateEnv, validateRequestSize } from './utils/validation';
import { rateLimit } from './utils/rateLimit';

async function sendEmailHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate request size
  if (!validateRequestSize(req)) {
    return res.status(413).json({ error: 'Request payload too large' });
  }

  const { name, phone, email, subject, message } = req.body;

  // Validate form data
  const { valid, errors } = validateContactForm({ name, phone, email, message });
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  // Validate environment variables
  try {
    validateEnv();
  } catch (error) {
    console.error('Environment configuration error:', error);
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Sanitize inputs
    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = email ? escapeHtml(email) : 'Not provided';
    const safeSubject = escapeHtml(subject || 'Not specified');
    const safeMessage = escapeHtml(message);

    // Email to salon owner
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || 'humaaqi96@gmail.com',
      subject: `New Contact Form Message: ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #6e3b52;">New Message from Contact Form</h2>
          <hr style="border: 1px solid #ddd;">
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr style="border: 1px solid #ddd;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-left: 4px solid #6e3b52;">
            ${safeMessage}
          </p>
          <hr style="border: 1px solid #ddd;">
          <p style="font-size: 12px; color: #999;">
            This message was sent via Huma Beauty Saloon website contact form.
          </p>
        </div>
      `,
    });

    // Email to user (if email provided)
    if (email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'We Received Your Message - Huma Beauty Saloon',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
            <h2 style="color: #6e3b52;">Thank You, ${safeName}! 💄</h2>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p>For urgent queries, please reach out to us on WhatsApp: <strong>+92 335 5462214</strong></p>
            <hr style="border: 1px solid #ddd;">
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-left: 4px solid #d4a5a5;">
              ${safeMessage}
            </p>
            <hr style="border: 1px solid #ddd;">
            <p>Best regards,<br><strong>Huma Beauty Saloon Team</strong></p>
          </div>
        `,
      });
    }

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    // Don't expose error details to client
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
}

// Export with rate limiting (5 requests per minute)
export default rateLimit(sendEmailHandler, 5, 60000);
