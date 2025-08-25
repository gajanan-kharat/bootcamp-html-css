const getQueryParam = (param) =>
  new URLSearchParams(window.location.search).get(param) || "";

document.addEventListener("DOMContentLoaded", async () => {
  const signupId = getQueryParam("id");
  if (!signupId) return;

  try {
    const res = await fetch(`/api/v1/payment/receipt/${signupId}`);
    const json = await res.json();

    if (!json.success) throw new Error(json.message || "Failed to load registration");

    const lead = json.data;
    const { student, bootcamp } = lead;

    document.getElementById("userName").textContent = student?.name || "";
    document.getElementById("userEmail").textContent = student?.email || "";
    document.getElementById("userMobile").textContent = student?.mobile || "";

    window.signupData = {
      id: signupId,
      name: student?.name,
      email: student?.email,
      mobile: student?.mobile,
      bootcamp: {
        fee: Number(bootcamp?.fee),
        currency: bootcamp?.currency || "INR",
      },
    };

    console.log("✅ signupData loaded:", window.signupData);
  } catch (err) {
    console.error("❌ Error loading student data:", err);
  }
});
