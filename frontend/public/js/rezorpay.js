document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("rzp-button1");
  if (!payBtn) return;

  payBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const sd = window.signupData || {};
      const id = sd.id;
      const amountPaise = Number(sd?.bootcamp?.fee);

      if (!id || !amountPaise || Number.isNaN(amountPaise)) {
        alert("Registration not loaded. Refresh page & try again.");
        return;
      }

      const orderResponse = await fetch("/api/v1/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountPaise, currency: "INR" }),
      });

      if (!orderResponse.ok) throw new Error("Failed to create order");
      const orderData = await orderResponse.json();

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CodeDisha Technology",
        description: "Bootcamp Enrollment Payment",
        image: "/assets/images/codeDisha-img/codeDisha-image.png",
        order_id: orderData.id,

        handler: async function (response) {
          try {
            const successResponse = await fetch("/api/v1/payment/success", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              }),
            });

            if (successResponse.redirected) {
              window.location.href = successResponse.url;
            } else {
              window.location.href = `/pages/showdata.html?id=${id}`;
            }
          } catch (err) {
            console.error("❌ Error saving payment:", err);
            alert("Payment save failed. Contact support.");
          } finally {
            resetBackInterceptor();
          }
        },

        prefill: {
          name: sd.name || "",
          email: sd.email || "",
          contact: sd.mobile || "",
        },

        theme: { color: "#3399cc" },
      };

      const rzp1 = new Razorpay(options);

      rzp1.on("payment.failed", async (response) => {
        const errorReason = response.error?.description || "razorpay_error";
        await reportFailureAndRedirect(
          id,
          response.error?.metadata?.order_id || orderData.id,
          errorReason
        );
        resetBackInterceptor();
      });

      rzp1.on("modal.closed", async () => {
        console.warn("⚠️ Razorpay modal closed (user action)");
        await reportFailureAndRedirect(id, orderData.id, "closed_by_user");
        resetBackInterceptor();
      });

      interceptBackButton(() => {
        console.warn("⚠️ Back button pressed while Razorpay open");
        reportFailureAndRedirect(id, orderData.id, "closed_by_browser_back");
      });

      rzp1.open();
    } catch (error) {
      console.error("❌ Error during payment init:", error);
      alert("Unable to initiate payment. Please try again.");
    }
  });
});

async function reportFailureAndRedirect(id, orderId, errorReason) {
  try {
    const resp = await fetch("/api/v1/payment/failure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, orderId, errorReason }),
    });

    if (resp.redirected) {
      window.location.href = resp.url;
    } else {
      window.location.href = `/pages/payment_failed.html?id=${id}`;
    }
  } catch (e) {
    console.error("❌ Failed reporting failure:", e);
    window.location.href = `/pages/payment_failed.html?id=${id}`;
  }
}

let backInterceptorActive = false;

function interceptBackButton(onBack) {
  if (backInterceptorActive) return;
  backInterceptorActive = true;

  window.history.pushState({ razorpayCheckout: true }, "", window.location.href);

  window.onpopstate = (event) => {
    if (event.state && event.state.razorpayCheckout) {
      onBack();
    }
  };
}

function resetBackInterceptor() {
  if (!backInterceptorActive) return;
  backInterceptorActive = false;
  window.onpopstate = null;
  window.history.go(1);
}
