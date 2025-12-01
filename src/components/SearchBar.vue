<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <input 
        type="search"
        v-model="searchTerm"
        @input="handleSearch" 
        placeholder="Search Best Buy"
        class="search-input"
      />
      <button class="search-btn" @click="selectFirstSuggestion" aria-label="Search">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
    
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
      suggestions: []
    };
  },
  created() {
    this.handleSearch = useDebounceFn(this.triggerFilter, 300);
  },
  methods: {
    triggerFilter() {
      const query = this.searchTerm ? this.searchTerm.toLowerCase() : '';

      if (!query.trim()) {
        this.suggestions = [];
      } else {
        this.suggestions = this.products.filter(product =>
          product.name && product.name.toLowerCase().includes(query)
        ).slice(0, 10);
      }
    },
    selectFirstSuggestion() {
      if (this.suggestions.length > 0) {
        this.goToProductPage({ value: this.suggestions[0] });
      } else if (this.searchTerm.trim() !== '') {
        this.$router.push({ path: '/', query: { search: this.searchTerm } });
      }
    },
    goToProductPage(event) {
      const productId = event.value.id;
      this.$router.push(`/product/${productId}`);
      this.searchTerm = '';
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
  border: 1px solid #ccc;
  border-radius: 4px; 
  overflow: hidden;
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
</style>