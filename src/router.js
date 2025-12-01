import { createWebHistory, createRouter } from "vue-router";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ShoppingCart from "./components/ShoppingCart";
import SearchList from "./components/SearchList";

const routes = [
  { path: "/", component: ProductList },
  { path: "/product/:id", component: ProductDetail },
  { path: "/cart", component: ShoppingCart },
  { path: '/search', component: SearchList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;