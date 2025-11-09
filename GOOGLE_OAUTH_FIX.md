# Fix: "Access blocked: ProductAI can only be used within its organization"

## Problem
You're seeing the error: "Access blocked: ProductAI can only be used within its organization"

This happens when your Google OAuth app is configured as "Internal" instead of "External".

## Solution

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/apis/credentials
2. Make sure you're in the correct project

### Step 2: Edit Your OAuth Client
1. Find your OAuth 2.0 Client ID: `946685469191-c1bs660afpbf2ca36btjpoehbds01eto.apps.googleusercontent.com`
2. Click the **pencil icon** (Edit) next to it

### Step 3: Change User Type
1. Look for **"User type"** or **"Application type"** section
2. Change from **"Internal"** to **"External"**
3. Click **"Save"**

### Step 4: Configure Publishing Status
1. If you see **"Publishing status"**, you have two options:

   **Option A: Testing (Recommended for development)**
   - Set status to **"Testing"**
   - Click **"Add Users"** under "Test users"
   - Add your Google email address(es) that will be used for testing
   - Click **"Save"**

   **Option B: In production (For public use)**
   - Set status to **"In production"**
   - This makes it available to all Google users
   - You may need to complete OAuth consent screen verification

### Step 5: Verify Redirect URIs
Make sure these redirect URIs are added:
- `http://localhost:8000/accounts/google/login/callback/`
- `http://127.0.0.1:8000/accounts/google/login/callback/`

### Step 6: Save and Test
1. Click **"Save"** at the bottom
2. Wait a few minutes for changes to propagate
3. Try logging in again at `http://localhost:3000/login`

## Alternative: Quick Fix for Testing
If you just need to test quickly:
1. Set the app to **"External"**
2. Set publishing status to **"Testing"**
3. Add your email as a test user
4. This allows you to test immediately without verification

## Notes
- Changes may take a few minutes to take effect
- If you're using a Google Workspace account, you might need admin approval
- For production, you'll eventually need to complete OAuth consent screen verification

