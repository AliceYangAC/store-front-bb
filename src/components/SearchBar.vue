<template>
  <div class="search-container" @keydown.enter="performSearch">
    <div class="search-input-wrapper">
      <input 
        type="search"
        v-model="searchTerm"
        @input="handleSearch" 
        @focus="showSuggestions = true"
        @blur="hideSuggestions"
        @keydown.arrow-down="highlightNext"
        @keydown.arrow-up="highlightPrev"
        placeholder="Search Best Buy"
        class="search-input"
      />
      <button class="search-btn" @click="performSearch" aria-label="Search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
    
    <!-- 3. Suggestion Dropdown -->
    <ul v-if="searchTerm && suggestions.length && showSuggestions" class="suggestions-dropdown">
      <li
        v-for="(product, index) in suggestions"
        :key="product.id"
        :class="{ 'highlighted': index === highlightedIndex }"
        @mousedown.prevent="goToProductPage(product)"
        @mouseover="highlightedIndex = index"
      >
        {{ product.name }}
      </li>
    </ul>

  </div>
</template>

<script>
import { useDebounceFn } from '@vueuse/core';

export default {
  name: 'SearchBar',
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      searchTerm: '',
      suggestions: [],
      showSuggestions: false,
      highlightedIndex: -1,
    };
  },
  emits: ['search'], // 👈 Emits the final search term for filtering
  created() {
    // Debounces the search logic to run only after 300ms of inactivity
    this.handleSearch = useDebounceFn(this.triggerSuggestions, 300);
  },
  methods: {
    triggerSuggestions() {
      const query = this.searchTerm ? this.searchTerm.toLowerCase() : '';

      if (!query.trim()) {
        this.suggestions = [];
        this.showSuggestions = false;
      } else {
        // Filter the local product list for suggestions
        this.suggestions = this.products.filter(product =>
          product.name && product.name.toLowerCase().includes(query)
        ).slice(0, 7);
        this.showSuggestions = true;
      }
    },
    
    performSearch() {
      // If an item is highlighted (keyboard navigation), go to detail page
      if (this.highlightedIndex !== -1) {
        this.goToProductPage(this.suggestions[this.highlightedIndex]);
        return;
      }
      
      // If text is entered, emit the event to App.vue to filter the ProductList
      if (this.searchTerm.trim() !== '') {
        this.$emit('search', this.searchTerm);
        this.showSuggestions = false;
      }
    },
    
    goToProductPage(product) {
      const productId = product.id;
      this.$router.push(`/product/${productId}`);
      this.searchTerm = '';
      this.showSuggestions = false;
    },
    
    // Keyboard navigation handlers
    highlightNext() {
      if (!this.suggestions.length) return;
      this.highlightedIndex = (this.highlightedIndex + 1) % this.suggestions.length;
    },
    highlightPrev() {
      if (!this.suggestions.length) return;
      this.highlightedIndex = (this.highlightedIndex - 1 + this.suggestions.length) % this.suggestions.length;
    },
    hideSuggestions() {
      // Small delay to allow click event on suggestion to register before hiding
      setTimeout(() => {
        this.showSuggestions = false;
        this.highlightedIndex = -1;
      }, 150);
    }
  }
};
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #0046BE; /* Best Buy Look */
  border-radius: 4px; 
  background-color: #fff;
}

.search-input {
  flex-grow: 1;
  border: none;
  padding: 10px 45px 10px 15px; 
  font-size: 1rem;
  outline: none;
  background-color: transparent;
  color: #333;
}

.search-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333; 
  position: absolute;
  right: 0; 
  top: 50%;
  transform: translateY(-50%);
  padding: 0 10px;
  z-index: 5; 
}

.search-btn svg {
  color: #333;
  fill: currentColor;
}

.search-btn:hover svg {
  color: #0046BE;
}

/* Dropdown Styling */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  list-style: none;
  margin: 2px 0 0 0;
  padding: 0;
  background: white;
  border: 1px solid #0046BE;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
}

.suggestions-dropdown li {
  padding: 10px 15px;
  cursor: pointer;
  text-align: left;
  color: #333;
  font-size: 0.95rem;
}

.suggestions-dropdown li:hover,
.suggestions-dropdown li.highlighted {
  background-color: #f0f0f0;
}
</style>