<template>
  <div class="product-card">
    <div class="image-wrapper">
      <img 
        :src="productImageUrl" 
        alt="Product Image"
        @error="handleImageError"
      >
    </div>
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
    productImageUrl() {
      if (!this.product.id) return '/placeholder.png';
      // Direct ID mapping to the backend route
      return `/products/${this.product.id}/image`;
    },
    shortDescription() {
      const text = this.product.description;
      const maxLength = 100; 

      if (!text) return '';
      if (text.length <= maxLength) return text;

      let trimmed = text.substr(0, maxLength);
      const lastPeriod = trimmed.lastIndexOf('.');
      if (lastPeriod > 0) {
        return trimmed.substring(0, lastPeriod + 1);
      }
      return trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(" ")));
    }
  },
  methods: {
    handleImageError(e) {
        e.target.src = '/placeholder.png';
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

.product-card a {
    color: #333; 
    text-decoration: none; 
}

/* Added wrapper to keep images consistent size */
.image-wrapper {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
}

img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

h2 {
  font-size: 1rem;
  margin: 5px 0;
  line-height: 1.2;
}

h2:hover {
  color: #0046BE;
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
}
</style>