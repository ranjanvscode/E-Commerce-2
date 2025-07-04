// search.js
import { debounce } from "./utils.js";
import { filterProducts } from "./filter.js";

export function setupSearch() {
  const inputs = ["searchInput", "mobileSearchInput"].map((id) =>
    document.getElementById(id)
  );

  const handler = debounce((e) => {
    filterProducts(e.target.value.toLowerCase());
  }, 300);

  inputs.forEach((input) => input.addEventListener("input", handler));
}
