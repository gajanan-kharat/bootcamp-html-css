// function getQueryParam(param) {
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get(param);
// }

// // Retrieve query parameters
// const userName = getQueryParam("name");
// const userEmail = getQueryParam("email");
// const userMobile = getQueryParam("mobile");


// // Display values in console
// console.log("Name:", userName);
// console.log("Email:", userEmail);
// console.log("Mobile:", userMobile);

// // Set retrieved values to HTML elements
// document.getElementById("userName").textContent = userName;
// document.getElementById("userEmail").textContent = userEmail;
// document.getElementById("userMobile").textContent = userMobile;


// // frontend/public/js/signup_Receivedata.js

// // Utility to read query params safely
// const getQueryParam = (param) => {
//   const urlParams = new URLSearchParams(window.location.search);
//   return urlParams.get(param) || "";
// };

// document.addEventListener("DOMContentLoaded", () => {
//   // Retrieve params from URL
//   const userName = getQueryParam("name");
//   const userEmail = getQueryParam("email");
//   const userMobile = getQueryParam("mobile");

//   // Log values for debugging
//   console.log("✅ Signup Details from URL:", { userName, userEmail, userMobile });

//   // Update DOM if elements exist
//   const nameEl = document.getElementById("userName");
//   const emailEl = document.getElementById("userEmail");
//   const mobileEl = document.getElementById("userMobile");

//   if (nameEl) nameEl.textContent = userName || "N/A";
//   if (emailEl) emailEl.textContent = userEmail || "N/A";
//   if (mobileEl) mobileEl.textContent = userMobile || "N/A";

//   // Expose values for Razorpay prefill
//   window.signupData = { userName, userEmail, userMobile };
// });


const getQueryParam = (param) => new URLSearchParams(window.location.search).get(param) || "";

document.addEventListener("DOMContentLoaded", async () => {
  const signupId = getQueryParam("id");
  if (!signupId) return;

  // Fetch signup data from backend if needed
  const res = await fetch(`/api/v1/payment/receipt/${signupId}`);
  const { data } = await res.json();

  if (data) {
    document.getElementById("userName").textContent = data.name;
    document.getElementById("userEmail").textContent = data.email;
    document.getElementById("userMobile").textContent = data.mobile;

    // Store globally for rezorpay.js
    window.signupData = { ...data, id: signupId };
  }
});

