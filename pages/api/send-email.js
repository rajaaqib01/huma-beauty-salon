import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
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

    // Email to salon owner
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'humaaqi96@gmail.com',
      subject: `New Contact Form Message: ${subject || 'General Inquiry'}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #6e3b52;">New Message from Contact Form</h2>
          <hr style="border: 1px solid #ddd;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject || 'Not specified'}</p>
          <hr style="border: 1px solid #ddd;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-left: 4px solid #6e3b52;">
            ${message}
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
            <h2 style="color: #6e3b52;">Thank You, ${name}! 💄</h2>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <p>For urgent queries, please reach out to us on WhatsApp: <strong>+92 335 5462214</strong></p>
            <hr style="border: 1px solid #ddd;">
            <p><strong>Your Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-left: 4px solid #d4a5a5;">
              ${message}
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
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
