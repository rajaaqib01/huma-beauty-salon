# Email Configuration Instructions

## ✅ What's Been Set Up

Your contact form will now send emails to `humaaqi96@gmail.com` when users submit messages.

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

3. **Add to .env.local:**
   - Open the `.env.local` file in your project root
   - Replace `XXXXXXXXXXXXXX` with the 16-character password from Google
   - Example: `EMAIL_PASSWORD=abcd efgh ijkl mnop`
   - Keep the spaces in the password if provided by Google

4. **Restart Development Server:**
   ```bash
   npm run dev
   ```

## 📧 What Happens When User Submits Form

✓ Email sent to: `humaaqi96@gmail.com` (with user's message)
✓ If user provides email: They get a confirmation email
✓ User sees "Message Sent!" success page

## 🧪 Test It

1. Go to `/contact` page
2. Fill out the form
3. Click "Send Message"
4. Should see success message
5. Check `humaaqi96@gmail.com` for the email

## ⚠️ Troubleshooting

- **"Error sending email"**: Check if `EMAIL_PASSWORD` is set correctly in `.env.local`
- **No email received**: Make sure 2-Factor Authentication is enabled
- **"Invalid app password"**: Generate a new one from Google Account settings
- **Server still not sending?**: Restart the dev server after updating `.env.local`

## 📝 Files Modified

- `/pages/api/send-email.js` - Backend API endpoint
- `/pages/contact.js` - Frontend form with email sending
- `.env.local` - Email configuration (keep this secret!)
