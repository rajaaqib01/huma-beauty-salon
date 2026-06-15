# Email Configuration Instructions

## ✅ What's Been Set Up

Your contact form sends emails to the address in `EMAIL_RECIPIENT` when users submit messages.

## 🔐 Required Setup (IMPORTANT!)

To enable email sending, you need to generate a Gmail app password:

### Step-by-Step Instructions:

1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com/
   - Click "Security" in the left menu
   - Scroll down to "2-Step Verification"
   - Follow the prompts to enable it

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" from the dropdown
   - Select "Windows Computer" (or your device type)
   - Click "Generate"
   - Google will show a 16-character password

3. **Add to Netlify / `.env.local` (never commit real values):**
   - `EMAIL_USER=your-salon@gmail.com`
   - `EMAIL_PASSWORD=your-16-char-app-password`
   - `EMAIL_RECIPIENT=your-inbox@gmail.com`
   - `ADMIN_EMAIL=your-admin@email.com`
   - `ADMIN_PASSWORD=your-strong-admin-password`

4. **Restart Development Server (local only):**
   ```bash
   npm run dev
   ```

## 📧 What Happens When User Submits Form

✓ Email sent to `EMAIL_RECIPIENT` (with user's message)  
✓ If user provides email: They get a confirmation email  
✓ User sees "Message Sent!" success page

## 🧪 Test It

1. Go to `/contact` page
2. Fill out the form
3. Click "Send Message"
4. Should see success message
5. Check your `EMAIL_RECIPIENT` inbox for the email

## ⚠️ Troubleshooting

- **"Error sending email"**: Check if `EMAIL_PASSWORD` is set correctly in Netlify env vars or `.env.local`
- **No email received**: Make sure 2-Factor Authentication is enabled
- **"Invalid app password"**: Generate a new one from Google Account settings
- **Server still not sending?**: Restart the dev server after updating `.env.local`

## 📝 Files Modified

- `/pages/api/send-email.js` - Backend API endpoint
- `/pages/contact.js` - Frontend form with email sending
- `.env.local` - Email configuration (keep this secret — do not commit)
