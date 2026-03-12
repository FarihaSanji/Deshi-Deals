# Deshi Deals E-commerce Website

A modern, responsive e-commerce website built with Node.js, Express, and vanilla JavaScript.

## Features

- **Dynamic Product Catalog**: Kitchenware, Furniture, and Sports categories
- **Shopping Cart**: Add, remove, and clear cart functionality
- **Coupon System**: Apply discount codes (SELL200 for 20% off on orders ≥200 TK)
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Modern UI**: Clean, professional design with subtle animations
- **Session Management**: Persistent cart using session IDs

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Styling**: Tailwind CSS, DaisyUI components
- **Data Storage**: In-memory (for demo purposes)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
deshi-deals/
├── index.html          # Main HTML file
├── index.js            # Frontend JavaScript
├── server.js           # Backend server
├── package.json        # Dependencies
├── deshi-deals/        # Assets folder
│   └── assets/         # Product images
└── README.md           # This file
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/cart/:sessionId` - Get cart for session
- `POST /api/cart/:sessionId/add` - Add item to cart
- `POST /api/cart/:sessionId/remove` - Remove item from cart
- `POST /api/cart/:sessionId/clear` - Clear entire cart
- `POST /api/coupons/validate` - Validate coupon code

## Cart Functionality

- **Add Items**: Click "Add to Cart" on any product
- **Remove Items**: Click the ✕ button next to cart items
- **Clear Cart**: Click "Remove All" button
- **Apply Coupons**: Enter coupon code and click "Apply"

## Available Products

### Kitchenware
- Kitchen Stick - 150.40 TK
- Chopping Board - 200.00 TK
- Cooking Pot - 900.00 TK

### Furniture
- Home Chair - 3000.00 TK
- Office Table - 5000.00 TK
- Study Table - 4500.00 TK

### Sports
- Cricket Bat - 2500.00 TK
- Football - 800.00 TK
- Tennis Racket - 3500.00 TK

## Coupon Codes

- **SELL200**: 20% discount on orders of 200 TK or more

## Design Features

- **Responsive Layout**: Adapts to all screen sizes
- **Modern Animations**: Subtle hover effects and transitions
- **Professional Styling**: Clean, modern design
- **User-Friendly**: Intuitive navigation and interactions
- **Color Theme**: Pink-based color scheme for brand consistency

## License

MIT License
