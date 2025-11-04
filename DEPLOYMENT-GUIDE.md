# SVASTHA - COMPLETE PRODUCTION WEBSITE
# This is a comprehensive guide to deploy your complete Svastha website

## PROJECT STRUCTURE

```
svastha-project/
├── frontend/
│   ├── index.html (Main page)
│   ├── dashboard.html (After login)
│   ├── style.css (Styling)
│   └── script.js (Frontend logic)
├── backend/
│   ├── server.js (Node.js backend)
│   ├── .env (Environment variables)
│   ├── package.json (Dependencies)
│   └── routes/
│       ├── auth.js (Authentication)
│       ├── mood.js (Mood tracking)
│       ├── emergency.js (Emergency call)
│       └── bhishma.js (AI chatbot)
├── vercel.json (Deployment config)
└── README.md (Instructions)
```

## STEP 1: CREATE VERCEL ACCOUNT & SETUP

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Create new project
4. Connect your GitHub repo

## STEP 2: ENVIRONMENT VARIABLES

Create `.env` file in backend folder:

```
# Firebase
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Gemini AI (for BHISHMA)
GEMINI_API_KEY=your_gemini_api_key

# JWT
JWT_SECRET=your_random_secret_key_here

# URLs
FRONTEND_URL=https://svastha.in
BACKEND_URL=https://api.svastha.in
```

## STEP 3: DEPLOY ON VERCEL

### Option A: Using GitHub (Recommended)

```bash
# 1. Create GitHub repo
git init
git add .
git commit -m "Deploy: Svastha production website"
git push -u origin main

# 2. On Vercel dashboard
# - Click "New Project"
# - Select your GitHub repo
# - Configure environment variables
# - Click Deploy
```

### Option B: Deploy from Local Machine

```bash
npm install -g vercel
vercel --prod
# Follow prompts
# Add environment variables in dashboard
```

## STEP 4: ADD CUSTOM DOMAIN

1. In Vercel dashboard → Settings → Domains
2. Add domain: svastha.in
3. Update DNS records:

```
Type: A Record
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. Wait 5-10 minutes for SSL certificate generation
5. HTTPS enabled automatically ✅

## STEP 5: SETUP FIREBASE

1. Go to: https://console.firebase.google.com
2. Create new project: "Svastha"
3. Enable Authentication:
   - Email/Password
   - Google Sign-In
4. Create Firestore Database (Production mode)
5. Copy credentials to .env

## STEP 6: SETUP GOOGLE OAUTH

1. Go to: https://console.cloud.google.com
2. Create new project: "Svastha OAuth"
3. Create OAuth 2.0 Credentials
4. Authorized redirect URIs:
   - http://localhost:3000/auth/callback
   - https://svastha.in/auth/callback
   - https://api.svastha.in/auth/callback
5. Copy Client ID & Secret to .env

## STEP 7: SETUP TWILIO

1. Go to: https://www.twilio.com
2. Create account
3. Get phone number
4. Copy Account SID, Auth Token, Phone to .env

## STEP 8: SETUP GEMINI API

1. Go to: https://makersuite.google.com/app/apikey
2. Create new API key
3. Add to .env as GEMINI_API_KEY

## VERIFICATION CHECKLIST

✅ Frontend loads at https://svastha.in
✅ Login page with light blue background
✅ Text bold and black
✅ Login icon in top-right
✅ Click login → Modal opens
✅ Email login works
✅ Google login works
✅ Demo mode works
✅ Dashboard loads
✅ Mood Tracker card visible
✅ Camera opens on click
✅ AI detects emotions
✅ Emergency Call card visible
✅ Emergency call triggers
✅ BHISHMA chatbot works
✅ No console errors
✅ HTTPS lock visible
✅ Mobile responsive
✅ Works on all browsers

## DEPLOYMENT COSTS

- Vercel Frontend: FREE
- Firebase: FREE (with limits)
- Twilio: Pay-as-you-go ($0.01-0.05 per call)
- Custom domain: $12/year
- Total monthly: ~$0-5 (with free tier)

## SUPPORT & TROUBLESHOOTING

### Issue: Firebase auth not working
- Check Firebase config in .env
- Verify API key is correct
- Check authorized domains in Firebase console

### Issue: Google login not working
- Verify Client ID is correct
- Check redirect URIs in Google Cloud Console
- Clear browser cache and try again

### Issue: Camera not opening
- Grant camera permission
- Try in Chrome (most compatible)
- Check browser console for errors

### Issue: Emergency call not working
- Verify Twilio credentials in .env
- Check phone number format
- Test in Chrome on desktop first

### Issue: BHISHMA AI not responding
- Verify Gemini API key is correct
- Check API usage limits
- Verify backend is running

## NEXT STEPS

1. Download all project files
2. Create GitHub repo
3. Push to GitHub
4. Connect to Vercel
5. Configure environment variables
6. Add custom domain
7. Test all features
8. Go LIVE! 🚀

Good luck with your submission!