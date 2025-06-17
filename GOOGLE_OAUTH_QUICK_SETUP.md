# 🚀 Google OAuth Setup - 5 Minute Guide

## 📍 **You Are Here: Google Cloud Console**

### **Step 1: Configure OAuth Consent Screen** 
🔗 **Direct Link**: https://console.cloud.google.com/apis/credentials/consent

1. **Choose User Type**:
   - Select "External" (for public app)
   - Click "Create"

2. **Fill Required Fields**:
   ```
   App name: MCP Chat Support
   User support email: [your-email]
   Developer contact: [your-email]
   ```

3. **Click "Save and Continue"** through all steps
   - Scopes: Skip (default is fine)
   - Test users: Skip (not needed for external)
   - Summary: Click "Back to Dashboard"

---

### **Step 2: Create OAuth Credentials**
🔗 **Direct Link**: https://console.cloud.google.com/apis/credentials

1. **Click "Create Credentials"** → **"OAuth 2.0 Client IDs"**

2. **Configure Application**:
   ```
   Application type: Web application
   Name: MCP Chat Frontend
   
   Authorized JavaScript origins:
   http://localhost:5173
   
   Authorized redirect URIs:
   http://localhost:5173/auth/google/callback
   ```

3. **Click "Create"** → **Copy the Client ID**

---

### **Step 3: Add to Your Project**

1. **Open .env.local** in your project
2. **Replace the placeholder**:
   ```env
   VITE_GOOGLE_CLIENT_ID=paste_your_real_client_id_here
   ```
3. **Restart dev server**: `npm run dev`

---

## ✅ **Test Authentication**

1. Go to: http://localhost:5173/login
2. Click "Sign in with Google"
3. Should show Google login popup
4. Complete auth flow → Success! 🎉

---

## 🔧 **No API Enablement Needed!**

Unlike other Google services, OAuth authentication works without enabling specific APIs. You just need:
- ✅ OAuth Consent Screen configured  
- ✅ OAuth 2.0 Client ID created
- ✅ Client ID in your environment variables

That's it! No "Cloud Identity API" or other APIs required. 