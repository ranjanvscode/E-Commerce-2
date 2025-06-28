
// Global variables
let cart = [];
let filteredProducts = [];
let allProducts = [];
let currentProduct = null;
let receiptId = null;
let paymentMethod = null;
let totalAmount = null;
let shippingFee = 0;

// DOM elements
const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const emptyCart = document.getElementById("emptyCart");
const cartFooter = document.getElementById("cartFooter");
const noResults = document.getElementById("noResults");

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

// Render products
function renderProducts(productsToRender = filteredProducts) {
  if (productsToRender.length === 0) {
    productGrid.classList.add("hidden");
    noResults.classList.remove("hidden");
    return;
  }

  productGrid.classList.remove("hidden");
  noResults.classList.add("hidden");

  productGrid.innerHTML = productsToRender
    .map(
      (product) => `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div class="relative">
                        <img src="${product.image}" alt="${
                          product.name
                        }" class="w-full h-64 object-cover cursor-pointer" onclick="openProductModal('${
                          product.id
                        }')">
                        
                        <!-- Discount Badge -->
                        ${product.discount>0 ? `
                            <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                                ${product.discount}%
                            </div>
                        ` : ''}
                          
                        <!-- Stock Status -->
                        ${!product.inStock ? `
                            <div class="absolute top-3 right-3 bg-gray-800 text-white px-2 py-1 rounded-md text-sm font-semibold">
                                Out of Stock
                            </div>
                        ` : ''}

                        <div class="absolute top-60 right-4">
                            <div class="bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-sm font-semibold flex items-center">
                                <i class="fas fa-star text-yellow-400 mr-1"></i>
                                ${product.rating}
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-semibold mb-2 cursor-pointer hover:text-primary-600 transition-colors" onclick="openProductModal('${
                          product.id
                        }')">${product.name}</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${product.description.substring(
                          0,
                          80
                        )}...</p>

                        <!-- Pricing -->
                        <div class="mb-4">
                            ${product.discount>0 ? `
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl font-bold text-green-600">${formatCurrency(product.discountPrice.toFixed(2))}</span>
                                    <span class="text-lg text-gray-500 line-through">${formatCurrency(product.price.toFixed(2))}</span>
                                    <span class="text-sm text-green-600 font-semibold">Save ${formatCurrency((product.price-product.discountPrice).toFixed(2))}</span>
                                </div>
                            ` : `
                                <div class="flex items-center">
                                    <span class="text-2xl font-bold text-gray-800 dark:text-gray-300">${formatCurrency(product.price.toFixed(2))}</span>
                                </div>
                            `}
                        </div>


                       <!-- <div class="flex items-center justify-between">
                            <span class="text-2xl font-bold text-primary-600">${formatCurrency(
                              product.price
                            )}</span>
                            <button onclick="addToCart('${
                              product.id
                            }')" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                                <i class="fas fa-cart-plus"></i>
                                <span>Add to Cart</span>
                            </button>
                        </div> -->

                        <div>
                            ${product.inStock ? `
                            <div class="flex items-center gap-2">
                            
                                <button onclick="addToCart('${product.id}')" 
                                        class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                                    <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                                    Add to Cart
                                </button>
                            </div>
                        ` : `
                            <button disabled class="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
                                Out of Stock
                            </button>
                        `}
                        </div>

                    </div>
                </div>`
              ).join("");
}

// Search functionality
function setupSearch() {
  const searchInputs = [
    document.getElementById("searchInput"),
    document.getElementById("mobileSearchInput"),
  ];

  searchInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      filterProducts();
    });
  });
}

// Filter functionality
function setupFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const sortFilter = document.getElementById("sortFilter");

  [categoryFilter, priceFilter, sortFilter].forEach((filter) => {
    filter.addEventListener("change", filterProducts);
  });
}

function filterProducts() {
  const searchQuery =
    document.getElementById("searchInput").value.toLowerCase() ||
    document.getElementById("mobileSearchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const priceRange = document.getElementById("priceFilter").value;
  const sortBy = document.getElementById("sortFilter").value;

  filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery);
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

  // Sort products
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

  renderProducts();
}

