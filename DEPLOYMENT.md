# Firebase Deployment Guide

## Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created at https://console.firebase.google.com

## Step 1: Build the Project

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

## Step 2: Initialize Firebase (First Time Only)

```bash
firebase login
firebase init hosting
```

**Configuration:**
- Select your Firebase project
- Public directory: **`.next`** (NOT `out` or `public`)
- Configure as single-page app: **No**
- Set up automatic builds with GitHub: **No** (for now)
- Overwrite existing files: **No**

## Step 3: Configure Firebase Hosting

Edit `firebase.json`:

```json
{
  "hosting": {
    "public": ".next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Step 4: Deploy

```bash
firebase deploy --only hosting
```

Your site will be live at: `https://YOUR-PROJECT-ID.web.app`

---

## Admin Login Setup

### Option 1: Register via Admin Page (Recommended)
1. Go to `https://YOUR-SITE.web.app/admin/login`
2. Enter your email and password
3. Click **"Register (First Time)"**
4. You'll be automatically logged in

### Option 2: Create User via Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Users**
4. Click **"Add User"**
5. Enter email and password
6. Use these credentials on `/admin/login`

---

## Important Notes

⚠️ **Security Rules**: Make sure to configure Firestore security rules in Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{project} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

⚠️ **Environment Variables**: Verify that all Firebase config is set in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
...
```

---

## Quick Deploy Script

Create `deploy.sh`:
```bash
#!/bin/bash
npm run build && firebase deploy --only hosting
```

Run: `bash deploy.sh`
