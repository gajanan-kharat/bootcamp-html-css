function togglePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block"; 
}

document.querySelectorAll('.name, .email, .mobile').forEach(function(input) {
    input.addEventListener('blur', function() {
        validateField(input);
    });
});

function validateField(input) {
    console.log("Validating field: ", input.id);
    var errorElement = document.getElementById(input.id + 'Error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = input.id + 'Error';
        errorElement.className = 'error';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    if (input.value.trim() === "") {
        console.log(input.name + " is required");
        errorElement.textContent = input.name + " is required";
    } else {
        if (input.type === 'email') { 
            if (!isValidEmail(input.value.trim())) {
                console.log("Invalid email format");
                errorElement.textContent = "Invalid (@gmail.com) email format";
            } else {
                errorElement.textContent = "";
            }
        } else if (input.type === 'tel') {
            if (!isValidMobile(input.value.trim())) {
                console.log("Invalid mobile number");
                errorElement.textContent = "Mobile number must be 10 digits";
            } else {
                errorElement.textContent = "";
            }
        } else {
            errorElement.textContent = "";
        }
    }
}

function validateForm() {
    let isValid = true;
    document.querySelectorAll('.name, .email, .mobile').forEach(function(input) {
        validateField(input); 
        if (input.value.trim() === "" || document.getElementById(input.id + 'Error').textContent.trim() !== "") {
            isValid = false;
        }
    });
    return isValid;
}

function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidMobile(mobile) {
    var mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
}

function closePopup() {
    var popup = document.getElementById("popup");
    var form = document.getElementById("form");
    form.reset(); 
    popup.style.display = "none";
    document.querySelectorAll('.error').forEach(function(error) {
        error.textContent = "";
    });
}

document.querySelectorAll('.name, .email, .mobile').forEach(function(input) {
    input.addEventListener('focus', function() {
        var errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = "";
        }
    });
});

// ✅ Handle form submit properly
document.getElementById("form").addEventListener("submit", async function(e) {
    e.preventDefault(); // stop old form action (/sign_up)

    if (!validateForm()) {
        console.log("Form validation failed.");
        return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();

    try {
        const response = await fetch("/api/signup/sign_up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, mobile })
        });

        if (response.redirected) {
            // backend sends redirect to signup_successful.html
            window.location.href = response.url;
        } else {
            const data = await response.json();
            if (data.success) {
                alert("Signup successful (API response)");
            } else {
                alert("Signup failed");
            }
        }
    } catch (err) {
        console.error("Error submitting form:", err);
        alert("Something went wrong!");
    }
});
