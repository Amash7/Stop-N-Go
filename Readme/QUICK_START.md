# ⚡ Quick Start Guide

Get Stop N Go running in 5 minutes!

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Neon database account created
- [ ] Cloudinary account created

## 5-Step Setup

### 1️⃣ Install Dependencies (2 min)
```bash
cd /Users/amash/Desktop/StopNGo
npm install
```

### 2️⃣ Create .env File (2 min)

Create `.env` in the project root:

```env
DATABASE_URL=your_neon_connection_string_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

**Where to get credentials:**
- Neon: https://neon.tech (Database → Connection String)
- Cloudinary: https://cloudinary.com (Dashboard → Product Environment Credentials)
- Secret: https://generate-secret.vercel.app/32

### 3️⃣ Setup Database (30 sec)
```bash
npx drizzle-kit push:pg
```

### 4️⃣ Start Server (10 sec)
```bash
npm run dev
```

### 5️⃣ Create Admin Account (30 sec)

1. Visit http://localhost:3000/auth/signup
2. Create an account
3. Go to Neon dashboard → Tables → users → your account
4. Change `role` from `customer` to `admin`
5. Log out and log back in

## 🎉 You're Done!

Visit these pages:
- 🏠 Homepage: http://localhost:3000
- 📦 Products: http://localhost:3000/products
- 🎛️ Admin: http://localhost:3000/admin

## Next Steps

1. **Add Products** (as admin):
   - Go to Admin → Manage Products
   - Click "Add Product"
   - Upload image and fill details

2. **Test Customer Flow**:
   - Create a customer account
   - Browse products
   - Add to cart
   - Reserve for pickup

3. **Test VIP Circle**:
   - Sign in as customer
   - Go to VIP Circle
   - Enroll and get your number

4. **Test Order Management**:
   - Place an order as customer
   - Sign in as admin
   - Go to Manage Orders
   - Approve the order

## Common Issues

**"Database connection failed"**
→ Check DATABASE_URL is correct

**"Image upload failed"**
→ Check Cloudinary credentials

**"Cannot find module"**
→ Run `npm install` again

**Port 3000 in use**
→ Run `npm run dev -- -p 3001`

## Need Help?

1. Check SETUP_GUIDE.md for detailed instructions
2. Check README.md for full documentation
3. Review error messages in terminal

## Useful Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Update database schema
npx drizzle-kit push:pg
```

---

**That's it!** You now have a fully functional smoke shop website! 🚀

**Pro Tip:** Keep your terminal open to see logs and error messages.

