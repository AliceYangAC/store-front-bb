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
          <input 
            type="number" 
            v-model="minPrice" 
            @input="updatePrice" 
            min="0" 
            placeholder="0"
          >
        </div>
        <div class="input-group">
          <label>Max</label>
          <input 
            type="number" 
            v-model="maxPrice" 
            @input="updatePrice" 
            min="0" 
            placeholder="No Limit"
          >
        </div>
      </div>
      
      <div class="range-container">
        <div class="slider-fill" :style="rangeTrackStyle"></div>

        <input 
          type="range" 
          :value="minPrice === '' ? 0 : minPrice" 
          @input="sliderChange('min', $event)" 
          min="0" 
          :max="maxPriceLimit"   step="10"
          class="slider"
        >
        
        <input 
          type="range" 
          :value="maxPrice === '' ? maxPriceLimit : maxPrice" 
          @input="sliderChange('max', $event)" 
          min="0" 
          :max="maxPriceLimit"   step="10"
          class="slider"
        >
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'FilterMenu',
  props: {
    categories: Array,
    selectedCategory: String,
    maxPriceLimit: {
      type: Number,
      default: 9999
    }
  },
  emits: ['filterUpdate', 'priceUpdate'], 
  data() {
    return {
      isOpen: true,
      minPrice: 0,
      maxPrice: this.maxPriceLimit 
    }
  },
  watch: {
    maxPriceLimit(newVal) {
      if (this.maxPrice === 3000 || this.maxPrice > newVal) {
        this.maxPrice = newVal;
      }
    }
  },
  computed: {
    rangeTrackStyle() {
        const totalRange = this.maxPriceLimit; 
        
        const currentMin = (this.minPrice === '' || this.minPrice === null) ? 0 : this.minPrice;
        const currentMax = (this.maxPrice === '' || this.maxPrice === null) ? totalRange : this.maxPrice;

        const leftPercent = (currentMin / totalRange) * 100;
        const rightPercent = 100 - (currentMax / totalRange) * 100;

        return {
            left: `${leftPercent}%`,
            right: `${rightPercent}%`
        };
    }
  },
  methods: {
    selectCategory(category) {
      this.$emit('filterUpdate', category);
    },
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    sliderChange(type, event) {
        const val = parseInt(event.target.value);
        if (type === 'min') this.minPrice = val;
        if (type === 'max') this.maxPrice = val;
        this.updatePrice();
    },
    updatePrice() {
      let effectiveMin = (this.minPrice === '' || this.minPrice === null) ? 0 : parseFloat(this.minPrice);
      let effectiveMax = (this.maxPrice === '' || this.maxPrice === null) ? Infinity : parseFloat(this.maxPrice);

      if (effectiveMax !== Infinity && effectiveMin > effectiveMax) {
         effectiveMin = effectiveMax; 
         this.minPrice = effectiveMax;
      }

      this.$emit('priceUpdate', { min: effectiveMin, max: effectiveMax });
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

.price-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  margin-right: 15px

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

.range-container {
  position: relative;
  height: 40px; 
  width: 100%;
  display: flex;
  align-items: center;
}

.slider {
  pointer-events: none; 
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  background: none; 
  -webkit-appearance: none;
  z-index: 2; 
}

.slider::-webkit-slider-thumb {
  pointer-events: all; 
  cursor: pointer;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0046be;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  -webkit-appearance: none;
  margin-top: -7px;
  z-index: 3;
}

.slider::-moz-range-thumb {
  pointer-events: all;
  cursor: pointer;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0046be;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  z-index: 3;
}

.range-container::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
}

.slider-fill {
  position: absolute;
  height: 4px;
  background: #0046be;
  border-radius: 2px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1; 
}
</style>