<template>
  <div class="product-list-container">
    <div class="list-header">
      <h2>Featured Products</h2>
      <span class="product-count">{{ products.length }} items</span>
    </div>

    <div class="product-grid">
      <div class="grid-item" v-for="product in products" :key="product.id">
        <ProductCard
          :product="product"
          @addToCart="addToCart"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'ProductList',
  props: ['products'],
  components: {
    ProductCard
  },
  methods: {
    addToCart({ productId, quantity }) {
      this.$emit('addToCart', {
        productId: productId,
        quantity: quantity
      })
    }
  }
}
</script>

<style scoped>
.product-list-container {
  max-width: 100%;
  box-sizing: border-box; 
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.list-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.product-count {
  color: #666;
  font-weight: bold;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 20px; 
  align-items: stretch;
}

.grid-item {
  height: 100%;
}

@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>