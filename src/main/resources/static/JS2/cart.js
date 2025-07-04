// cart.js
import { formatCurrency, getEffectivePrice } from "./utils.js";

export function updateCartTotalUI(cart, shippingFee) {
  const total = cart.reduce(
    (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
    0
  );

  document.getElementById("cartCount").textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  document.getElementById("cartTotal").textContent = formatCurrency(total);
  document.getElementById("subtotalAmount").textContent = formatCurrency(total);
  document.getElementById("checkoutTotal").textContent = formatCurrency(
    total + shippingFee
  );
}

export function removeFromCartUI(productId, cart, updateFn) {
  const newCart = cart.filter((item) => String(item.product.id) !== String(productId));
  updateFn(newCart);
}

export function adjustQuantity(productId, change, cart, updateFn) {
  const item = cart.find((i) => i.product.id === productId);
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
    updateFn(cart);
  }
}
