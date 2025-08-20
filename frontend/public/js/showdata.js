// frontend/public/js/showdata.js

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("showdataContainer");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = "<p>❌ No ID found in URL</p>";
    return;
  }

  try {
    const res = await fetch(`/api/v1/payment/receipt/${id}`);
    const result = await res.json();

    if (!result.success) throw new Error(result.message);

    const { id: receiptId, name, email: userEmail, mobile, bootcamp, payment } = result.data;

    // ✅ Populate Receipt ID
    document.getElementById("receiptId").textContent = receiptId;

    // ✅ Student details
    document.getElementById("studentName").textContent = name;
    document.getElementById("studentEmail").textContent = userEmail;
    document.getElementById("studentMobile").textContent = mobile;

    // ✅ Event details (SSOT from backend)
    document.getElementById("eventName").textContent = bootcamp.name;
    document.getElementById("eventDate").textContent = bootcamp.date;
    document.getElementById("eventLocation").textContent = bootcamp.location;
    document.getElementById("zoomLink").textContent = bootcamp.zoomLink;
    document.getElementById("zoomLink").href = bootcamp.zoomLink;

    // ✅ Payment details
    document.getElementById("paymentId").textContent = payment.paymentId || "N/A";
    document.getElementById("orderId").textContent = payment.orderId || "N/A";
    document.getElementById("paymentStatus").textContent = payment.status;
    document.getElementById("paymentAmount").textContent = `${payment.amount / 100} ${payment.currency}`;
    document.getElementById("paidAt").textContent = payment.paidAt
      ? new Date(payment.paidAt).toLocaleString()
      : "N/A";

    // ✅ WhatsApp group
    document.getElementById("whatsappJoin").href = bootcamp.whatsappLink;

  } catch (err) {
    console.error("❌ Error loading receipt:", err);
    container.innerHTML = `<p>Error fetching receipt: ${err.message}</p>`;
  }
});

