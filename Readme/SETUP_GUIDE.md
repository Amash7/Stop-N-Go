# 🚀 Stop N Go - Complete Setup Guide

This guide will walk you through setting up the Stop N Go website from scratch.

## Step 1: Prerequisites

Make sure you have installed:
- Node.js 18 or higher ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))
- A code editor like VS Code ([Download](https://code.visualstudio.com/))

## Step 2: Get Your Credentials

You'll need accounts for two services:

### 2.1 Neon PostgreSQL Database (FREE)

1. Visit [https://neon.tech](https://neon.tech)
2. Click "Sign Up" (you can use GitHub or Google)
3. Create a new project:
   - Project name: "StopNGo" (or any name)
   - Region: Choose closest to your location
   - PostgreSQL version: 15 (or latest)
4. Once created, click "Connection string"
5. Copy the connection string (looks like: `postgresql://username:password@host/database`)
6. Save it - you'll need this later!

### 2.2 Cloudinary for Images (FREE)

1. Visit [https://cloudinary.com](https://cloudinary.com)
2. Click "Sign Up" for free
3. Fill in your details
4. Once logged in, go to Dashboard
5. You'll see:
   - **Cloud Name** (e.g., "dzabc123")
   - **API Key** (e.g., "123456789012345")
   - **API Secret** (click "reveal" to see it)
6. Copy all three - you'll need them!

## Step 3: Setup the Project

### 3.1 Install Dependencies

Open Terminal (Mac) or Command Prompt (Windows) and run:

```bash
cd /Users/amash/Desktop/StopNGo
npm install
```

This will take a few minutes. You'll see a lot of text scrolling - that's normal!

### 3.2 Create Environment Variables

1. In the project folder, create a new file called `.env`
2. Copy and paste this template:

```env
# Database - Paste your Neon connection string here
DATABASE_URL=postgresql://username:password@host/database

# Cloudinary - Paste your Cloudinary details here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth Secret - Use the one generated below
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

3. Replace the placeholders with your actual credentials:
   - Replace `DATABASE_URL` with your Neon connection string
   - Replace Cloudinary values with your Cloud Name, API Key, and API Secret
   - For `NEXTAUTH_SECRET`, visit [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32) and paste the generated secret

4. Save the file

## Step 4: Setup the Database

Run these commands one by one:

```bash
# Generate database schema
npx drizzle-kit generate:pg

# Push schema to database
npx drizzle-kit push:pg
```

You should see messages saying the tables were created successfully.

## Step 5: Create Your Admin Account

You have two options:

### Option A: Using the Website (Easier)

1. Start the development server (see Step 6)
2. Go to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
3. Create an account with your details
4. Go to your Neon dashboard
5. Click "Tables" → "users" → find your user
6. Change the `role` field from `customer` to `admin`
7. Save changes
8. Log out and log back in

### Option B: Using SQL (Advanced)

1. Go to your Neon dashboard
2. Click "SQL Editor"
3. Paste this query (replace email and password):

```sql
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@stopngo.com',
  '$2a$10$YourHashedPassword', -- You need to hash this first!
  'Admin Name',
  'admin'
);
```

Note: You'll need to hash your password using bcryptjs first. Option A is easier!

## Step 6: Run the Website

Start the development server:

```bash
npm run dev
```

You should see:

```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

## Step 7: Test Everything

### Test Customer Features:

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Sign Up" and create a customer account
3. Browse products (there won't be any yet)
4. Join VIP Circle (click "VIP Circle" in menu)

### Test Admin Features:

1. Log in with your admin account
2. Click "Admin Dashboard"
3. Try adding a product:
   - Click "Manage Products"
   - Click "Add Product"
   - Fill in details and upload an image
   - Save
4. View your new product on the main products page
5. Test placing an order as a customer
6. Go to "Manage Orders" and approve it

## Step 8: Add Your First Products

As an admin:

1. Go to Admin Dashboard
2. Click "Manage Products"
3. Click "Add Product"
4. Fill in:
   - Name (e.g., "Blue Dream Vape")
   - Description
   - Price (e.g., 29.99)
   - Quantity (e.g., 10)
   - Category (e.g., "Vapes")
   - Upload an image
5. Click "Create Product"

Repeat for multiple products to build your catalog!

## Troubleshooting

### Issue: "Database connection failed"
- **Solution**: Check your `DATABASE_URL` in `.env` is correct
- Make sure you copied the entire connection string from Neon
- Try visiting your Neon dashboard to ensure the database is running

### Issue: "Image upload failed"
- **Solution**: Check your Cloudinary credentials in `.env`
- Make sure you revealed and copied the API Secret
- Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` doesn't have quotes

### Issue: "Cannot find module"
- **Solution**: Run `npm install` again
- Delete `node_modules` folder and run `npm install` again

### Issue: "Port 3000 already in use"
- **Solution**: Kill the process using port 3000
- Or use a different port: `npm run dev -- -p 3001`

### Issue: "Admin account not working"
- **Solution**: Make sure the role is exactly `admin` (lowercase)
- Log out completely and log back in
- Clear your browser cookies

## Next Steps

Once everything is working:

1. **Add Products**: Build your product catalog
2. **Test Orders**: Place test orders and approve them
3. **Customize**: Update colors or text to match your brand
4. **Deploy**: When ready, deploy to Vercel (see README.md)

## Getting Help

If you're stuck:

1. Check the error messages carefully
2. Review this guide step by step
3. Make sure all environment variables are set correctly
4. Try restarting the development server

## Important Notes

- ⚠️ Never commit your `.env` file to git (it's already in `.gitignore`)
- ⚠️ Keep your database and Cloudinary credentials secret
- ⚠️ Use a strong password for your admin account
- ✅ The website works best on Chrome, Firefox, or Safari
- ✅ You can access it from your phone using your computer's IP address

## Quick Reference

**Start development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
npm start
```

**Reset database (caution!):**
```bash
npx drizzle-kit push:pg --force
```

---

You're all set! Enjoy your new Stop N Go website! 🎉

