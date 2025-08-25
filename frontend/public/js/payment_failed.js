document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const retryBtn = document.getElementById("retryPaymentBtn");

  if (!retryBtn) return;

  retryBtn.addEventListener("click", () => {
    if (id) {
      window.location.href = `/pages/signup_successful.html?id=${id}`;
    } else {
      alert("Missing registration ID. Please signup again.");
      window.location.href = "/index.html";
    }
  });
});
