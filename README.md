# VELAFLAME - E-commerce Platform

A modern e-commerce platform built with Next.js, featuring a beautiful UI and comprehensive functionality for selling flame-themed products.

## Features

- 🛍️ **Product Catalog** - Browse and search products with filtering and sorting
- 🛒 **Shopping Cart** - Add items to cart and manage quantities
- 💳 **Checkout System** - Complete orders with shipping information
- ⭐ **Product Reviews** - Customer reviews and ratings system
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI** - Beautiful, accessible interface built with shadcn/ui
- 🔐 **Admin Panel** - Manage products, orders, and customers

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd VELAFLAME
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Set up the database:
Run the SQL scripts in the `scripts/` directory in your Supabase SQL editor:
- `01-create-tables.sql`
- `02-seed-data.sql`
- `03-add-functions.sql`
- `04-add-reviews.sql`

5. Start the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
VELAFLAME/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   └── shop/              # Product catalog
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── contexts/             # React contexts
├── lib/                  # Utility functions and configurations
├── scripts/              # Database setup scripts
└── public/               # Static assets
```

## API Routes

- `GET /api/products` - Fetch products with filtering
- `POST /api/products` - Create new product (admin)
- `GET /api/reviews` - Fetch product reviews
- `POST /api/reviews` - Submit new review
- `GET /api/orders` - Fetch orders (admin)
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Fetch specific order

## Deployment

The project is configured for deployment on Vercel. Simply connect your repository to Vercel and it will automatically deploy.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