//cart functionality
function addToCart(productId, quantity = 1) {
  if (!isAuthenticated) {
    console.log("Login modal work", isAuthenticated);
    loginModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    return;
  }

  const product = allProducts.find((p) => String(p.id) === String(productId));
  const existingItem = cart.find(
    (item) => String(item.product.id) === String(productId)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    quantity = existingItem.quantity;
    updateCartUI();
    updateCartQuantity(productId, quantity);
    quantity = 0;
  } else {
    const cartData = {
      productId: productId,
      quantity: quantity,
    };

    fetch("/cart/SaveCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartData),
    })
      .then((response) => {
        if (response.ok) {
          return;
        }
        throw new Error("Failed to save cart");
      })
      .then((data) => {
        showNotification(`${product.name} added to cart!`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    cart.push({ id: product.id, product, quantity });

    updateCartUI();
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => String(item.product.id) !== String(productId));

  fetch(`/cart/removeCartItem/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      return;
    })
    .then((message) => {
      // showNotification(message);
    })
    .catch((error) => {
      console.error("Error removing cart item:", error);
      showNotification("Failed to remove item from cart");
    });

  updateCartUI();
}

function updateCartQuantity(productId, quantity) {
  const item = cart.find(
    (item) => String(item.product.id) === String(productId)
  );
  if (item) {
    item.quantity = Math.max(1, quantity);
    updateCartUI();

    const cartData = {
      productId: productId,
      quantity: quantity,
    };

    fetch("/cart/updateCartQuantity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartData),
    })
      .then((response) => {
        if (response.ok) {
          // showNotification(`${product.name} added to cart!`);
          return;
        }
        throw new Error("Failed to save cart");
      })
      .then((data) => {
        // showNotification(`${product.name} added to cart!`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  // const totalPrice = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity,0);
  // const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const totalPrice = cart.reduce((sum, item) => {
  const price = item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price || 0;
  return sum + price * item.quantity; 
  }, 0);


  cartCount.textContent = totalItems;
  cartTotal.textContent = `${formatCurrency(totalPrice.toFixed(2))}`;
  document.getElementById("subtotalAmount").textContent = `${formatCurrency(totalPrice.toFixed(2))}`;
  document.getElementById("shippingAmount").textContent = shippingFee;
  document.getElementById("checkoutTotal").textContent = `${formatCurrency((totalPrice + shippingFee).toFixed(2))}`

  if (cart.length === 0) {
    emptyCart.classList.remove("hidden");
    cartFooter.classList.add("hidden");
    cartItems.innerHTML =
      '<div id="emptyCart" class="text-center py-12"><i class="fas fa-shopping-cart text-6xl text-gray-400 mb-4"></i><p class="text-gray-500 dark:text-gray-400">Your cart is empty</p></div>';
  } else {
    emptyCart.classList.add("hidden");
    cartFooter.classList.remove("hidden");

    cartItems.innerHTML = cart.map((item) => `
                    <div class="flex items-center space-x-4 py-4 border-b border-gray-200 dark:border-gray-700">
                            <img src="${item.product.imageId || item.product.image}" alt="${item.product.name}" class="w-16 h-16 object-cover rounded">
                           
                            <div class="flex-1">
                                <h4 class="font-semibold">${item.product.name}</h4>

                              ${item.product.discountPrice>0
                                ?`<p class="text-primary-600 font-bold">${formatCurrency(item.product.discountPrice)}</p>`
                                :`<p class="text-primary-600 font-bold">${formatCurrency(item.product.price)}</p>`
                              } 
                            </div>

                            <div class="flex items-center space-x-2">
                                <button onclick="updateCartQuantity('${
                                  item.product.id
                                }', ${
                             item.quantity - 1
                            })" class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">-</button>
                                    <span class="w-8 text-center">${
                                      item.quantity
                                    }</span>
                                <button onclick="updateCartQuantity('${
                                  item.product.id
                                }', ${
                              item.quantity + 1
                            })" class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">+</button>
                            </div>
                            <button onclick="removeFromCart('${
                              item.product.id
                            }')" class="text-red-500 hover:text-red-700 transition-colors">
                                <i class="fas fa-trash"></i>
                            </button>
                    </div>`
      ).join("");
  }
}

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
  document.getElementById("modalPrice").textContent = `${formatCurrency(currentProduct.discountPrice > 0 ? currentProduct.discountPrice : currentProduct.price)}`;
  document.getElementById("modalDescription").textContent = currentProduct.description;
  document.getElementById("modalRating").innerHTML = generateStars(currentProduct.rating);
  document.getElementById("modalRatingText").textContent = `(${currentProduct.rating}/5)`;
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

//Setup Checkout model
function setupCheckoutModal() {
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeCheckoutModal = document.getElementById("closeCheckoutModal");
  const checkoutForm = document.getElementById("checkoutForm");

  checkoutBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("hidden");
    closeCartSidebar();
    document.body.style.overflow = "hidden";
  });

  closeCheckoutModal.addEventListener("click", () => {
    checkoutModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

      totalAmount = cart.reduce((sum, item) => {
          const price = item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price || 0;
          return sum + price * item.quantity;
          }, 0);

    await fetchReceiptId(); // Generate Receipt ID

    paymentMethod = document.getElementById("paymentMethod").value;

    if (paymentMethod === "prepaid") {
      rzpCheckout(); // payment gatway
    } else {
      SaveOrderData();
    }
  });
}



//Payment System
//1. Create order
function rzpCheckout() {

  // const amount = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity,0);
  const amount = parseFloat(totalAmount+shippingFee).toFixed(2);
  console.log("PAisaCheking:",totalAmount,":Amount",amount);

  if (isNaN(amount) && amount <= 0 && !amount) {
    alert("Please enter a valid amount greater than 0");
    return;
  }

  // Fetch order from backend
  fetch(`/payment/createOrder?amount=${amount}&receipt=${receiptId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((order) => {
      if (order.error) {
        alert("Error: " + order.error);
        return;
      }

      let name = document.getElementById("addName").value;
      let phoneNo = document.getElementById("addPhoneNo").value;

      const options = {
        // key: "rzp_test_kM7HJJbp7bkdwA",
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "RMR",
        description: "Payment for your order",
        image: "",
        order_id: order.id,
        handler: function (response) {
          verifySignature(response);
        },
        prefill: {
          name: name,
          email: "",
          contact: phoneNo,
        },
        notes: {
          receipt_id: "Receipt id in note",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {

        alert("FAILED: " + response.error.description);

        fetch("/payment/failure", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                razorpay_order_id: response.error.metadata.order_id,
                razorpay_payment_id: response.error.metadata.payment_id,
                reason: response.error.reason,
                code: response.error.code,
                description: response.error.description,
                source: response.error.source,
                step: response.error.step
            })
        })
        .then(res => res.text())
        .then(data => console.log("Failure saved:", data))
        .catch(err => console.error("Failure save error:", err));
      });

      rzp1.open();
    });
}

