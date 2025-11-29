<template>
  <div class="product-card">
    <img :src="productImageUrl" alt="Product Image">
    <router-link :to="`/product/${product.id}`">
      <h2>{{ product.name }}</h2>
    </router-link>
    
    <p class="description">{{ shortDescription }}</p>

    <div class="product-details">
      <div class="product-price">
        <p class="price">${{ product.price }}</p>
      </div>
      <div class="product-controls">
        <input type="number" v-model="quantity" min="1" class="quantity-input" />
        <button @click="addToCart">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: ['product'],
  data() {
    return {
      quantity: 1
    }
  },
  computed: {
    // 1. Logic to handle image URLs (Backend vs External)
    productImageUrl() {
      // Placeholder check
      if (this.product.image === '/placeholder.png') return this.product.image;
      
      // Full URL check (e.g. Google or AI generated)
      if (this.product.image && this.product.image.startsWith('http')) {
        return this.product.image;
      }

      // Backend Proxy Logic (Connects to Port 3002)
      let baseUrl = process.env.VUE_APP_PRODUCT_SERVICE_URL || 'http://localhost:3002';
      
      if (baseUrl.endsWith('/') && this.product.image.startsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }
      
      return `${baseUrl}${this.product.image}`;
    },

    // 2. Logic to shorten description without cutting off sentences
    shortDescription() {
      const text = this.product.description;
      const maxLength = 100; 

      if (!text) return '';
      if (text.length <= maxLength) return text;

      // Cut at limit
      let trimmed = text.substr(0, maxLength);

      // Try to cut at the last period to keep a full sentence
      const lastPeriod = trimmed.lastIndexOf('.');
      if (lastPeriod > 0) {
        return trimmed.substring(0, lastPeriod + 1);
      }

      // Fallback: Cut at the last space
      return trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(" ")));
    }
  },
  methods: {
    incrementQuantity() {
      this.quantity++
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    addToCart() {
      this.$emit('addToCart', {
        productId: this.product.id,
        quantity: this.quantity
      })
    }
  }
}
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  justify-content: space-between;
  width: 100%;   
  box-sizing: border-box;  
  overflow: hidden;
}

img {
  width: 100%;
  height: 120px;
  object-fit: contain;
  margin-bottom: 5px;
}

h2 {
  font-size: 1rem;
  margin: 5px 0;
  line-height: 1.2;
}

.description {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 10px;
  line-height: 1.3;
  flex-grow: 1;
}

.product-details {
  margin-top: auto;
}

.product-controls {
  display: flex;
  gap: 5px;
  margin-top: 5px;
}

.quantity-input {
  width: 40px;
  padding: 5px;
  font-size: 0.9rem;
}

button {
  flex: 1;
  padding: 6px;
  font-size: 0.9rem;
  background-color: #0046be;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #003da6;
}
</style>