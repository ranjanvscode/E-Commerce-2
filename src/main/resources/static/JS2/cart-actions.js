// cart-actions.js
import { showNotification } from './notification.js';
import { updateCartUI } from './cart.js';

let cart = [];
let allProducts = [];
let isAuthenticated = false;

export function setCart(data) {
  cart = [...data];
}

export function setProductList(products) {
  allProducts = [...products];
}

export function setAuthState(state) {
  isAuthenticated = state;
}

export function addToCart(productId, quantity = 1) {
  if (!isAuthenticated) {
    const loginModal = document.getElementById("loginModal");
    loginModal?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    return;
  }

  const product = allProducts.find((p) => String(p.id) === String(productId));
  const existingItem = cart.find(
    (item) => String(item.product.id) === String(productId)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    updateCartQuantity(productId, existingItem.quantity);
  } else {
    const cartData = { productId, quantity };

    fetch("/cart/SaveCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartData),
    })
      .then((res) => {
        if (res.ok) {
          showNotification(`${product.name} added to cart!`);
        } else {
          throw new Error("Failed to save cart");
        }
      })
      .catch((error) => console.error("Error:", error));

    cart.push({ id: product.id, product, quantity });
  }

  updateCartUI(cart);
}

export function updateCartQuantity(productId, quantity) {
  const item = cart.find((i) => String(i.product.id) === String(productId));
  if (item) {
    item.quantity = Math.max(1, quantity);
    updateCartUI(cart);

    fetch("/cart/updateCartQuantity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    }).catch((err) => console.error("Failed to update quantity:", err));
  }
}

export function removeFromCart(productId) {
  cart = cart.filter((item) => String(item.product.id) !== String(productId));
  updateCartUI(cart);

  fetch(`/cart/removeCartItem/${productId}`, {
    method: "DELETE",
  }).catch((err) => {
    console.error("Error removing item:", err);
    showNotification("Failed to remove item", "error");
  });
}
