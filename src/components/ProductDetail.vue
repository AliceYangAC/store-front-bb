<template>
  <div class="detail-container" v-if="productExists">
    <div class="image-column">
      <div class="square-image-wrapper">
        <img :src="productImageUrl" :alt="product.name" />
      </div>
    </div>

    <div class="info-column">
      <div class="product-header">
        <h1>{{ product.name }}</h1>
        
        <div class="meta-row">
          <span class="sku-label">Code: {{ product.id }}</span>
          
          <button 
            v-if="product.category" 
            class="category-badge" 
            @click="searchCategory(product.category)"
            title="Search for products in this category"
          >
            {{ product.category }}
          </button>
        </div>

      </div>

      <div class="description-section">
        <h3>Overview</h3>
        <p>{{ product.description }}</p>
      </div>

      <hr class="divider">

      <div class="purchase-section">
        <div class="price-tag">${{ product.price }}</div>
        
        <div class="controls-row">
          <input type="number" v-model="quantity" min="1" class="quantity-input" aria-label="Quantity" />
          <button class="add-btn" @click="addToCart">Add to Cart</button>
        </div>
      </div>
      <br /><br />
    </div>
        <div class="rec-section-wrapper" v-if="productExists">
      <ProductRec 
        :currentProductId="product.id" 
        :allProducts="products"
        @addToCart="addToCartFromRec" 
      />
    </div>
  </div>

  <div class="not-found" v-else>
    <img src="../assets/404.jpg" alt="Product not found" />
    <h3>Oops! That product was not found...</h3>
  </div>
</template>

<script>
import ProductRec from '../components/ProductRec.vue'
export default {
  name: 'ProductDetail',
  components: { ProductRec },
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
      if (this.product.image === '/placeholder.png') return this.product.image;
      
      if (this.product.image.startsWith('http')) {
        return this.product.image;
      }

      let baseUrl = process.env.VUE_APP_PRODUCT_SERVICE_URL || 'http://localhost:3002';

      if (baseUrl.endsWith('/') && this.product.image.startsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }

      return `${baseUrl}${this.product.image}`;
    }
  },
  methods: {
    addToCart() {
      this.$emit('addToCart', {
        productId: this.product.id,
        quantity: this.quantity
      })
    },
    addToCartFromRec(payload) {
      this.$emit('addToCart', payload);
    },
    searchCategory(category) {
      this.$router.push({ path: '/search', query: { q: category } });
    }
  }
}
</script>

<style scoped>
.detail-container {
  display: flex;
  flex-wrap: wrap; 
  max-width: 1200px;
  /* margin: 15px auto; */
  padding: 0 20px;
  gap: 40px;
  align-items: flex-start;
}

.image-column {
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
}

.square-image-wrapper {
  width: 500px;
  height: 500px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.square-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain; 
}

.info-column {
  flex: 1;
  min-width: 300px;
  text-align: left;
}

.product-header h1 {
  font-size: 2rem;
  margin: 0 0 10px 0;
  line-height: 1.2;
  color: #111;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.sku-label {
  font-size: 0.9rem;
  color: #666;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 0.85rem;
  font-weight: bold;
  color: #0046be; 
  background-color: #f0f6ff; 
  border: 1px solid #0046be;
  border-radius: 16px; 
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  line-height: 1;
  height: auto; 
  min-height: unset;
}

.category-badge:hover {
  background-color: #0046be;
  color: white;
  text-decoration: none;
}
.purchase-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.price-tag {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111;
  margin-bottom: 15px;
}

.controls-row {
  display: flex;
  gap: 10px;
  height: 44px;
}

.quantity-input {
  width: 60px;
  padding: 0 10px;
  font-size: 1.1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.add-btn {
  flex: 1; 
  font-weight: bold;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #ffe000;
  color: black;
  margin-right: 15px;
  margin-left: 15px;
}

.add-btn:hover {
  background-color: #fff007;
  color: black
}

.divider {
  border: 0;
  border-top: 1px solid #eee;
  margin: 30px 0;
}

.description-section {
    margin-bottom: 20px;
}

.description-section h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.description-section p {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}

@media (max-width: 900px) {
  .detail-container {
    flex-direction: column;
  }

  .square-image-wrapper {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    max-width: 500px;
  }
}

.rec-section-wrapper {
    width: 100%; 
    /* max-width: 1200px; */
    margin: 40px auto;
    padding: 0 20px; 
    box-sizing: border-box; 
}

.not-found {
  margin-top: 50px;
}
</style>