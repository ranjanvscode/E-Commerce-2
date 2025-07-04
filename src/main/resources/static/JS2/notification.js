// notification.js
export function showNotification(message, type = "success") {
  const div = document.createElement("div");
  div.className = `fixed left-1/2 top-2 transform -translate-x-1/2 translate-y-[-100%] transition-transform duration-300 px-6 py-3 rounded-lg shadow-lg z-50 text-white text-center w-full max-w-md ${
    type === "error" ? "bg-red-500" : "bg-green-500"
  }`;
  div.textContent = message;
  document.body.appendChild(div);

  setTimeout(() => (div.style.transform = "translate(-50%, 0)"), 100);
  setTimeout(() => {
    div.style.transform = "translate(-50%, -100%)";
    setTimeout(() => document.body.removeChild(div), 300);
  }, 2500);
}
