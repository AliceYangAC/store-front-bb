<template>
  <div class="search-results-container">
    
    <router-link to="/" class="back-link-margin">
      ← Back to All Products
    </router-link>

    <div class="list-header">
      <div class="header-content">
        
        <h2 class="main-heading">Search Results for "{{ currentSearchQuery }}"</h2>

        <span class="product-count">{{ filteredResults.length }} items</span>
        
      </div>
    </div>

    <div class="product-grid">
      <div class="grid-item" v-for="product in filteredResults" :key="product.id">
        <ProductCard
          :product="product"
          @addToCart="addToCart"
        />
      </div>
    </div>

    <div v-if="!filteredResults.length">
        <p>No products found matching "{{ currentSearchQuery }}".</p>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue' 

export default {
  name: 'SearchList',
  components: {
    ProductCard
  },
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    currentSearchQuery() {
      return this.$route.query.q || ''; 
    },
    
    filteredResults() {
      const query = this.currentSearchQuery.toLowerCase().trim();
      
      if (!query) {
        return [];
      }
      
      return this.products.filter(product => {
        // 1. Check Name
        const nameMatch = product.name.toLowerCase().includes(query);
        
        // 2. Check Category (Ensure property exists first)
        const categoryMatch = product.category && product.category.toLowerCase().includes(query);

        // Return true if EITHER matches
        return nameMatch || categoryMatch;
      });
    }
  },
  methods: {
    addToCart(event) {
        this.$emit('addToCart', event);
    }
  }
}
</script>

<style scoped>
.search-results-container {
    max-width: 100%;
    box-sizing: border-box; 
    padding: 0 20px;
}

.back-link-margin {
    display: block; 
    text-align: left;
    margin-bottom: 20px;
    color: #0046BE;
    font-size: 1rem;
    font-weight: bold;
}

.back-link-margin:hover {
    color: #002a80;
    text-decoration: underline;
}

.list-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

/* Flex Row for Heading and Count */
.header-content {
    display: flex;
    justify-content: space-between; 
    align-items: baseline;
    margin-top: 10px;
}

.main-heading {
    margin: 0;
    font-size: 1.5rem; 
    text-align: left;
    flex-shrink: 1;
}

.product-count {
    color: #666; 
    font-weight: bold;
    flex-shrink: 0;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    gap: 20px; 
    align-items: stretch;
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