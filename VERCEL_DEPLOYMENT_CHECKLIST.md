# ✅ Vercel Deployment Checklist

## Critical Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

### Required Variables:
```
DATABASE_URL=your_neon_postgresql_connection_string
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=https://your-app-name.vercel.app  ⚠️ MUST be your Vercel URL, NOT localhost!
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 🔥 MOST COMMON ISSUE:
**Your local `.env` has `NEXTAUTH_URL=http://localhost:3000` - this is CORRECT for local development**
**But in Vercel, you MUST set `NEXTAUTH_URL=https://your-actual-app-name.vercel.app`**

## ⚠️ Important Notes

1. **NEXTAUTH_URL**: Must match your Vercel deployment URL exactly
   - Format: `https://your-app-name.vercel.app` (no trailing slash)
   - Update this if you add a custom domain later

2. **NEXTAUTH_SECRET**: Must be the same across all environments
   - Generate using: `openssl rand -base64 32`
   - Or visit: https://generate-secret.vercel.app/32

3. **Environment Variables Scope**:
   - Set for **Production**, **Preview**, and **Development**
   - Or at least set for **Production**

## 🔧 Troubleshooting Auth Issues on Vercel

### If authentication doesn't work:

1. **Check Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify all variables are set, especially:
     - `NEXTAUTH_SECRET` (must not be empty)
     - `NEXTAUTH_URL` (must be your exact Vercel URL)

2. **Verify NEXTAUTH_URL Format**:
   - Should be: `https://your-app.vercel.app`
   - NOT: `https://your-app.vercel.app/`
   - NOT: `http://your-app.vercel.app`

3. **Redeploy After Adding Variables**:
   - After adding/updating environment variables, redeploy
   - Vercel Dashboard → Deployments → Click "..." → Redeploy

4. **Check Browser Console**:
   - Open DevTools → Console
   - Look for errors related to `/api/auth/session` or cookies

5. **Check Database Connection**:
   - Verify `DATABASE_URL` is correct
   - Neon database should allow connections from anywhere (no IP restriction)

6. **Check Vercel Function Logs**:
   - Vercel Dashboard → Deployments → Select deployment → Functions
   - Look for errors in `/api/auth/[...nextauth]` function

## 📝 Quick Fix Steps

1. **Update NEXTAUTH_URL**:
   ```bash
   # In Vercel Dashboard → Environment Variables
   NEXTAUTH_URL=https://your-actual-app-name.vercel.app
   ```

2. **Verify NEXTAUTH_SECRET exists**:
   ```bash
   # Make sure this is set in Vercel
   NEXTAUTH_SECRET=your_secret_here
   ```

3. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Select "Redeploy"

4. **Test Again**:
   - Clear browser cookies for your domain
   - Try signing in again

## 🎯 Common Issues

**Issue**: "Error: NEXTAUTH_SECRET not set"
- **Fix**: Add `NEXTAUTH_SECRET` environment variable in Vercel

**Issue**: "Redirect loop on sign in"
- **Fix**: Set `NEXTAUTH_URL` to your exact Vercel domain

**Issue**: "Session not persisting"
- **Fix**: Check that `NEXTAUTH_URL` matches your deployment URL exactly

**Issue**: "Database connection failed"
- **Fix**: Verify `DATABASE_URL` is correct and database allows connections

