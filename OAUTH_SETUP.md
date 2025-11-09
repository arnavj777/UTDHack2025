# OAuth Setup Instructions

This guide will help you set up OAuth authentication for Google and GitHub.

## Prerequisites

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   ```

2. Create OAuth applications on Google and GitHub

## Google OAuth Setup

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/
   - Create a new project or select an existing one

2. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:8000/accounts/google/login/callback/`
     - `http://127.0.0.1:8000/accounts/google/login/callback/`
   - Copy the **Client ID** and **Client Secret**

4. **Add to `.env` file**:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

## GitHub OAuth Setup

1. **Go to GitHub Developer Settings**:
   - Visit: https://github.com/settings/developers
   - Click "New OAuth App"

2. **Create OAuth App**:
   - **Application name**: ProductAI (or your app name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:8000/accounts/github/login/callback/`
   - Click "Register application"

3. **Copy Credentials**:
   - Copy the **Client ID**
   - Generate a new **Client Secret** and copy it

4. **Add to `.env` file**:
   ```
   GITHUB_CLIENT_ID=your-github-client-id-here
   GITHUB_CLIENT_SECRET=your-github-client-secret-here
   ```

## Complete `.env` File

Your `.env` file should include:

```env
# Django Settings
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Testing OAuth

1. **Restart your Django server** after updating `.env`

2. **Test Google OAuth**:
   - Go to `/login` page
   - Click "Continue with Google"
   - You should be redirected to Google login
   - After login, you'll be redirected back to your app

3. **Test GitHub OAuth**:
   - Go to `/login` page
   - Click "Continue with GitHub"
   - You should be redirected to GitHub login
   - After login, you'll be redirected back to your app

## Production Setup

For production, update the redirect URIs in your OAuth apps:

- **Google**: Add your production domain callback URL
- **GitHub**: Update the Authorization callback URL to your production domain

Also update `LOGIN_REDIRECT_URL` in `backend/settings.py` to your production URL.

## Troubleshooting

- **"Invalid redirect URI"**: Make sure the callback URL in your OAuth app matches exactly
- **"Client ID not found"**: Check that your `.env` file has the correct credentials
- **"CSRF token missing"**: Make sure CORS and CSRF settings are configured correctly

