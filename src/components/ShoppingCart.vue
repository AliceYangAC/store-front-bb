<template>
  <div class="cart-container">
    
    <div v-if="hasCartItems">
      <h1 class="cart-title">Your Cart</h1>
      
      <table class="cart-table">
        <thead>
          <tr>
            <th class="th-product">Product</th>
            <th class="th-price">Price</th>
            <th class="th-quantity">Quantity</th>
            <th class="th-total">Total</th>
            <th class="th-action"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.product.id">
            
            <td class="td-product">
              <div class="product-wrapper">
                <img :src="getImageUrl(item.product)" :alt="item.product.name" class="cart-thumb" />
                <router-link :to="`/product/${item.product.id}`" class="product-name">{{ item.product.name }}</router-link>
              </div>
            </td>

            <td class="td-price">${{ item.product.price }}</td>

            <td class="td-quantity">
              <input 
                type="number" 
                v-model.number="item.quantity" 
                min="1" 
                class="quantity-input" 
                @change="validateQuantity(item)"
              />
            </td>

            <td class="td-total">${{ getItemTotal(item) }}</td>

            <td class="td-action">
              <button class="remove-btn" @click="removeFromCart(item)" title="Remove Item">
                &times;
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-summary">
        <div class="summary-row">
          <span>Estimated Total</span>
          <span class="grand-total">${{ cartTotal }}</span>
        </div>
        <button class="checkout-button" @click="submitOrder">Checkout</button>
      </div>

    </div>

    <div class="empty-cart" v-else>
      <div class="empty-icon">🛒</div>
      <h3>Your cart is empty</h3>
      <p>Looks like you haven't added anything to your cart yet.</p>
      <router-link to="/">
        <button class="continue-btn">Start Shopping</button>
      </router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ShoppingCart',
  props: ['cartItems'],
  computed: {
    hasCartItems() {
      return this.cartItems.length > 0
    },
    cartTotal() {
      const total = this.cartItems.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);
      return total.toFixed(2);
    }
  },
  methods: {
    getItemTotal(item) {
      return (item.quantity * item.product.price).toFixed(2);
    },
    removeFromCart(item) {
      const index = this.cartItems.indexOf(item)
      if (index > -1) {
        this.$emit('removeFromCart', index)
      }
    },
    validateQuantity(item) {
      if (item.quantity < 1 || !item.quantity) {
        item.quantity = 1;
      }
    },
    submitOrder() {
      this.$emit('submitOrder')
    },
    // Helper to resolve image URL correctly (matches ProductDetail logic)
    getImageUrl(product) {
      if (!product.image || product.image === '/placeholder.png') return '/placeholder.png';
      if (product.image.startsWith('http')) return product.image;

      let baseUrl = process.env.VUE_APP_PRODUCT_SERVICE_URL || 'http://localhost:3002';
      if (baseUrl.endsWith('/') && product.image.startsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }
      return `${baseUrl}${product.image}`;
    }
  }
}
</script>

<style scoped>
.cart-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.cart-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  color: #111;
}

/* Table Styling */
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

th {
  text-align: left;
  padding: 15px 10px;
  color: #666;
  font-weight: 600;
  border-bottom: 2px solid #eee;
}

td {
  padding: 20px 10px;
  border-bottom: 1px solid #f4f4f4;
  vertical-align: middle;
}

/* Column Specifics */
.th-product { width: 50%; }
.th-price, .th-quantity, .th-total { width: 15%; text-align: right; }
.td-price, .td-quantity, .td-total { text-align: right; font-size: 1rem; }
.th-action { width: 5%; }

.td-total {
  font-weight: bold;
  color: #111;
}

/* Product Wrapper (Image + Name) */
.product-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cart-thumb {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px;
}

.product-name {
  font-weight: 500;
  color: #0046be;
}

/* Buttons */
.remove-btn {
  background: none;
  border: none;
  color: #cc0000;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 10px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.remove-btn:hover {
  opacity: 1;
  background: none;
}

/* Summary Section */
.cart-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-top: 2px solid #eee;
  padding-top: 20px;
}

.summary-row {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.grand-total {
  font-weight: bold;
  font-size: 1.4rem;
}

.checkout-button {
  padding: 12px 40px;
  background-color: #ffe000; /* Best Buy Yellow */
  color: black;
  font-weight: bold;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-button:hover {
  background-color: #fff007;
}

/* Empty State */
.empty-cart {
  text-align: center;
  padding: 60px 0;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.continue-btn {
  margin-top: 20px;
  padding: 10px 25px;
}

.quantity-input {
  width: 60px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-thumb { display: none; }
  .th-product { width: 40%; }
  .cart-container { padding: 15px; }
}
</style>