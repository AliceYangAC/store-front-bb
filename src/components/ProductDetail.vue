<template>
  <br>
  <div class="product-detail" v-if="productExists">
    <div class="product-image">
      <img :src="productImageUrl" :alt="product.name" />
    </div>
    <div class="product-info">
      <h2>{{ product.name }}</h2>
      <small>Product ID: {{ product.id }}</small>
      <p>{{ product.description }}</p>
      <div class="product-controls">
        <p>
          <b>Price: <span class="price">{{ product.price }}</span></b>
        </p>
        <input type="number" v-model="quantity" min="1" class="quantity-input" />
        <button @click="addToCart">Add to Cart</button>
      </div>
    </div>
  </div>
  <div class="product-detail" v-else>
    <img src="../assets/404.jpg" alt="Product not found" />
    <h3>Opps! That product was not found...</h3>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  props: ['products'],
  data() {
    return {
      quantity: 1
    }
  },
  computed: {
    product() {
      return this.products.find(product => product.id == this.$route.params.id);
    },
    productExists() {
      return !!this.product;
    },
    productImageUrl() {
      // If no product or image, return placeholder or empty
      if (!this.product || !this.product.image) {
        return require('../assets/404.jpg'); // Fallback
      }

      // Check if the database already has a full URL
      if (this.product.image.startsWith('http')) {
        return this.product.image;
      }

      // Get the Base URL from Environment Variables
      // Default to empty string if not set
      let baseUrl = process.env.VUE_APP_PRODUCT_SERVICE_URL || '';

      // Clean up slashes to avoid double slashes
      if (baseUrl.endsWith('/') && this.product.image.startsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }

      // Combine them
      return `${baseUrl}${this.product.image}`;
    }
  },
  methods: {
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
a {
  color: #0000FF;
  text-decoration: underline;
}

.product-detail {
  text-align: left;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
  margin: 1rem;
}

.product-image {
  flex: 1;
}

.product-image img {
  width: 100%;
  height: auto;
}

.product-info {
  flex: 1;
  text-align: left;
}

.product-info h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.product-info p {
  font-size: 16px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .product-detail {
    flex-direction: column;
  }
}
</style>