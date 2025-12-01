<template>
  <div class="filter-menu">
    <div class="filter-section">
      <div class="menu-header" @click="toggleMenu">
        <h3>Category</h3>
        <span class="arrow" :class="{ 'arrow-down': !isOpen }">▼</span>
      </div>

      <ul v-show="isOpen" class="menu-list">
        <li :class="{ active: selectedCategory === '' }">
          <button @click="selectCategory('')">All Products</button>
        </li>
        <li v-for="category in categories" :key="category" :class="{ active: selectedCategory === category }">
          <button @click="selectCategory(category)">
            {{ category }}
          </button>
        </li>
      </ul>
    </div>

    <div class="filter-section">
      <h3>Price Range</h3>
      <div class="price-inputs">
        <div class="input-group">
          <label>Min</label>
          <input type="number" v-model.number="minPrice" @change="updatePrice" min="0">
        </div>
        <div class="input-group">
          <label>Max</label>
          <input type="number" v-model.number="maxPrice" @change="updatePrice" min="0">
        </div>
      </div>
      
      <!-- <div class="range-container">
        <input 
          type="range" 
          v-model.number="maxPrice" 
          @input="updatePrice" 
          :min="minPrice" 
          max="3000" 
          step="50"
          class="slider"
        >
      </div> -->
    </div>

  </div>
</template>

<script>
export default {
  name: 'FilterMenu',
  props: {
    categories: Array,
    selectedCategory: String
  },
  emits: ['filterUpdate', 'priceUpdate'], 
  data() {
    return {
      isOpen: true,
      minPrice: 0,
      maxPrice: 3000 
    }
  },
  methods: {
    selectCategory(category) {
      this.$emit('filterUpdate', category);
    },
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    updatePrice() {
      if (this.minPrice > this.maxPrice) {
        this.minPrice = this.maxPrice;
      }
      this.$emit('priceUpdate', { min: this.minPrice, max: this.maxPrice });
    }
  }
}
</script>

<style scoped>
.filter-menu {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: left;
  overflow: hidden; 
}

.filter-section {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.filter-section:last-child {
  border-bottom: none;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.arrow {
  font-size: 0.8rem;
  color: #555;
  transition: transform 0.3s ease;
}

.arrow-down {
  transform: rotate(-90deg);
}

/* Category List Styles */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 5px;
}

button {
  background: none;
  border: none;
  color: #0046be;
  cursor: pointer;
  padding: 8px 10px;
  text-align: left;
  width: 100%;
  font-size: 0.95rem;
  border-radius: 4px;
  transition: background 0.2s;
}

button:hover {
  background-color: #f0f0f0;
  text-decoration: none;
  color:#0046be;
}

li.active button {
  background-color: #0046be;
  color: white;
  font-weight: bold;
}

li.active button:hover{
  color: #FFF007
}


/* Price Section Styles */
.price-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.input-group label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 2px;
}

.input-group input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.slider {
  width: 100%;
  cursor: pointer;
}
</style>