# 🚬 Stop N Go - Smoke & Convenience Store

A modern, full-featured e-commerce platform for Stop N Go smoke shop in Chicopee, MA. Built with Next.js 14, TypeScript, PostgreSQL (Neon), and Cloudinary.

![Stop N Go Logo](./stopNgo.png)

## ✨ Features

### Customer Features
- 🛒 **Product Catalog** - Browse products by category with real-time inventory
- 🛍️ **Shopping Cart** - Add items to cart with quantity management
- 📦 **Reserve for Pickup** - Book products online, pay in-store (no online payments)
- ⭐ **VIP Circle Program** - Exclusive loyalty rewards every 10 approved orders
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 👤 **User Accounts** - Secure authentication and order history

### Admin Features
- 📊 **Analytics Dashboard** - Monthly sales chart (approved vs discarded)
- 📦 **Product Management** - Add, edit, delete products with Cloudinary image upload
- 🎯 **Order Management** - Approve or discard orders with inventory restoration
- 💬 **Admin Notes** - Add custom messages for VIP rewards or special offers
- 👥 **Customer Management** - View all customers and VIP member stats
- 🔒 **Secure Admin Panel** - Protected routes with role-based access

### VIP Circle Program
- Members receive a unique VIP number upon enrollment
- Earn rewards after every 10 approved orders
- Admin can add personalized reward notes
- Progress tracking and milestone notifications
- Automatic order counting and reward management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js
- **Image Storage**: Cloudinary
- **Charts**: Recharts
- **State Management**: Zustand
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database account
- A Cloudinary account for image storage
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd /Users/amash/Desktop/StopNGo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Database - Get from https://neon.tech
DATABASE_URL=your_neon_postgresql_connection_string

# Cloudinary - Get from https://cloudinary.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth - Generate a random secret
NEXTAUTH_SECRET=your_nextauth_secret_here_use_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# Optional: Create first admin account
ADMIN_EMAIL=admin@stopngo.com
ADMIN_PASSWORD=your_secure_password
```

### 4. Set Up the Database

Generate and push the database schema:

```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

### 5. Create Admin Account

You'll need to create an admin account manually. Run this script or use your database UI:

```sql
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@stopngo.com',
  -- Use bcryptjs to hash your password (or use the signup page and manually change role to 'admin')
  '$2a$10$YourHashedPasswordHere',
  'Admin',
  'admin'
);
```

**Easier method**: Sign up through the website, then manually change your role to 'admin' in the database.

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 📱 Getting Credentials

### Neon PostgreSQL Database

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string from the dashboard
5. Paste it as `DATABASE_URL` in your `.env` file

### Cloudinary

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
4. Add them to your `.env` file

### NextAuth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

Or use any random string generator.

## 🎨 Color Scheme

The website uses colors from your logo:
- **Primary (Teal)**: #00bcd4
- **Secondary (Orange)**: #ff9800
- **Accent Purple**: #7c4dff
- **Accent Pink**: #ff4081
- **Accent Yellow**: #ffd600

## 📁 Project Structure

```
StopNGo/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── products/        # Product CRUD
│   │   ├── orders/          # Order management
│   │   ├── vip/             # VIP enrollment
│   │   ├── analytics/       # Analytics data
│   │   └── admin/           # Admin endpoints
│   ├── admin/               # Admin dashboard pages
│   │   ├── products/        # Product management
│   │   ├── orders/          # Order management
│   │   └── customers/       # Customer view
│   ├── auth/                # Authentication pages
│   ├── products/            # Product listing
│   ├── cart/                # Shopping cart
│   ├── orders/              # Customer orders
│   └── vip/                 # VIP Circle page
├── components/              # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── lib/                     # Utilities and configs
│   ├── db/                  # Database schema and connection
│   ├── store/               # Zustand stores
│   ├── auth.ts              # NextAuth configuration
│   ├── cloudinary.ts        # Cloudinary utilities
│   └── utils.ts             # Helper functions
└── public/                  # Static assets
    └── stopNgo.png          # Logo
```

## 🔐 User Roles

### Customer
- Browse and purchase products
- View order history
- Enroll in VIP Circle
- Track VIP rewards

### Admin
- Full access to admin dashboard
- Manage products (CRUD operations)
- Approve or discard orders
- View analytics and customer data
- Add notes for VIP rewards

## 📊 Database Schema

See `DATABASE_SCHEMA.md` for detailed information about:
- Users table (with VIP fields)
- Products table
- Orders table
- Order Items table
- Relationships and indexes

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT-based session management
- Protected API routes
- Role-based access control
- Image upload validation
- SQL injection prevention (Drizzle ORM)

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 Usage Guide

### For Customers

1. **Sign Up**: Create an account
2. **Browse Products**: View available items by category
3. **Add to Cart**: Select products and quantities
4. **Reserve for Pickup**: Place order (no payment required)
5. **Visit Store**: Come to the store to pickup and pay
6. **Join VIP Circle**: Enroll to start earning rewards

### For Admin

1. **Sign In**: Use admin credentials
2. **Manage Products**: Add/edit/delete products with images
3. **Process Orders**: 
   - Approve when customer picks up and pays
   - Discard if customer doesn't show up (inventory auto-restored)
4. **Add VIP Notes**: Reward customers at milestone orders
5. **View Analytics**: Track monthly sales trends

## 🎯 VIP Circle Workflow

1. Customer enrolls → Receives unique VIP number
2. Customer places orders → Orders start as "pending"
3. Admin approves when customer pays in-store → VIP counter increments
4. After 10 approved orders → Admin adds reward note
5. VIP counter can reset or continue tracking

## 📞 Contact Information

**Stop N Go Smoke & Convenience Store**
- 📍 643 Prospect St, Chicopee, MA 01020, United States
- 📱 +1 (508) 250-5675
- 🕒 Mon-Sun: 7AM - 11PM

## 🤝 Support

If you need help with setup or have questions:
1. Check the documentation above
2. Review the code comments
3. Check the example `.env.example` file

## 📜 License

This is a proprietary application built for Stop N Go Smoke & Convenience Store.

## 🎉 Features Checklist

- ✅ Product catalog with categories
- ✅ Shopping cart with quantity management
- ✅ Reserve for pickup (no online payments)
- ✅ User authentication and accounts
- ✅ VIP Circle loyalty program
- ✅ Admin dashboard with analytics
- ✅ Product management (CRUD)
- ✅ Order management (approve/discard)
- ✅ Inventory management
- ✅ Cloudinary image uploads
- ✅ Monthly sales chart
- ✅ Customer management view
- ✅ Admin notes for VIP rewards
- ✅ Responsive design
- ✅ Real-time inventory updates

---

Built with ❤️ for Stop N Go

