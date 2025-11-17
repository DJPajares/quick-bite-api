# Quick Bite API 🍽️⚡

Fast and easy restaurant QR code ordering system backend powered by Node.js, Express, and MongoDB.

## Features

- ⚡ Quick session creation via QR code scan
- 🍽️ Table-based ordering system
- 🛒 Real-time cart management
- 📋 Simple order submission
- 💰 Automatic bill calculation (taxes & service fees)
- 💾 Order history and tracking

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

4. **Seed sample menu (optional):**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Sessions
- `POST /api/sessions/scan` - Create session from QR code scan
- `GET /api/sessions/:sessionId` - Get session details

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get items by category

### Cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `GET /api/cart/:sessionId` - Get cart contents

### Orders
- `POST /api/orders/submit` - Submit order
- `GET /api/orders/:orderId` - Get order details
- `GET /api/orders/session/:sessionId` - Get orders for a session
- `GET /api/orders/table/:tableNumber` - Get orders for a table

### Bill
- `GET /api/bill/:sessionId` - Get current bill with taxes and fees

## Project Structure

```
quick-bite-api/
├── src/
│   ├── config/         # Configuration files
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   ├── scripts/        # Utility scripts (seeding, etc.)
│   └── server.js       # Main application entry
├── .env                # Environment variables
└── package.json        # Dependencies
```

## Configuration

Edit `.env` file to configure:

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `TAX_RATE` - Tax percentage (default: 0.08 = 8%)
- `SERVICE_FEE_RATE` - Service fee percentage (default: 0.05 = 5%)
- `SESSION_TIMEOUT_MINUTES` - Session expiry time (default: 120 minutes)

## License

MIT
