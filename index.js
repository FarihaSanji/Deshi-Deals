// Deshi Deals E-commerce Website
class DeshiDeals {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.products = [];
    this.cart = { items: [], total: 0, quantity: 0 };
    this.appliedCoupon = null;
    this.init();
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  async init() {
    await this.loadProducts();
    await this.loadCart();
    this.setupEventListeners();
    this.renderProducts();
  }

  // API Methods
  async loadProducts() {
    try {
      const response = await fetch('/api/products');
      this.products = await response.json();
    } catch (error) {
      this.showNotification('Error loading products', 'error');
    }
  }

  async loadCart() {
    try {
      const response = await fetch(`/api/cart/${this.sessionId}`);
      this.cart = await response.json();
      this.updateCartUI();
    } catch (error) {
      this.showNotification('Error loading cart', 'error');
    }
  }

  async addToCart(productId) {
    try {
      const response = await fetch(`/api/cart/${this.sessionId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      
      this.cart = await response.json();
      this.updateCartUI();
      this.showNotification('Product added to cart!');
    } catch (error) {
      this.showNotification('Error adding product to cart', 'error');
    }
  }

  async removeFromCart(productId) {
    try {
      const response = await fetch(`/api/cart/${this.sessionId}/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      
      this.cart = await response.json();
      this.updateCartUI();
      this.showNotification('Item removed from cart!');
    } catch (error) {
      this.showNotification('Error removing item from cart', 'error');
    }
  }

  async clearCart() {
    try {
      await fetch(`/api/cart/${this.sessionId}/clear`, { method: 'POST' });
      
      this.cart = { items: [], total: 0, quantity: 0 };
      this.appliedCoupon = null;
      this.updateCartUI();
      this.showNotification('Cart cleared!');
    } catch (error) {
      this.showNotification('Error clearing cart', 'error');
    }
  }

  async applyCoupon(couponCode) {
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode, cartTotal: this.cart.total }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        this.appliedCoupon = result;
        this.updateCartUI();
        this.showNotification(`Coupon applied! You saved ${result.discountAmount.toFixed(2)} TK`);
      } else {
        this.showNotification(result.error, 'error');
      }
    } catch (error) {
      this.showNotification('Error applying coupon', 'error');
    }
  }

  // UI Methods
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
