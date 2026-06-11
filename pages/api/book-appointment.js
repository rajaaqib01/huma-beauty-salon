import { escapeHtml, sanitizeObject } from '../../lib/apiUtils/security';
import { validateBookingForm, validateRequestSize } from '../../lib/apiUtils/validation';
import { rateLimit } from '../../lib/apiUtils/rateLimit';
import { supabaseServer } from '../../lib/supabaseServer';
import { insert as localInsert } from '../../lib/localDb';
import { validateBookingSlot } from '../../lib/bookingSlots';
import { notifyAdminNewBooking, notifyCustomerBookingReceived } from '../../lib/notifications';
import { addLoyaltyPoints } from '../../lib/loyalty';
import { getSettings } from '../../lib/settings';

async function bookAppointmentHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!validateRequestSize(req)) {
    return res.status(413).json({ error: 'Request payload too large' });
  }

  const body = sanitizeObject(req.body);
  const {
    name, phone, email, service, price, date, time, notes,
    offer, discount, staff_id, staff_name, referral_code,
  } = body;

  const { valid, errors } = validateBookingForm({ name, phone, email, service, date, time, notes });
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  const slotOk = await validateBookingSlot(date, time);
  if (!slotOk) {
    return res.status(400).json({ error: 'Selected time slot is no longer available. Please choose another time.' });
  }

  const settings = await getSettings();
  let referralNote = '';
  if (referral_code?.trim() && settings.referral_code &&
      referral_code.trim().toUpperCase() === settings.referral_code.toUpperCase()) {
    referralNote = `Referral code applied: ${settings.referral_code} (${settings.referral_discount || 10}% off)`;
  }

  try {
    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email);
    const safeService = escapeHtml(service);
    const safePrice = price ? escapeHtml(price) : '';
    const safeDate = escapeHtml(date);
    const safeTime = escapeHtml(time);
    const safeOffer = offer ? escapeHtml(offer) : '';
    const safeDiscount = discount ? escapeHtml(discount) : '';
    const safeStaff = staff_name ? escapeHtml(staff_name) : '';
    const safeReferral = referral_code ? escapeHtml(referral_code) : '';
    const safeNotes = [notes, referralNote].filter(Boolean).map(escapeHtml).join(' | ');

    const bookingPayload = {
      customer_name: safeName,
      name: safeName,
      phone: safePhone,
      email: safeEmail,
      service_title: safeService,
      service: safeService,
      price: safePrice,
      offer_title: safeOffer || null,
      discount: safeDiscount || null,
      staff_id: staff_id || null,
      staff_name: safeStaff || null,
      referral_code: safeReferral || null,
      date: safeDate,
      time: safeTime,
      notes: safeNotes,
      status: 'pending',
      read: false,
      created_at: new Date().toISOString(),
    };

    if (supabaseServer) {
      const { error: bookingError } = await supabaseServer.from('bookings').insert([{
        customer_name: bookingPayload.customer_name,
        phone: bookingPayload.phone,
        email: bookingPayload.email,
        service_title: bookingPayload.service_title,
        date: bookingPayload.date,
        time: bookingPayload.time,
        notes: [
          bookingPayload.notes,
          bookingPayload.price ? `Price: ${bookingPayload.price}` : '',
          bookingPayload.offer_title ? `Offer: ${bookingPayload.offer_title}` : '',
          bookingPayload.staff_name ? `Stylist: ${bookingPayload.staff_name}` : '',
          bookingPayload.referral_code ? `Referral: ${bookingPayload.referral_code}` : '',
        ].filter(Boolean).join('\n'),
        status: bookingPayload.status,
      }]);
      if (bookingError) {
        console.error('Booking DB insert error:', bookingError);
        return res.status(500).json({ error: 'Failed to save booking. Please try again or contact us on WhatsApp.' });
      }
    } else {
      try {
        await localInsert('bookings', bookingPayload);
      } catch (e) {
        console.error('Local booking insert failed:', e);
        return res.status(500).json({ error: 'Failed to save booking. Please try again or contact us on WhatsApp.' });
      }
    }

    setImmediate(async () => {
      try {
        await notifyAdminNewBooking(bookingPayload);
        await notifyCustomerBookingReceived(bookingPayload);
        const pts = parseInt(settings.loyalty_points_per_booking || '10', 10) || 10;
        await addLoyaltyPoints(safePhone, pts);
      } catch (e) {
        console.error('Post-booking notifications failed:', e.message);
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Booking request received successfully. We will confirm within 2 hours.',
    });
  } catch (error) {
    console.error('Booking request error:', error);
    return res.status(500).json({ error: 'Failed to send booking request. Please try again later.' });
  }
}

export default rateLimit(bookAppointmentHandler, 5, 60000);
