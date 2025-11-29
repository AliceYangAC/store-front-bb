<template>
  <div class="product-carousel-container">
    <div class="carousel-header">
      <h2>Featured Products</h2>
      <div class="carousel-controls">
        <button @click="scrollLeft" class="nav-btn">&lt;</button>
        <button @click="scrollRight" class="nav-btn">&gt;</button>
      </div>
    </div>

    <div class="carousel-track" ref="carousel">
      <div class="carousel-item" v-for="product in products" :key="product.id">
        <ProductCard
          :product="product"
          @addToCart="addToCart"
        />
      </div>
    </div>
    
  </div>
</template>

<script>
  import ProductCard from '../components/ProductCard'

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
      },
      scrollLeft() {
        // Scroll left by 300px (approx width of one card)
        this.$refs.carousel.scrollBy({
          left: -320,
          behavior: 'smooth'
        });
      },
      scrollRight() {
        // Scroll right by 300px
        this.$refs.carousel.scrollBy({
          left: 320,
          behavior: 'smooth'
        });
      }
    }
  }
</script>

<style scoped>
.product-carousel-container {
  max-width: 100%;
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 10px; 
}

.carousel-controls {
  display: flex;
  gap: 10px;
}

.nav-btn {
  background-color: #0046be;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: #002a75;
}

.carousel-track {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden; 
  align-items: stretch;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding: 20px; 
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 300px;
  width: 300px; 
  scroll-snap-align: start;
  display: flex; 
}
</style>