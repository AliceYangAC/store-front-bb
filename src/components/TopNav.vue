<template>
  <nav>
    <div class="logo">
      <router-link to="/" @click="closeNav">
        <img src="/best-buy-logo.png" alt="Best Buy Logo">
      </router-link>
    </div>
    
    <SearchBar :products="products" /> 

    <button class="hamburger" @click="toggleNav">
      <span class="hamburger-icon"></span>
    </button>
    <ul class="nav-links" :class="{ 'nav-links--open': isNavOpen }">
      <li><router-link to="/" @click="closeNav">Products</router-link></li>
      <li><router-link to="/cart" @click="closeNav">Cart ({{ cartItemCount }})</router-link></li>
    </ul>
  </nav>
</template>

<script>
import SearchBar from './SearchBar.vue';

export default {
  name: 'TopNav',
  components: {
    SearchBar 
  },
  props: {
    cartItemCount: Number,
    products: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isNavOpen: false
    }
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen
    },
    closeNav() {
      this.isNavOpen = false
    }
  }
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  background-color: #0046BE;
  color: #fff;
  padding-top: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 0.25rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.search-container {
    flex-grow: 0; 
    margin: 0 20px; 
    max-width: 500px;
}

nav img {
  width: 120px;
  height: auto;
}

.nav-links {
  flex-shrink: 0; 
  display: flex;
  list-style: none;
  /* font-size: 1.2rem;
  font-weight: bold; */
}

.nav-links li a {
  color: white; 
  text-decoration: none;
}

.nav-links li a:hover {
  color: #FFF007; 
  text-decoration: none;
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  margin-top: 0; 
}

.hamburger-icon {
  display: block;
  width: 20px;
  height: 2px;
  background-color: #fff;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.hamburger-icon::before,
.hamburger-icon::after {
  content: '';
  display: block;
  width: 20px;
  height: 2px;
  background-color: #fff;
  position: absolute;
  left: 0;
}

.hamburger-icon::before {
  top: -6px;
}

.hamburger-icon::after {
  bottom: -6px;
}

@media (max-width: 768px) {
  .search-container {
    order: 3; 
    margin: 0;
    width: 100%;
    max-width: none;
    position: absolute;
    top: 100%;
    left: 0;
    padding: 0.5rem 1rem;
    background-color: #0046BE; 
  }

  .nav-links {
    display: none;
    position: absolute;
    top: calc(100% + 50px); 
    left: 0;
    right: 0;
    background-color: #333;
    padding: 1rem;
  }

  .nav-links--open {
    display: block;
  }

  .nav-links--open li {
    padding: 0.5rem 0;
  }

  .hamburger {
    display: block;
  }
}
</style>