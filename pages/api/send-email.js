import nodemailer from 'nodemailer';
import { escapeHtml, sanitizeObject } from '../../lib/apiUtils/security';
import { validateContactForm, validateRequestSize } from '../../lib/apiUtils/validation';
import { rateLimit } from '../../lib/apiUtils/rateLimit';
import { supabaseServer } from '../../lib/supabaseServer'
import { insert as localInsert } from '../../lib/localDb'

const SEND_EMAIL_RATE_LIMIT = 12;
const SEND_EMAIL_WINDOW_MS = 60 * 1000; // 1 minute

async function sendEmailHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate request size
  if (!validateRequestSize(req)) {
    return res.status(413).json({ error: 'Request payload too large' });
  }

  const body = sanitizeObject(req.body);
  const { name, phone, email, subject, message } = body;

  // Validate form data
  const { valid, errors } = validateContactForm({ name, phone, email, message });
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPassword = process.env.EMAIL_PASSWORD?.trim();
  const emailRecipient = process.env.EMAIL_RECIPIENT?.trim() || 'humaaqi96@gmail.com';

  // Sanitize inputs
  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = email ? escapeHtml(email) : 'Not provided';
  const safeSubject = escapeHtml(subject || 'Not specified');
  const safeMessage = escapeHtml(message);

  const msgObj = {
    name: safeName,
    phone: safePhone,
    email: safeEmail === 'Not provided' ? null : safeEmail,
    subject: safeSubject,
    message: safeMessage,
    created_at: new Date().toISOString(),
    status: 'new'
  }

  // Persist message (Supabase if available, else local JSON)
  let persisted = false
  try{
    if(supabaseServer){
      await supabaseServer.from('messages').insert([{ ...msgObj }])
      persisted = true
    } else {
      await localInsert('messages', msgObj)
      persisted = true
    }
  } catch (e){
    console.error('Message persistence error:', e)
    persisted = false
  }

  try {
    // Only attempt to send email if credentials are configured
    const canSendEmail = Boolean(emailUser && emailPassword)
    if (canSendEmail) {
      try {
        // Create a transporter using Gmail
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailUser,
            pass: emailPassword,
          },
        });

        // Verify the transporter before sending the message
        await transporter.verify();

        // Email to salon owner
        await transporter.sendMail({
          from: emailUser,
          to: emailRecipient,
          subject: `New Contact Form Message: ${safeSubject}`,
          html: `\n            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">\n              <h2 style="color: #6e3b52;">New Message from Contact Form</h2>\n              <hr style="border: 1px solid #ddd;">\n              <p><strong>Name:</strong> ${safeName}</p>\n              <p><strong>Phone:</strong> ${safePhone}</p>\n              <p><strong>Email:</strong> ${safeEmail}</p>\n              <p><strong>Subject:</strong> ${safeSubject}</p>\n              <hr style="border: 1px solid #ddd;">\n              <p><strong>Message:</strong></p>\n              <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-left: 4px solid #6e3b52;">\n                ${safeMessage}\n              </p>\n              <hr style="border: 1px solid #ddd;">\n              <p style="font-size: 12px; color: #999;">\n                This message was sent via Huma Beauty Saloon website contact form.\n              </p>\n            </div>\n          `,
        });

        // Email to user (if email provided)
        if (email) {
          await transporter.sendMail({
            from: emailUser,
            to: email,
            subject: 'We Received Your Message - Huma Beauty Saloon',
            html: `\n              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">\n                <h2 style="color: #6e3b52;">Thank You, ${safeName}! 💄</h2>\n                <p>We have received your message and will get back to you within 24 hours.</p>\n                <p>For urgent queries, please reach out to us on WhatsApp: <strong>+92 335 5462214</strong></p>\n                <hr style="border: 1px solid #ddd;">\n                <p><strong>Your Message:</strong></p>\n                <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-left: 4px solid #d4a5a5;">\n                  ${safeMessage}\n                </p>\n                <hr style="border: 1px solid #ddd;">\n                <p>Best regards,<br><strong>Huma Beauty Saloon Team</strong></p>\n              </div>\n            `,
          });
        }
      } catch (e) {
        console.error('Email send failed:', e)
      }
    }

    if (persisted) {
      return res.status(200).json({ success: true, message: canSendEmail ? 'Message saved and email sent (if configured)' : 'Message saved (email not configured)' })
    }
    // If persistence failed, return server error
    return res.status(500).json({ error: 'Failed to persist message. Please try again later.' })
  } catch (error) {
    console.error('Email sending error:', error);
    // Don't expose error details to client
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
}

// Export with rate limiting (12 requests per minute)
export default rateLimit(sendEmailHandler, SEND_EMAIL_RATE_LIMIT, SEND_EMAIL_WINDOW_MS);
