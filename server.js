const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Data
const products = [
  { id: 1, name: 'Kitchen Stick', category: 'kitchenware', price: 150.40, rating: 4, image: './assets/kitchen-1.png' },
  { id: 2, name: 'Chopping Board', category: 'kitchenware', price: 200.00, rating: 4, image: './assets/kitchen-2.png' },
  { id: 3, name: 'Cooking Pot', category: 'kitchenware', price: 900.00, rating: 5, image: './assets/kitchen-3.png' },
  { id: 4, name: 'Home Chair', category: 'furniture', price: 3000.00, rating: 4, image: './assets/furniture-1.png' },
  { id: 5, name: 'Office Table', category: 'furniture', price: 5000.00, rating: 5, image: './assets/furniture-2.png' },
  { id: 6, name: 'Study Table', category: 'furniture', price: 4500.00, rating: 3, image: './assets/furniture-3.png' },
  { id: 7, name: 'Cricket Bat', category: 'sports', price: 2500.00, rating: 5, image: './assets/sports-1.png' },
  { id: 8, name: 'Football', category: 'sports', price: 800.00, rating: 4, image: './assets/sports-2.png' },
  { id: 9, name: 'Tennis Racket', category: 'sports', price: 3500.00, rating: 3, image: './assets/sports-3.png' }
];

const carts = new Map();
const coupons = new Map([
  ['SELL200', { discount: 20, minAmount: 200 }]
]);

// Helper Functions
function findOrCreateCart(sessionId) {
  if (!carts.has(sessionId)) {
    carts.set(sessionId, { items: [], total: 0, quantity: 0 });
  }
  return carts.get(sessionId);
}

function calculateCartTotal(cart) {
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.quantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return cart;
}

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/cart/:sessionId', (req, res) => {
  const cart = findOrCreateCart(req.params.sessionId);
  res.json(cart);
});

app.post('/api/cart/:sessionId/add', (req, res) => {
  const { productId } = req.body;
  const cart = findOrCreateCart(req.params.sessionId);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existingItem = cart.items.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.items.push({ ...product, quantity: 1 });
  }

  res.json(calculateCartTotal(cart));
});

app.post('/api/cart/:sessionId/remove', (req, res) => {
  const { productId } = req.body;
  const cart = findOrCreateCart(req.params.sessionId);
  
  const itemIndex = cart.items.findIndex(item => item.id === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  const item = cart.items[itemIndex];
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart.items.splice(itemIndex, 1);
  }

  res.json(calculateCartTotal(cart));
});

app.post('/api/cart/:sessionId/clear', (req, res) => {
  const cart = findOrCreateCart(req.params.sessionId);
  cart.items = [];
  cart.total = 0;
  cart.quantity = 0;
  res.json(cart);
});

app.post('/api/coupons/validate', (req, res) => {
  const { couponCode, cartTotal } = req.body;
  const coupon = coupons.get(couponCode);
  
  if (!coupon) {
    return res.status(400).json({ error: 'Invalid coupon code' });
  }

  if (cartTotal < coupon.minAmount) {
    return res.status(400).json({ error: `Minimum order amount is ${coupon.minAmount} TK` });
  }

  const discountAmount = cartTotal * (coupon.discount / 100);
  const newTotal = cartTotal - discountAmount;

  res.json({
    couponCode,
    discountPercentage: coupon.discount,
    discountAmount,
    originalTotal: cartTotal,
    newTotal
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
