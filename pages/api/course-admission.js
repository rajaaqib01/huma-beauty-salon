import { escapeHtml, sanitizeObject } from '../../lib/apiUtils/security';
import { validateCourseAdmission, validateRequestSize } from '../../lib/apiUtils/validation';
import { rateLimit } from '../../lib/apiUtils/rateLimit';
import { insert as localInsert } from '../../lib/localDb';
import { getCourseById } from '../../lib/courses';
import { savePaymentScreenshot } from '../../lib/savePaymentScreenshot';
import { notifyAdminNewAdmission, notifyStudentAdmissionReceived } from '../../lib/notifications';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

async function courseAdmissionHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!validateRequestSize(req, 6 * 1024 * 1024)) {
    return res.status(413).json({ error: 'Request payload too large. Please use a smaller screenshot (under 5MB).' });
  }

  const rawBody = req.body || {};
  const paymentFile = rawBody.payment_file;
  const body = sanitizeObject({
    name: rawBody.name,
    phone: rawBody.phone,
    email: rawBody.email,
    age: rawBody.age,
    city: rawBody.city,
    course_id: rawBody.course_id,
    batch: rawBody.batch,
    experience: rawBody.experience,
    notes: rawBody.notes,
    transaction_id: rawBody.transaction_id,
  });

  const {
    name, phone, email, age, city, course_id, batch, experience, notes,
    transaction_id,
  } = body;

  let payment_screenshot = '';
  try {
    if (paymentFile?.data) {
      payment_screenshot = await savePaymentScreenshot(paymentFile);
    } else if (rawBody.payment_screenshot) {
      payment_screenshot = String(rawBody.payment_screenshot).trim();
    }
  } catch (uploadError) {
    return res.status(400).json({ error: uploadError.message || 'Failed to upload payment screenshot' });
  }

  const { valid, errors } = validateCourseAdmission({
    name, phone, email, course_id, batch, transaction_id, payment_screenshot, notes,
  });
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  const course = await getCourseById(course_id);
  if (!course) {
    return res.status(400).json({ error: 'Selected course is not available' });
  }

  try {
    const payload = {
      student_name: escapeHtml(name),
      name: escapeHtml(name),
      phone: escapeHtml(phone),
      email: escapeHtml(email),
      age: age ? escapeHtml(String(age)) : '',
      city: city ? escapeHtml(city) : '',
      course_id: course.id,
      course_title: escapeHtml(course.title),
      course_fee: escapeHtml(course.feeRaw || course.fee),
      batch: escapeHtml(batch),
      experience: experience ? escapeHtml(experience) : '',
      notes: notes ? escapeHtml(notes) : '',
      transaction_id: escapeHtml(transaction_id),
      payment_screenshot,
      payment_method: 'Upaisa',
      status: 'pending',
      read: false,
      source: 'online',
      created_at: new Date().toISOString(),
    };

    await localInsert('admissions', payload);

    setImmediate(async () => {
      try {
        await notifyAdminNewAdmission(payload);
        await notifyStudentAdmissionReceived(payload);
      } catch (e) {
        console.error('Post-admission notifications failed:', e.message);
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Admission application received. We will verify your payment and confirm within 24–48 hours.',
    });
  } catch (error) {
    console.error('Course admission error:', error);
    return res.status(500).json({ error: 'Failed to submit admission. Please try again or contact us on WhatsApp.' });
  }
}

export default rateLimit(courseAdmissionHandler, 5, 60000);
