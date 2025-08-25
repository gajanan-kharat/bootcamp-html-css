document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.querySelector(".receipt");

  if (!id) {
    if (container) container.innerHTML = "<p>❌ No ID found in URL</p>";
    return;
  }

  try {
    const res = await fetch(`/api/v1/payment/receipt/${id}`);
    const result = await res.json();

    if (!result.success) throw new Error(result.message || "Failed to fetch receipt");

    const lead = result.data || {};
    const { student = {}, bootcamp = {}, payment = {} } = lead;

    const setText = (elementId, text) => {
      const el = document.getElementById(elementId);
      if (el) el.textContent = text || "";
    };

    setText("receiptId", lead.id || id);

    setText("studentName", student.name);
    setText("studentEmail", student.email);
    setText("studentMobile", student.mobile);

    setText("eventName", bootcamp.name);
    setText("eventDate", bootcamp.date);
    setText("eventLocation", bootcamp.location);
    const zoomEl = document.getElementById("zoomLink");
    if (zoomEl) {
      zoomEl.textContent = bootcamp.zoomLink || "";
      zoomEl.href = bootcamp.zoomLink || "#";
    }

    setText("paymentId", payment.paymentId || "N/A");
    setText("orderId", payment.orderId || "N/A");
    const amountVal = `${(payment.amount || bootcamp.fee || 0) / 100} ${payment.currency || bootcamp.currency || "INR"}`;
    setText("paymentAmount", amountVal);
    setText("paidAt", payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "N/A");

    const badge = document.getElementById("paymentStatus");
    if (badge) {
      const statusRaw = (payment.status || "").toLowerCase();
      let label = "Status";
      if (statusRaw.includes("success") || statusRaw.includes("paid")) {
        label = "Success";
        badge.classList.remove("failed");
      } else if (statusRaw.includes("fail")) {
        label = "Failed";
        badge.classList.add("failed");
      } else {
        label = payment.status || "N/A";
        badge.classList.remove("failed");
      }
      badge.textContent = label.toUpperCase();
    }
  } catch (err) {
    console.error("❌ Error loading receipt:", err);
    if (container) container.innerHTML = `<p>Error fetching receipt: ${err.message}</p>`;
  }
});

