function showPopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "block";
}

function closePopup() {
  const popup = document.getElementById("popup");
  const form = document.getElementById("form");
  form.reset();
  popup.style.display = "none";
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}

const isValidEmail = (email) => /^[^\s@]+@gmail\.com$/.test(email);
const isValidMobile = (mobile) => /^\d{10}$/.test(mobile);

function validateField(input) {
  let errorElement = document.getElementById(input.id + "Error");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.id = input.id + "Error";
    errorElement.className = "error";
    input.parentNode.insertBefore(errorElement, input.nextSibling);
  }

  if (input.value.trim() === "") {
    errorElement.textContent = `${input.name} is required`;
  } else if (input.type === "email" && !isValidEmail(input.value.trim())) {
    errorElement.textContent = "Must end with @gmail.com";
  } else if (input.type === "tel" && !isValidMobile(input.value.trim())) {
    errorElement.textContent = "Mobile number must be 10 digits";
  } else {
    errorElement.textContent = "";
  }
}

function validateForm() {
  let isValid = true;
  document.querySelectorAll(".name, .email, .mobile").forEach((input) => {
    validateField(input);
    const err = document.getElementById(input.id + "Error");
    if (input.value.trim() === "" || (err && err.textContent.trim() !== "")) {
      isValid = false;
    }
  });
  return isValid;
}

// --- Event bindings ---
document.addEventListener("DOMContentLoaded", () => {
  // Reset errors on focus, validate on blur
  document.querySelectorAll(".name, .email, .mobile").forEach((input) => {
    input.addEventListener("focus", () => {
      const errorElement = document.getElementById(input.id + "Error");
      if (errorElement) errorElement.textContent = "";
    });
    input.addEventListener("blur", () => validateField(input));
  });

  document.querySelectorAll(".enroll-btn, .bootcamp-btn, .btn").forEach((btn) =>
    btn.addEventListener("click", showPopup)
  );

  document.querySelector("#popup .close")?.addEventListener("click", closePopup);

  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        console.log("Form validation failed");
        return;
      }

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const mobile = document.getElementById("mobile").value.trim();

      try {
        const response = await fetch("/api/v1/signup/sign_up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, mobile }),
        });

        const data = await response.json();

        if (data.success) {
          console.log("✅ Signup successful:", data);
          const id = data.data.id;
          window.location.href = `/pages/signup_successful.html?id=${id}`;
        } else {
          alert("❌ Signup failed: " + (data.message || "Unknown error"));
        }
      } catch (err) {
        console.error("❌ Error submitting form:", err);
        alert("Something went wrong! Try again.");
      }
    });
  }
});

