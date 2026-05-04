# ALLInONE Store - Pakistan

A full-stack modern e-commerce web application designed for the Pakistani market, featuring WhatsApp integration, Cash on Delivery (COD) functionality, and a comprehensive admin panel.

## Features
- **Frontend**: Next.js 14 App Router, React, Vanilla CSS with custom styling.
- **Backend API**: Next.js API Routes.
- **Database**: MongoDB with Mongoose.
- **Auth**: NextAuth.js (v5) credentials provider for Admin Dashboard.
- **Media**: Cloudinary for product image management.
- **WhatsApp Integration**: Fast order confirmations via WhatsApp.
- **Pakistani Context**: COD payment mode, PKR currency formatting, automatic delivery fee calculation, and Pakistani phone number validation.
- **Admin Dashboard**: Full CRUD for products, orders, banners, and real-time dashboard analytics.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in the corresponding values:
```bash
cp .env.example .env.local
```
- `MONGODB_URI`: Your MongoDB connection string.
- `NEXTAUTH_SECRET`: Random string for JWT encryption.
- `CLOUDINARY_*`: Your Cloudinary credentials.
- `ADMIN_EMAIL` & `ADMIN_PASSWORD`: For logging into the admin panel (`/admin/login`).
- `WHATSAPP_NUMBER`: Store's WhatsApp number for order notifications (format: `92XXXXXXXXXX`).

### 3. Seed the Database
Populate the database with the initial 70 test products, categories, and tags using the seed script:
```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```

The store will be running at `http://localhost:3000`. 
Admin Panel is available at `http://localhost:3000/admin/dashboard` (use the credentials you set in `.env.local`).

## Deliverables Checklist
- [x] Complete working Next.js project
- [x] All pages listed in requirements (Home, Products, Cart, Checkout, Order Success)
- [x] Admin panel with login (Dashboard, Products, Orders, Banners, Settings)
- [x] Database seed file with 70 products
- [x] README with setup instructions
- [x] `.env.example` file
