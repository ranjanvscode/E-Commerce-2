// productui.js
import { formatCurrency, generateStars } from './utils.js';
import { addToCart } from './cart-actions.js';

export function renderProducts(products = []) {
  const container = document.getElementById("productGrid");

  if (!products.length) {
    container.classList.add("hidden");
    document.getElementById("noResults")?.classList.remove("hidden");
    return;
  }

  container.classList.remove("hidden");
  document.getElementById("noResults")?.classList.add("hidden");

  container.innerHTML = products
    .map(
      (product) => `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div class="relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover cursor-pointer" onclick="openProductModal('${product.id}')">
            ${product.discount > 0 ? `<div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">${product.discount}%</div>` : ""}
            ${!product.inStock ? `<div class="absolute top-3 right-3 bg-gray-800 text-white px-2 py-1 rounded-md text-sm font-semibold">Out of Stock</div>` : ""}
            <div class="absolute top-60 right-4">
              <div class="bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-sm font-semibold flex items-center">
                <i class="fas fa-star text-yellow-400 mr-1"></i>${product.rating}
              </div>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-2 cursor-pointer hover:text-primary-600 transition-colors" onclick="openProductModal('${product.id}')">${product.name}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${product.description.substring(0, 80)}...</p>
            <div class="mb-4">
              ${product.discount > 0 ? `
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-bold text-green-600">${formatCurrency(product.discountPrice.toFixed(2))}</span>
                  <span class="text-lg text-gray-500 line-through">${formatCurrency(product.price.toFixed(2))}</span>
                  <span class="text-sm text-green-600 font-semibold">Save ${formatCurrency((product.price - product.discountPrice).toFixed(2))}</span>
                </div>` : `
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-gray-800 dark:text-gray-300">${formatCurrency(product.price.toFixed(2))}</span>
                </div>`
              }
            </div>
            <div>
              ${product.inStock ? `
                <div class="flex items-center gap-2">
                  <button onclick="addToCart('${product.id}')" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                    <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                    Add to Cart
                  </button>
                </div>` : `
                <button disabled class="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">Out of Stock</button>`
              }
            </div>
          </div>
        </div>`
    )
    .join("");
}
