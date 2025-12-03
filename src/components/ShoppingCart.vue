<template>
  <div class="cart-container">
    
    <div v-if="hasCartItems">
      <h1 class="cart-title">
        {{ isCheckoutMode ? 'Checkout' : 'Your Cart' }}
      </h1>

      <div v-if="!isCheckoutMode">
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
                <button class="remove-btn" @click="removeFromCart(item)" title="Remove Item">&times;</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Estimated Total</span>
            <span class="grand-total">${{ cartTotal }}</span>
          </div>
          <button class="checkout-button" @click="isCheckoutMode = true">Proceed to Checkout</button>
        </div>
      </div>

      <div v-else class="checkout-form">
        
        <div class="form-section">
          <h3>Shipping Address</h3>
          
          <div class="form-group">
            <label>Address Line 1</label>
            <input v-model="shipping.address1" type="text" placeholder="123 Maple Street" required />
          </div>

          <div class="form-group">
            <label>Address Line 2 (Optional)</label>
            <input v-model="shipping.address2" type="text" placeholder="Apt 4B" />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>City</label>
              <input v-model="shipping.city" type="text" placeholder="Ottawa" required />
            </div>
            
            <div class="form-group half">
              <label>Country</label>
              <select v-model="shipping.country" disabled>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Province</label>
              <select v-model="shipping.province">
                <option v-for="prov in provinces" :key="prov" :value="prov">{{ prov }}</option>
              </select>
            </div>

            <div class="form-group half">
              <label>Postal Code</label>
              <input 
                v-model="shipping.postalCode" 
                type="text" 
                placeholder="K1A 0B1" 
                maxlength="7"
                @input="formatPostalCode"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Payment Method</h3>
          <div class="payment-options">
            <label :class="{ active: payment.paymentType === 'VISA' }">
              <input type="radio" value="VISA" v-model="payment.paymentType"> VISA
            </label>
            <label :class="{ active: payment.paymentType === 'MASTERCARD' }">
              <input type="radio" value="MASTERCARD" v-model="payment.paymentType"> Mastercard
            </label>
            <label :class="{ active: payment.paymentType === 'AMEX' }">
              <input type="radio" value="AMEX" v-model="payment.paymentType"> AMEX
            </label>
          </div>
        </div>

        <div class="cart-summary">
           <div class="summary-row">
            <span>Total to Pay</span>
            <span class="grand-total">${{ cartTotal }}</span>
          </div>
          <div class="action-row">
            <button class="back-btn" @click="isCheckoutMode = false">Back to Cart</button>
            <button class="checkout-button" @click="submitFullOrder">Place Order</button>
          </div>
        </div>

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
  data() {
    return {
      isCheckoutMode: false,
      provinces: ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"],
      shipping: {
        address1: '',
        address2: '',
        city: '',
        country: 'Canada', // Default and fixed
        province: 'ON',
        postalCode: ''
      },
      payment: {
        paymentType: 'VISA'
      }
    }
  },
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
    formatPostalCode() {
      let val = this.shipping.postalCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (val.length > 3) {
        val = val.slice(0, 3) + ' ' + val.slice(3);
      }
      this.shipping.postalCode = val;
    },
    submitFullOrder() {
      if (!this.shipping.address1 || !this.shipping.city || !this.shipping.postalCode) {
        alert("Please fill in all shipping fields.");
        return;
      }

      const orderPayload = {
        shipping: this.shipping,
        payment: this.payment,
        addressConfirmed: this.shipping.addressConfirmed || false 
      };

      this.$emit('submitOrder', orderPayload);
    },
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
  margin: 0 auto;
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

.checkout-form {
  text-align: left;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #444;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group select:disabled {
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

.form-row {
  display: flex;
  gap: 20px;
}

.half {
  flex: 1;
}

.payment-options {
  display: flex;
  gap: 15px;
}

.payment-options label {
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.payment-options label.active {
  border-color: #0046be;
  background-color: #f0f6ff;
  font-weight: bold;
}

/* Actions */
.action-row {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  margin-top: 20px;
}

.back-btn {
  background: none;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}

.cart-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
th { text-align: left; padding: 15px 10px; color: #666; font-weight: 600; border-bottom: 2px solid #eee; }
td { padding: 20px 10px; border-bottom: 1px solid #f4f4f4; vertical-align: middle; }
.th-product { width: 50%; }
.th-price, .th-quantity, .th-total { width: 15%; text-align: right; }
.td-price, .td-quantity, .td-total { text-align: right; font-size: 1rem; }
.th-action { width: 5%; }
.td-total { font-weight: bold; color: #111; }
.product-wrapper { display: flex; align-items: center; gap: 20px; }
.cart-thumb { width: 60px; height: 60px; object-fit: contain; border: 1px solid #eee; border-radius: 4px; padding: 5px; }
.product-name { font-weight: 500; color: #0046be; }
.product-name:hover { text-decoration: none; color: #002a80;}
.remove-btn { background: none; border: none; color: #cc0000; font-size: 1.5rem; cursor: pointer; padding: 0 10px; opacity: 0.6; }
.remove-btn:hover { opacity: 1; }
.cart-summary { display: flex; flex-direction: column; align-items: flex-end; border-top: 2px solid #eee; padding-top: 20px; }
.summary-row { display: flex; gap: 40px; margin-bottom: 20px; font-size: 1.2rem; }
.grand-total { font-weight: bold; font-size: 1.4rem; }
.checkout-button { padding: 12px 40px; background-color: #FFF007; color: black; font-weight: bold; font-size: 1.1rem; border: none; border-radius: 4px; cursor: pointer; }
.checkout-button:hover { background-color: #ffe000; }
.empty-cart { text-align: center; padding: 60px 0; color: #666; }
.empty-icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.5; }
.continue-btn { margin-top: 20px; padding: 10px 25px; }
.quantity-input { width: 60px; padding: 5px; text-align: center; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
@media (max-width: 768px) { .cart-thumb { display: none; } .th-product { width: 40%; } .cart-container { padding: 15px; } }
</style>