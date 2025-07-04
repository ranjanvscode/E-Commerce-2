// utils.js
export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(amount);

export const getEffectivePrice = (product) =>
  product?.discountPrice > 0 ? product.discountPrice : product?.price ?? 0;

export const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
};

export const generateStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - Math.ceil(rating);
  return (
    "<i class='fas fa-star'></i>".repeat(full) +
    (half ? "<i class='fas fa-star-half-alt'></i>" : "") +
    "<i class='far fa-star'></i>".repeat(empty)
  );
};
