// Static data for GitHub Pages deployment
const products = [
  { id: 1, name: 'Kitchen Stick', category: 'kitchenware', price: 150.40, rating: 4, image: './deshi-deals/assets/kitchen-1.png' },
  { id: 2, name: 'Chopping Board', category: 'kitchenware', price: 200.00, rating: 4, image: './deshi-deals/assets/kitchen-2.png' },
  { id: 3, name: 'Cooking Pot', category: 'kitchenware', price: 900.00, rating: 5, image: './deshi-deals/assets/kitchen-3.png' },
  { id: 4, name: 'Home Chair', category: 'furniture', price: 3000.00, rating: 4, image: './deshi-deals/assets/furniture-1.png' },
  { id: 5, name: 'Office Table', category: 'furniture', price: 5000.00, rating: 5, image: './deshi-deals/assets/furniture-2.png' },
  { id: 6, name: 'Study Table', category: 'furniture', price: 4500.00, rating: 3, image: './deshi-deals/assets/furniture-3.png' },
  { id: 7, name: 'Cricket Bat', category: 'sports', price: 2500.00, rating: 5, image: './deshi-deals/assets/sports-1.png' },
  { id: 8, name: 'Football', category: 'sports', price: 800.00, rating: 4, image: './deshi-deals/assets/sports-2.png' },
  { id: 9, name: 'Tennis Racket', category: 'sports', price: 3500.00, rating: 3, image: './deshi-deals/assets/sports-3.png' }
];