//Verify Payment Signature
function verifySignature(response) {
  fetch("/payment/verifySignature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }),
  })
    .then((res) => res.text())
    .then((data) => {
      console.log("Signature Verification Response:", data);

      if (data === "Payment Verified") {
        SaveOrderData();
      } else {
        // alert("Signature mismatch. Possible fraud.");
        showNotification("Signature mismatch. Possible fraud.");
      }
    })
    .catch((err) => {
      console.error("Verification Error:", err);
      alert("Something went wrong while verifying the payment.");
    });
}



//Save order data in DB
async function SaveOrderData() {
  // 1. Get address details from the form 
  const shipping = {
    name: document.getElementById("addName").value,
    phoneNo: document.getElementById("addPhoneNo").value,
    address: document.getElementById("addAddress").value,
    city: document.getElementById("addCity").value,
    state: document.getElementById("addState").value,
    zipCode: document.getElementById("addPostalCode").value,
  };

  // 2. Convert cart items into OrderItemRequest format
  const items = cart.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    price: item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price || 0
  }));

  // 3. Prepare full order payload
  const orderData = {
    receiptId:receiptId,
    paymentMethod: paymentMethod,
    shipping: shipping,
    items: items,
  };

  // console.log(orderData);

  try {
    const response = await fetch("/user/placeOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      //Remove all item from cart after order placed
      removeAllCartItem();

      // Show ThankU Message
      setTimeout(() => {
        showModal();
      }, 200);

      checkoutModal.classList.add("hidden");
      document.body.style.overflow = "auto";
      cart = [];
      updateCartUI();

    } else {
      const err = await response.text();
      alert("Order failed: " + err);
    }
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Order failed due to a network error.");
  }
}

//Remove all cart item of user after placing order
function removeAllCartItem() {
  fetch("/cart/removeAllCartItem", {
    method: "DELETE",
  })
    .then((response) => {
      return;
    })
    .then((message) => {
      // showNotification(message);
    })
    .catch((error) => {
      console.error("Error removing cart item:", error);
    });
}

// Utility functions
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

//Generate order Id
async function fetchReceiptId() {
  try {
    const response = await fetch("/payment/generateReceipt");
    const data = await response.json();
    receiptId = data.receiptId; 
  } catch (error) {
    console.error("Error fetching receipt ID:", error);
    receiptId = null;
  }
}

// Order place thank you message 
//
const modalOverlay = document.getElementById("modalOverlay");
const modalContent = document.getElementById("modalContent");
const closeModalBtn = document.getElementById("closeModalBtn");
const trackOrderBtn = document.getElementById("trackOrderBtn");
const orderNumber = document.getElementById("orderNumber");
const thanksTotal = document.getElementById("thanksTotal");

