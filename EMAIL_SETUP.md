# Email Setup Instructions

To send actual emails (instead of printing to console), you need to configure SMTP settings.

## Option 1: Gmail SMTP (Recommended for Development)

1. **Enable 2-Step Verification** on your Google Account:
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. **Create an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "ProductAI" as the name
   - Click "Generate"
   - Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

3. **Create a `.env` file** in the project root:
   ```bash
   cd /Users/yogansh.agarwal/Documents/GitHub/UTDHack2025
   cp .env.example .env
   ```

4. **Edit the `.env` file** and add your Gmail credentials:
   ```
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-16-character-app-password
   DEFAULT_FROM_EMAIL=your-email@gmail.com
   ```

5. **Restart the Django server** for changes to take effect.

## Option 2: Other SMTP Providers

For other email providers (Outlook, Yahoo, etc.), update the `.env` file:

```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.office365.com  # For Outlook
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@outlook.com
EMAIL_HOST_PASSWORD=your-password
DEFAULT_FROM_EMAIL=your-email@outlook.com
```

## Option 3: Console Backend (Development Only)

If you just want to see emails in the console (for testing), remove EMAIL_HOST_USER and EMAIL_HOST_PASSWORD from `.env`, and emails will be printed to the Django server console.

## Testing

After configuration, test by:
1. Go to `/forgot-password` page
2. Enter an email address
3. Check your email inbox (or console if using console backend)
4. You should receive a password reset email

