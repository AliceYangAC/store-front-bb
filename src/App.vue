<template>
  <TopNav :cartItemCount="cartItemCount"/>
  
  <div class="main-container">
    
    <aside class="sidebar" v-if="$route.path === '/'">
      <FilterMenu 
        :categories="uniqueCategories" 
        :selectedCategory="currentCategory"
        @filterUpdate="updateCategory"
        @priceUpdate="updatePrice" 
      />
    </aside>

    <main class="content" :class="{ 'full-width': $route.path !== '/' }">
      <router-view
        :products="filteredProducts"
        :cartItems="cartItems"
        @addToCart="addToCart"
        @removeFromCart="removeFromCart"
        @submitOrder="submitOrder"
      ></router-view>
    </main>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'
import FilterMenu from './components/FilterMenu.vue'

export default {
  name: 'App',
  components: {
    TopNav,
    FilterMenu
  },
  data() {
    return {
      cartItems: [],
      products: [],
      currentCategory: '',
      filterMinPrice: 0,
      filterMaxPrice: 10000
    }
  },
  computed: {
    cartItemCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
    uniqueCategories() {
      const categories = this.products.map(p => p.category).filter(c => c);
      return [...new Set(categories)].sort();
    },
    filteredProducts() {
      return this.products.filter(p => {
        const matchesCategory = this.currentCategory === '' || p.category === this.currentCategory;
        const price = parseFloat(p.price); 
        const matchesPrice = price >= this.filterMinPrice && price <= this.filterMaxPrice;

        return matchesCategory && matchesPrice;
      });
    }
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    updateCategory(category) {
      this.currentCategory = category;
      if (this.$route.path !== '/') this.$router.push('/');
    },
    updatePrice({ min, max }) {
      this.filterMinPrice = min;
      this.filterMaxPrice = max;
    },
    getProducts() {
      fetch('/products')
        .then(response => response.json())
        .then(products => {
          this.products = products
        })
        .catch(error => console.log(error))
    },
    addToCart({ productId, quantity }) {
      const existingCartItem = this.cartItems.find(item => item.product.id == productId)
      if (existingCartItem) {
        existingCartItem.quantity += quantity
      } else {
        const product = this.products.find(product => product.id == productId)
        this.cartItems.push({ product, quantity })
      }
    },
    removeFromCart(index) {
      this.cartItems.splice(index, 1)
    },
    submitOrder() {
      const order = {
        customerId: Math.floor(Math.random() * 10000000000).toString(),
        items: this.cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
        }))
      }
      fetch(`/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      }).then(response => {
          if (!response.ok) alert('Error');
          else {
            this.cartItems = [];
            alert('Order submitted');
          }
      })
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

body {
  background-color: #f9f9f9;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 120px;
}

.main-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
  align-items: flex-start;
}

.sidebar {
  flex: 0 0 25%;
  max-width: 300px;
  position: sticky;
  top: 140px;
}

.content {
  flex: 1;
  min-width: 0;
}

.content.full-width {
  flex: 0 0 100%; 
  max-width: 100%;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  .sidebar {
    flex: 0 0 100%;
    width: 100%;
    max-width: none;
    position: static;
    margin-bottom: 20px;
  }
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #0a5620;
  color: #fff;
  padding: 1rem;
  margin: 0;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin: 0 1rem;
}

a {
  color: #fff;
  text-decoration: none;
}

button {
  padding: 10px;
  background-color: #005f8b;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 42px;
}
.checkout-button:hover {
  background-color: #005f8b;
}

.quantity-input {
  width: 50px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  margin-right: 10px;
}
.content.full-width {
  flex: 0 0 100%; 
  max-width: 100%;
}
.main-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
  align-items: flex-start;
}

.sidebar {
  flex: 0 0 25%;
  max-width: 300px; 
  position: sticky;
  top: 140px; 
}

.content {
  flex: 1; 
  min-width: 0; 
}

.sidebar ul {
  flex-direction: column; 
}
</style>