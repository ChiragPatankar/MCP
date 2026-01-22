# 🔐 Google OAuth Setup Guide

## Problem: "The given origin is not allowed for the given client ID"

This error occurs because `localhost:5173` is not registered in your Google Cloud Console OAuth client configuration.

## ✅ Solution: Register Your Origin

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**

### Step 2: Configure OAuth Consent Screen

1. Click **OAuth consent screen** (left sidebar)
2. Choose **External** (unless you have a Google Workspace)
3. Fill in required fields:
   - App name: `ClientSphere`
   - User support email: Your email
   - Developer contact: Your email
4. Click **Save and Continue**
5. Skip **Scopes** (click **Save and Continue**)
6. Add test users if needed (click **Save and Continue**)
7. Review and **Back to Dashboard**

### Step 3: Add Authorized JavaScript Origins

1. Go back to **Credentials**
2. Click on your OAuth 2.0 Client ID (or create one)
3. Under **Authorized JavaScript origins**, click **+ ADD URI**
4. Add these origins:
   ```
   http://localhost:5173
   http://localhost:3000
   http://localhost:8000
   ```
   (Add your production domain when deploying)

### Step 4: Add Authorized Redirect URIs

1. Under **Authorized redirect URIs**, click **+ ADD URI**
2. Add:
   ```
   http://localhost:5173/auth/google/callback
   ```
   (Add production callback URL when deploying)

### Step 5: Update Your Client ID

1. Copy your **Client ID** from the credentials page
2. Create/update `.env.local` in your project root:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```
3. Restart your dev server:
   ```bash
   npm run dev
   ```

## 🔧 Alternative: Use Email/Password Login

If you want to skip Google OAuth for now, you can use the email/password login:

- **Admin**: `admin@clientsphere.com` / `admin123`
- **Tenant**: Any email / `password123`

## ⚠️ Common Issues

### Issue 1: "One Tap not displayed, reason: unregistered_origin"
- **Fix**: Add `http://localhost:5173` to Authorized JavaScript origins

### Issue 2: "403 Forbidden" from accounts.google.com
- **Fix**: Make sure your OAuth consent screen is published (or add yourself as a test user)

### Issue 3: Popup blocked
- **Fix**: Allow popups for localhost in your browser settings

### Issue 4: Callback page shows white screen
- **Fix**: The callback page is now implemented. Make sure you've restarted your dev server after the latest changes.

## 📝 Notes

- The app uses **Google Identity Services (GSI)** with One Tap
- If One Tap fails, it falls back to a Google Sign-In button
- The callback page (`/auth/google/callback`) handles OAuth redirects
- In production, make sure to add your production domain to authorized origins

## 🚀 Quick Test

After setup:
1. Restart dev server: `npm run dev`
2. Go to: http://localhost:5173/login
3. Click "Sign in with Google"
4. You should see the Google sign-in popup/button

If you still see errors, check the browser console (F12) for specific error messages.