// Show modal with animation
function showModal() {
  // Generate new order number
  orderNumber.textContent = receiptId;
  thanksTotal.textContent = formatCurrency(totalAmount+shippingFee);

  // Show overlay
  modalOverlay.classList.remove("hidden");
  modalOverlay.classList.add("flex", "animate-fade-in");

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  // Add bounce animation to modal content
  modalContent.classList.add("animate-bounce-in");

  // Reset animations for repeated use
  setTimeout(() => {
    modalContent.classList.remove("animate-bounce-in");
  }, 600);
}

// Hide modal
function hideModal() {
  modalOverlay.classList.add("opacity-0");

  setTimeout(() => {
    modalOverlay.classList.add("hidden");
    modalOverlay.classList.remove("flex", "animate-fade-in", "opacity-0");
    document.body.style.overflow = "auto";
  }, 300);
}

closeModalBtn.addEventListener("click", hideModal);

trackOrderBtn.addEventListener("click", () => {
  alert("Redirecting to order tracking page...");
  hideModal();
});

// Close modal when clicking outside
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    hideModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
    hideModal();
  }
});
// close thanku message

//Notification function
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}

//Fetch State and district name by pin code
document.getElementById("addPostalCode").addEventListener("blur", function () {
  const pin = this.value.trim();

  // Validate 6-digit PIN
  if (!/^\d{6}$/.test(pin)) {
    alert("Please enter a valid 6-digit PIN code.");
    return;
  }

  fetch(`https://api.postalpincode.in/pincode/${pin}`)
    .then((response) => response.json())
    .then((data) => {
      if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        document.getElementById("addCity").value = postOffice.District;
        document.getElementById("addState").value = postOffice.State;
      } else {
        alert("Invalid PIN code or not found.");
        document.getElementById("addCity").value = "";
        document.getElementById("addState").value = "";
      }
    })
    .catch((error) => {
      console.error("Error fetching location:", error);
      alert("Something went wrong while fetching location.");
    });
});//close


// Initialize the application
function init() {
  setupSearch();
  setupFilters();
  setupProductModal();
  setupAuthModals();
}

function runAfterLogin() {
  setupCartSidebar();
  setupCheckoutModal();
  updateCartUI();
}

//Fetch all product and Start application
// document.addEventListener("DOMContentLoaded", () => {
//   fetch("/products/getAllProduct")
//     .then((response) => response.json())
//     .then((products) => {
//       allProducts = [...products];
//       filteredProducts = [...products];
//       console.log(allProducts);
//       renderProducts();
//       init();
//     })
//     .catch((error) => console.error("Error fetching product:", error));
// });

// //If user is logged in then fetch all user cart item
// document.addEventListener("DOMContentLoaded", () => {
//   if (typeof isAuthenticated !== "undefined" && isAuthenticated) {
//     fetch("/cart/getAllCartItems")
//       .then((response) => response.json())
//       .then((cartItems) => {
//         cart = [...cartItems];
//         runAfterLogin();
//       })
//       .catch((error) => console.error("User is not authenticated", error));
//   }
// });

   window.addEventListener('DOMContentLoaded', () => {
        const message = document.getElementById('serverMessage');
        if (message) {
            // Trigger fade-in
            setTimeout(() => {
                message.style.opacity = '1';
            }, 100); // slight delay ensures transition triggers

            // Auto hide with fade-out
            setTimeout(() => {
                message.style.opacity = '0';
                // Optional: remove from DOM after fade-out
                setTimeout(() => {
                    message.remove();
                }, 500); // match with transition duration
            }, 4000); // show for 4 seconds
        }
    });
    
document.addEventListener("DOMContentLoaded", () => {
  fetch("/products/getAllProduct")
    .then((response) => response.json())
    .then((products) => {
      allProducts = [...products];
      filteredProducts = [...products];
      console.log("Products loaded:", allProducts);
      renderProducts();
      init();

      // Load cart item if user is logged In and after product is loaded
      if (typeof isAuthenticated !== "undefined" && isAuthenticated) {
        return fetch("/cart/getAllCartItems");
      }
    })
    .then((response) => response?.json())
    .then((cartItems) => {
      if (cartItems) {
        cart = [...cartItems];

        cart = cartItems.map(item => {
            const fullProduct = allProducts.find(p => p.id === item.product.id);
            if (fullProduct) {
              item.product.discountPrice = fullProduct.discountPrice;
              item.product.price = fullProduct.price; // optional
            }
            return item;
          });

        runAfterLogin();
        console.log("Cart items loaded:", cart);
      }
    })
    .catch((error) => {
      console.error("Error loading products or cart:", error);
    });
});

