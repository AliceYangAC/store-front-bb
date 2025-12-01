<template>
  <div class="rec-container" v-if="recommendations.length > 0">
    <h3 class="rec-title">Customers like you also bought...</h3>
    
    <div class="rec-list">
      <div 
        v-for="(product, index) in recommendations" 
        :key="product.id" 
        class="rec-item-wrapper"
      >
        <div class="rec-card">
            <ProductCard 
            :product="product" 
            @addToCart="$emit('addToCart', $event)"
            />
        </div>

        <div v-if="index < recommendations.length - 1" class="plus-sign">
          +
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductRec',
  components: { ProductCard },
  props: {
    currentProductId: {
      type: [Number, String],
      required: true
    },
    allProducts: {
      type: Array,
      default: () => []
    }
  },
  emits: ['addToCart'],
  data() {
    return {
      recommendations: []
    }
  },
  watch: {
    // Re-fetch if the user navigates from one product to another
    currentProductId: {
      immediate: true,
      handler() {
        this.fetchRecommendations();
      }
    }
  },
  methods: {
    async fetchRecommendations() {
      if (!this.currentProductId) return;
      
      console.log(`Fetching recommendations for Product ID: ${this.currentProductId}`);

      try {
        const response = await fetch(`http://localhost:3005/recommendations/${this.currentProductId}`);
        
        if (response.ok) {
          const recommendedIds = await response.json();
          console.log("Recommended IDs from Backend:", recommendedIds);

          this.recommendations = recommendedIds
            .map(id => this.allProducts.find(p => p.id == id))
            .filter(p => p);
            
          console.log("Final Product Objects:", this.recommendations);
        } else {
            console.error("Backend returned error:", response.status);
            this.recommendations = [];
        }
      } catch (e) {
        console.error("Fetch failed:", e);
        this.recommendations = [];
      }
    }
  }
}
</script>

<style scoped>
.rec-container {
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: left;
}

.rec-title {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #333;
}

.rec-list {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto; /* Allow scroll on small screens */
  padding-bottom: 15px;
}

.rec-item-wrapper {
  display: flex;
  align-items: center;
}

/* Scale down the cards slightly to fit better as "recommendations" */
.rec-card {
  width: 250px;
  flex-shrink: 0;
}

.plus-sign {
  font-size: 3rem;
  color: #ccc;
  margin: 0 20px;
  font-weight: 300;
  user-select: none;
}

@media (max-width: 768px) {
  .rec-list {
    flex-direction: column;
    align-items: center;
  }
  
  .plus-sign {
    transform: rotate(90deg); /* Rotate plus sign for vertical layout */
    margin: 20px 0;
  }
  
  .rec-card {
    width: 100%;
    max-width: 300px;
  }
}
</style>