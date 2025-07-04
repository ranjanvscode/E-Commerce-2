// main.js
import { setupSearch } from "./search.js";
import { improveAccessibility } from "./accessibility.js";
import { updateCartTotalUI } from "./cart.js";
import { showNotification } from "./notification.js";
import { fetchReceiptId, rzpCheckout } from "./payment.js";
import { setAllProducts, filterProducts } from './filter.js';
import {addToCart,removeFromCart,updateCartQuantity,setCart,
        setProductList,setAuthState} from './cart-actions.js';
import { renderProducts } from './productui.js';

let allProducts = [],
  filteredProducts = [],
  cart = [],
  shippingFee = 0;

// function renderProducts() {
//   const container = document.getElementById("productGrid");
//   container.innerHTML = filteredProducts
//     .map((p) => `<div>${p.name} - ₹${p.price}</div>`) // simplify demo
//     .join("");
// }

window.addEventListener("DOMContentLoaded", () => {
  fetch("/products/getAllProduct")
    .then((res) => res.json())
    .then((products) => {
      allProducts = [...products];
      filteredProducts = [...products];
    //   renderProducts();
     renderProducts(filteredProducts);
      setupSearch();
      improveAccessibility();

      if (typeof isAuthenticated !== "undefined" && isAuthenticated) {
        return fetch("/cart/getAllCartItems").then((res) => res.json());
      }
    })
    .then((cartItems) => {
      if (cartItems) {
        cart = cartItems;
        updateCartTotalUI(cart, shippingFee);
      }
    })
    .catch((err) => {
      showNotification("Failed to load data", "error");
      console.error("Load error:", err);
    });
});


document.getElementById("checkoutBtn").addEventListener("click", async () => {
    const amount = cart.reduce((sum, item) => {
                        const price = item.product?.discountPrice > 0
                                    ? item.product.discountPrice
                                    : item.product?.price ?? 0;
                        return sum + price * item.quantity;
                        }, 0);

  const receipt = await fetchReceiptId();
  const name = document.getElementById("addName").value;
  const phone = document.getElementById("addPhoneNo").value;
  await rzpCheckout(amount,receipt, name, phone, RAZORPAY_KEY_ID);
});


// On load
setProductList(allProducts);
setCart(cartItems);
setAuthState(typeof isAuthenticated !== 'undefined' && isAuthenticated);

setAllProducts(products);
filterProducts();

// Cart sidebar toggle
function setupCartSidebar() {
  const cartToggle = document.getElementById("cartToggle");
  const closeCart = document.getElementById("closeCart");

  cartToggle.addEventListener("click", () => {
    cartSidebar.classList.remove("translate-x-full");
    cartOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

  closeCart.addEventListener("click", closeCartSidebar);
  cartOverlay.addEventListener("click", closeCartSidebar);
}

function closeCartSidebar() {
  cartSidebar.classList.add("translate-x-full");
  cartOverlay.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Product modal
function openProductModal(productId) {
  currentProduct = allProducts.find((p) => String(p.id) === String(productId));

  const modal = document.getElementById("productModal");

  document.getElementById("modalTitle").textContent = currentProduct.name;
  document.getElementById("modalImage").src = currentProduct.image;
  document.getElementById("modalImage").alt = currentProduct.name;
  document.getElementById("modalPrice").textContent = `${formatCurrency(
    currentProduct.discountPrice > 0
      ? currentProduct.discountPrice
      : currentProduct.price
  )}`;
  document.getElementById("modalDescription").textContent =
    currentProduct.description;
  document.getElementById("modalRating").innerHTML = generateStars(
    currentProduct.rating
  );
  document.getElementById(
    "modalRatingText"
  ).textContent = `(${currentProduct.rating}/5)`;
  document.getElementById("modalQuantity").value = 1;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function setupProductModal() {
  const modal = document.getElementById("productModal");
  const closeModal = document.getElementById("closeModal");
  const modalAddToCart = document.getElementById("modalAddToCart");
  const decreaseQty = document.getElementById("decreaseQty");
  const increaseQty = document.getElementById("increaseQty");
  const modalQuantity = document.getElementById("modalQuantity");

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });

  modalAddToCart.addEventListener("click", () => {
    const quantity = parseInt(modalQuantity.value);
    addToCart(currentProduct.id, quantity);
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  decreaseQty.addEventListener("click", () => {
    const current = parseInt(modalQuantity.value);
    if (current > 1) {
      modalQuantity.value = current - 1;
    }
  });

  increaseQty.addEventListener("click", () => {
    const current = parseInt(modalQuantity.value);
    modalQuantity.value = current + 1;
  });
}

// Authentication modals
function setupAuthModals() {
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const closeLoginModal = document.getElementById("closeLoginModal");
  const closeSignupModal = document.getElementById("closeSignupModal");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  loginBtn.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

  closeLoginModal.addEventListener("click", () => {
    loginModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  closeSignupModal.addEventListener("click", () => {
    signupModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  showSignup.addEventListener("click", () => {
    loginModal.classList.add("hidden");
    signupModal.classList.remove("hidden");
  });

  showLogin.addEventListener("click", () => {
    signupModal.classList.add("hidden");
    loginModal.classList.remove("hidden");
  });

  loginForm.addEventListener("submit", (e) => {
    // e.preventDefault();
    loginModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  signupForm.addEventListener("submit", (e) => {
    signupModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });
}