# CartShip Store - Pakistan

A full-stack modern e-commerce web application designed for the Pakistani market, featuring WhatsApp integration, Cash on Delivery (COD) functionality, user authentication, and a comprehensive admin panel.

## ✨ Features

### Frontend

- **Next.js 15** with App Router and React 19
- **Vanilla CSS** with custom design system and animations
- **Responsive Design** - Mobile-first approach
- **Modern UI Components** - Clean minimalist product cards with hover effects
- **Real-time Cart** - LocalStorage-based cart with instant updates

### Backend & Database

- **Next.js API Routes** - RESTful API endpoints
- **MongoDB** with Mongoose ODM
- **NextAuth.js v5** - Complete authentication system
  - Credentials provider (email/password)
  - Google OAuth integration
  - Protected admin routes with middleware

### E-commerce Features

- **Product Management**
  - ID-based product URLs (`/products/[id]`)
  - Color selection for products
  - Category filtering and search
  - Product ratings and reviews
  - Stock management
- **Shopping Experience**
  - Add to cart with quantity control
  - Wishlist functionality
  - Quick view on hover
  - Real-time price calculations
- **Checkout Process**
  - Multi-step checkout form
  - Auto-populate for logged-in users
  - Pakistani city selection
  - Phone number validation (03XXXXXXXXX)
  - Cash on Delivery (COD) only
  - Free shipping above Rs. 1,500

### Admin Dashboard

- **Dashboard Analytics** - Real-time stats and charts
- **Product Management** - Full CRUD with image upload and color management
- **Order Management** - View, update, and track orders
- **Customer Management** - View registered users
- **Banner Management** - Hero slider configuration
- **Settings** - Store configuration

### Pakistani Market Features

- **PKR Currency** - Formatted pricing (Rs. 1,500)
- **COD Payment** - Cash on Delivery as primary payment method
- **WhatsApp Integration** - Order notifications and customer support
- **Pakistani Cities** - Dropdown with major cities
- **Phone Validation** - Pakistani mobile number format
- **Delivery Fee** - Automatic calculation based on order value

## 🚀 Tech Stack

- **Framework**: Next.js 16.2.4 (Turbopack)
- **Language**: TypeScript
- **UI**: React 19, Vanilla CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5
- **Image Hosting**: Cloudinary
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Image Slider**: Swiper.js

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Cloudinary account (optional, for custom images)

### 1. Clone Repository

```bash
git clone https://github.com/muhammadmustafarooqi/CartShip.git
cd CartShip
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/CartShip

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (Optional - for custom images)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Credentials
ADMIN_EMAIL=admin@CartShipstore.pk
ADMIN_PASSWORD=YourSecurePassword123!

# WhatsApp
WHATSAPP_NUMBER=923001234567
```

### 4. Seed Database

Populate with 70 sample products and 3 banners:

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Access Points

- **Store**: `http://localhost:3000`
- **Admin Login**: `http://localhost:3000/auth/admin-login`
- **User Login**: `http://localhost:3000/auth/login`
- **User Signup**: `http://localhost:3000/auth/signup`

**Default Admin Credentials**: Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env.local`

## 📁 Project Structure

```
CartShip/
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── products/           # Product listing & detail
│   └── order-success/      # Order confirmation
├── components/
│   ├── admin/              # Admin components
│   ├── ProductCard.tsx     # Product card component
│   ├── Navbar.tsx          # Navigation
│   └── ...                 # Other components
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── mongodb.ts          # Database connection
│   └── utils.ts            # Utility functions
├── models/
│   ├── Product.ts          # Product schema
│   ├── Order.ts            # Order schema
│   ├── User.ts             # User schema
│   └── Banner.ts           # Banner schema
├── scripts/
│   └── seed.ts             # Database seeding
└── public/                 # Static assets
```

## 🎨 Key Features Implemented

### Product Color Selection

- Admins can add multiple colors per product
- 20 predefined colors + custom color input
- Color selection UI on product detail page
- Colors stored as array in database

### ID-Based URLs

- Products use MongoDB ObjectID in URLs
- Format: `/products/507f1f77bcf86cd799439011`
- Cleaner than slug-based routing
- Direct database lookups

### User Authentication

- Email/password registration and login
- Google OAuth integration
- Protected routes with middleware
- Session management with NextAuth
- Auto-populate checkout for logged-in users

### Modern Product Cards

- Clean minimalist design
- Full-cover product images
- Hover effects with overlay
- Quick view button
- Wishlist functionality
- Real Unsplash images

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npm run seed         # Seed database with sample data

# Code Quality
npm run lint         # Run ESLint
```

## 📝 Environment Variables Reference

| Variable                | Description                              | Required |
| ----------------------- | ---------------------------------------- | -------- |
| `MONGODB_URI`           | MongoDB connection string                | ✅       |
| `NEXTAUTH_SECRET`       | Secret for JWT encryption (min 32 chars) | ✅       |
| `NEXTAUTH_URL`          | Base URL of application                  | ✅       |
| `ADMIN_EMAIL`           | Admin login email                        | ✅       |
| `ADMIN_PASSWORD`        | Admin login password                     | ✅       |
| `WHATSAPP_NUMBER`       | WhatsApp number (92XXXXXXXXXX)           | ✅       |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID                   | ❌       |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth secret                      | ❌       |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                    | ❌       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                       | ❌       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                    | ❌       |

## 🎯 Features Checklist

- [x] Complete Next.js 15 project with TypeScript
- [x] Home page with hero slider and featured products
- [x] Product listing with filters and search
- [x] Product detail page with color selection
- [x] Shopping cart with quantity management
- [x] Multi-step checkout process
- [x] Order success page
- [x] User authentication (login/signup)
- [x] Google OAuth integration
- [x] Admin dashboard with analytics
- [x] Product management (CRUD + colors)
- [x] Order management
- [x] Customer management
- [x] Banner management
- [x] WhatsApp integration
- [x] COD payment method
- [x] Pakistani phone validation
- [x] Free shipping calculation
- [x] Database seeding with 70 products
- [x] Real product images from Unsplash
- [x] Responsive design
- [x] Modern UI with animations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Muhammad Mustafa Rooqi**

- GitHub: [@muhammadmustafarooqi](https://github.com/muhammadmustafarooqi)

---

**Built with ❤️ for the Pakistani e-commerce market**