// Static Deshi Deals E-commerce Website for GitHub Pages
class DeshiDeals {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.products = products; // Use static data
    this.cart = this.loadCartFromStorage();
    this.appliedCoupon = null;
    this.init();
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  // Load cart from localStorage for GitHub Pages
  loadCartFromStorage() {
    const savedCart = localStorage.getItem('deshiDealsCart');
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0, quantity: 0 };
  }

  // Save cart to localStorage for GitHub Pages
  saveCartToStorage() {
    localStorage.setItem('deshiDealsCart', JSON.stringify(this.cart));
  }

  async init() {
    await this.loadProducts();
    this.setupEventListeners();
    this.renderProducts();
    this.updateCartUI();
  }

  // API Methods (now using static data)
  async loadProducts() {
    // Products are already loaded from static data
    console.log('Products loaded:', this.products.length);
  }

  async loadCart() {
    // Cart is loaded from localStorage
    this.updateCartUI();
  }

  async addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    
    if (!product) {
      this.showNotification('Product not found', 'error');
      return;
    }

    const existingItem = this.cart.items.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.items.push({ ...product, quantity: 1 });
    }

    this.calculateCartTotal();
    this.saveCartToStorage();
    this.updateCartUI();
    this.showNotification('Product added to cart!');
  }

  async removeFromCart(productId) {
    const itemIndex = this.cart.items.findIndex(item => item.id === productId);
    if (itemIndex === -1) {
      this.showNotification('Item not found in cart', 'error');
      return;
    }

    const item = this.cart.items[itemIndex];
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cart.items.splice(itemIndex, 1);
    }

    this.calculateCartTotal();
    this.saveCartToStorage();
    this.updateCartUI();
    this.showNotification('Item removed from cart!');
  }

  async clearCart() {
    this.cart = { items: [], total: 0, quantity: 0 };
    this.appliedCoupon = null;
    this.saveCartToStorage();
    this.updateCartUI();
    this.showNotification('Cart cleared!');
  }

  async applyCoupon(couponCode) {
    // Static coupon validation for GitHub Pages
    const coupons = {
      'SELL200': { discount: 20, minAmount: 200 }
    };
    
    const coupon = coupons[couponCode];
    
    if (!coupon) {
      this.showNotification('Invalid coupon code', 'error');
      return;
    }

    if (this.cart.total < coupon.minAmount) {
      this.showNotification(`Minimum order amount is ${coupon.minAmount} TK`, 'error');
      return;
    }

    const discountAmount = this.cart.total * (coupon.discount / 100);
    const newTotal = this.cart.total - discountAmount;

    this.appliedCoupon = {
      couponCode,
      discountPercentage: coupon.discount,
      discountAmount,
      originalTotal: this.cart.total,
      newTotal
    };

    this.updateCartUI();
    this.showNotification(`Coupon applied! You saved ${discountAmount.toFixed(2)} TK`);
  }

  calculateCartTotal() {
    this.cart.total = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.cart.quantity = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // UI Methods (same as before)
  renderProducts() {
    const productBox = document.getElementById('product-box');
    if (!productBox) return;

    const categories = {
      kitchenware: this.products.filter(p => p.category === 'kitchenware'),
      furniture: this.products.filter(p => p.category === 'furniture'),
      sports: this.products.filter(p => p.category === 'sports')
    };

    let html = '';
    
    html += `
      <div class="kitchen">
        <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">Kitchenware</h1>
        <div class="kitchen-items grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 my-6">
          ${this.renderProductCards(categories.kitchenware)}
        </div>
      </div>
    `;

    html += `
      <div class="furniture">
        <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">Furniture</h1>
        <div class="kitchen-items grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 my-6">
          ${this.renderProductCards(categories.furniture)}
        </div>
      </div>
    `;

    html += `
      <div class="sports">
        <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">Sports</h1>
        <div class="kitchen-items grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 my-6">
          ${this.renderProductCards(categories.sports)}
        </div>
      </div>
    `;

    productBox.innerHTML = html;

    const addToCartButtons = productBox.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        this.addToCart(productId);
      });
    });
  }

  renderProductCards(products) {
    return products.map(product => `
      <div class="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
        <figure class="bg-gray-200 m-3 sm:m-5 rounded-xl">
          <img src="${product.image}" alt="${product.name}" class="rounded-xl py-3 sm:py-5 w-full h-48 object-contain" />
        </figure>
        <div class="card-body items-center text-center px-3 sm:px-4">
          <h2 class="card-title text-lg sm:text-xl">${product.name}</h2>
          <p class="text-sm sm:text-base">${'⭐'.repeat(product.rating)}</p>
          <p class="text-gray-500 text-sm sm:text-base">
            <span>${product.price.toFixed(2)}</span> TK
          </p>
        </div>
        <div class="m-3 sm:m-5">
          <button class="btn bg-pink-500 text-white btn-block cart-btn hover:bg-pink-600 transition-colors text-sm sm:text-base add-to-cart-btn" 
                  data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  }

  updateCartUI() {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');
    const totalQuantityElement = document.getElementById('total-quantity');

    if (!cartContainer || !totalPriceElement || !totalQuantityElement) return;

    let cartHTML = '';
    
    if (this.cart.items.length === 0) {
      cartHTML = '<div class="text-center text-gray-500 py-8">Your cart is empty</div>';
    } else {
      this.cart.items.forEach(item => {
        cartHTML += `
          <div class="bg-gray-200 rounded-xl p-4 my-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <img src="${item.image}" alt="${item.name}" class="w-10" />
                <div>
                  <h2 class="font-bold">${item.name}</h2>
                  <h2>${item.price.toFixed(2)} Tk x ${item.quantity}</h2>
                </div>
              </div>
              <button class="btn bg-red-500 text-white hover:bg-red-600 transition-colors text-sm px-3 py-1 rounded remove-item-btn"
                      data-product-id="${item.id}">
                ✕
              </button>
            </div>
          </div>
        `;
      });
    }
    cartContainer.innerHTML = cartHTML;

    const removeButtons = cartContainer.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        this.removeFromCart(productId);
      });
    });

    let finalTotal = this.cart.total;
    if (this.appliedCoupon) {
      finalTotal = this.appliedCoupon.newTotal;
    }

    totalPriceElement.innerText = finalTotal.toFixed(2);
    totalQuantityElement.innerText = this.cart.quantity;
  }

  setupEventListeners() {
    const clearBtn = document.querySelector('#btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (this.cart.items.length > 0) {
          this.clearCart();
        } else {
          this.showNotification('Cart is already empty', 'error');
        }
      });
    }

    const couponInput = document.querySelector('input[type="email"]');
    const applyBtn = document.querySelector('.cart-btn:not([onclick])');
    
    if (applyBtn && couponInput) {
      applyBtn.addEventListener('click', () => {
        const couponCode = couponInput.value.trim();
        if (couponCode) {
          this.applyCoupon(couponCode);
        } else {
          this.showNotification('Please enter a coupon code', 'error');
        }
      });
    }

    if (couponInput) {
      couponInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const couponCode = couponInput.value.trim();
          if (couponCode) {
            this.applyCoupon(couponCode);
          }
        }
      });
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize app when DOM is loaded
let deshiDeals;
document.addEventListener('DOMContentLoaded', () => {
  deshiDeals = new DeshiDeals();
});

// Helper function for backward compatibility
function getElement(id) {
  return document.getElementById(id);
}
