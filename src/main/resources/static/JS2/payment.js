// payment.js
import { showNotification } from "./notification.js";
import { formatCurrency } from "./utils.js";

let receiptId = null;

export async function fetchReceiptId() {
  try {
    const res = await fetch("/payment/generateReceipt");
    const data = await res.json();
    receiptId = data.receiptId;
    return receiptId;
  } catch (err) {
    console.error("Receipt ID fetch failed:", err);
    showNotification("Payment initialization failed", "error");
  }
}

export async function rzpCheckout(amount, name, phone, keyId) {
  try {
    const res = await fetch(`/payment/createOrder?amount=${amount}&receipt=${receiptId}`,
      { method: "POST" }
    );
    const order = await res.json();

    if (order.error) {
      showNotification("Order error: " + order.error, "error");
      return;
    }

    const options = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: "RMR",
      description: "Payment for your order",
      order_id: order.id,
      handler: (response) => verifySignature(response),
      prefill: { name, contact: phone },
      theme: { color: "#3399cc" },
    };

    const rzp1 = new Razorpay(options);

    rzp1.on("payment.failed", (response) => handleFailure(response));
    rzp1.open();
  } catch (err) {
    console.error("Checkout failed:", err);
    showNotification("Checkout failed", "error");
  }
}

function handleFailure(response) {
  alert("FAILED: " + response.error.description);

  fetch("/payment/failure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id: response.error.metadata.order_id,
      razorpay_payment_id: response.error.metadata.payment_id,
      reason: response.error.reason,
      code: response.error.code,
      description: response.error.description,
      source: response.error.source,
      step: response.error.step,
    }),
  })
    .then((res) => res.text())
    .then((data) => console.log("Failure saved:", data))
    .catch((err) => console.error("Failure save error:", err));
}

function verifySignature(response) {
  fetch("/payment/verifySignature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    }),
  })
    .then((res) => res.text())
    .then((data) => {
      if (data === "Payment Verified") {
        showNotification("Payment Verified", "success");
      } else {
        showNotification("Signature mismatch. Possible fraud.", "error");
      }
    })
    .catch((err) => {
      console.error("Verification Error:", err);
      showNotification("Verification failed", "error");
    });
}

async function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve;
    script.onerror = () => reject("Razorpay SDK failed to load.");
    document.body.appendChild(script);
  });
}
