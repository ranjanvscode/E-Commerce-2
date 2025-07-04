// filter.js
import { renderProducts } from './productui.js';

let allProducts = [];
let filteredProducts = [];

export function setAllProducts(products) {
  allProducts = [...products];
  filteredProducts = [...products];
}

export function getFilteredProducts() {
  return filteredProducts;
}

export function filterProducts(searchQuery = '') {
  const query = searchQuery.trim().toLowerCase();
  const category = document.getElementById("categoryFilter")?.value || "";
  const priceRange = document.getElementById("priceFilter")?.value || "";
  const sortBy = document.getElementById("sortFilter")?.value || "name";

  filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesCategory = !category || product.category === category;

    let matchesPrice = true;
    if (priceRange) {
      const [min, max] = priceRange.split("-").map((p) => p.replace("+", ""));
      if (max) {
        matchesPrice =
          product.price >= parseInt(min) && product.price <= parseInt(max);
      } else {
        matchesPrice = product.price >= parseInt(min);
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  switch (sortBy) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
    default:
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  renderProducts(filteredProducts);
}
