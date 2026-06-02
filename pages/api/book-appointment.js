import nodemailer from 'nodemailer';
import { escapeHtml, sanitizeObject } from './utils/security';
import { validateBookingForm, validateEnv, validateRequestSize } from './utils/validation';
import { rateLimit } from './utils/rateLimit';
import { supabaseServer } from '../../lib/supabaseServer';
import { insert as localInsert } from '../../lib/localDb';

async function bookAppointmentHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate request size
  if (!validateRequestSize(req)) {
    return res.status(413).json({ error: 'Request payload too large' });
  }

  const body = sanitizeObject(req.body);
  const { name, phone, email, service, price, date, time, notes } = body;

  // Validate form data
  const { valid, errors } = validateBookingForm({ name, phone, email, service, date, time, notes });
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  const canSendEmail = process.env.EMAIL_USER?.trim() && process.env.EMAIL_PASSWORD?.trim();

  try {
    // Sanitize inputs
    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email);
    const safeService = escapeHtml(service);
    const safePrice = price ? escapeHtml(price) : '';
    const safeDate = escapeHtml(date);
    const safeTime = escapeHtml(time);
    const safeNotes = notes ? escapeHtml(notes) : '';

    const salonMessage = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
        <h2 style="color: #6e3b52;">New Booking Request</h2>
        <hr style="border: 1px solid #ddd;" />
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Service:</strong> ${safeService}</p>
        <p><strong>Date:</strong> ${safeDate}</p>
        <p><strong>Time:</strong> ${safeTime}</p>
        ${safeNotes ? `<p><strong>Notes:</strong></p><p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-left: 4px solid #6e3b52;">${safeNotes}</p>` : ''}
        <hr style="border: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #999;">This booking request was submitted through the Huma Beauty Saloon website.</p>
      </div>
    `;

    if (canSendEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_RECIPIENT || 'humaaqi96@gmail.com',
          subject: `New Booking Request: ${safeService}`,
          html: salonMessage,
        });

        if (email) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Booking Request Received - Huma Beauty Saloon',
            html: `
              <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
                <h2 style="color: #6e3b52;">Thank you for your booking request, ${safeName}!</h2>
                <p>We have received your booking request for <strong>${safeService}</strong> on <strong>${safeDate}</strong> at <strong>${safeTime}</strong>.</p>
                ${safeNotes ? `<p><strong>Your notes:</strong></p><p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-left: 4px solid #d4a5a5;">${safeNotes}</p>` : ''}
                <p>We will confirm your appointment via WhatsApp within 2 hours.</p>
                <hr style="border: 1px solid #ddd;" />
                <p>Best regards,<br/><strong>Huma Beauty Saloon Team</strong></p>
              </div>
            `,
          });
        }
      } catch (emailError) {
        console.error('Booking email send failed:', emailError);
      }
    } else {
      console.warn('EMAIL_USER or EMAIL_PASSWORD not configured; skipping outbound booking emails.');
    }

    const bookingPayload = {
      customer_name: safeName,
      name: safeName,
      phone: safePhone,
      email: safeEmail,
      service_title: safeService,
      service: safeService,
      price: safePrice,
      date: safeDate,
      time: safeTime,
      notes: safeNotes,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    if (supabaseServer) {
      const { error: bookingError } = await supabaseServer.from('bookings').insert([bookingPayload]);
      if (bookingError) {
        console.error('Booking DB insert error:', bookingError);
      }
    } else {
      try {
        await localInsert('bookings', bookingPayload)
      } catch (e) {
        console.error('Local booking insert failed:', e)
      }
    }

    return res.status(200).json({ success: true, message: 'Booking request received successfully' });
  } catch (error) {
    console.error('Booking request error:', error);
    return res.status(500).json({ error: 'Failed to send booking request. Please try again later.' });
  }
}

// Export with rate limiting (5 requests per minute)
export default rateLimit(bookAppointmentHandler, 5, 60000);
