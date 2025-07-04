// accessibility.js
export function improveAccessibility() {
  document.querySelectorAll("img").forEach((img) => {
    if (!img.alt) img.alt = "Product image";
  });

  document.querySelectorAll("button").forEach((btn) => {
    if (!btn.hasAttribute("aria-label")) {
      const label = btn.textContent.trim() || btn.getAttribute("title") || "Button";
      btn.setAttribute("aria-label", label);
    }
  });
}
export function setupKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      document.querySelectorAll("a, button, input, select, textarea").forEach((el) => {
        el.setAttribute("tabindex", "0");
      });
    }
  });

  document.addEventListener("focusin", (e) => {
    if (e.target.matches("a, button, input, select, textarea")) {
      e.target.classList.add("focus-visible");
    }
  });

  document.addEventListener("focusout", (e) => {
    if (e.target.matches("a, button, input, select, textarea")) {
      e.target.classList.remove("focus-visible");
    }
  });
}