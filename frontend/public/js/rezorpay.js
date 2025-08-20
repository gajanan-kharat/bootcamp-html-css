// document.getElementById('rzp-button1').onclick = async function (e) {
//   e.preventDefault();

//   try {
//     const orderResponse = await fetch('/api/payment/create-order', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         amount: 9900,
//         currency: 'INR'
//       })
//     });

//     if (!orderResponse.ok) {
//       throw new Error('Failed to create order');
//     }

//     const orderData = await orderResponse.json();

//     var options = {
//       "key": orderData.key,
//       "amount": orderData.amount,
//       "currency": orderData.currency,
//       "name": "codeDisha Technology",
//       "description": "Bootcamp Transaction",
//       "image": "/assets/images/codeDisha-img/codeDisha-image.png",
//       "order_id": orderData.id,
//       "handler": function (response) {
//         // Handle payment success
//         $.ajax({
//           type: "POST",
//           url: "/api/payment/payment_success",
//           data: {
//             name: getQueryParam("name"),
//             email: getQueryParam("email"),
//             mobile: getQueryParam("mobile"),
//             paymentId: response.razorpay_payment_id,
//             orderId: response.razorpay_order_id
//           },
//           success: function (data) {
//             console.log("Data saved successfully:");
//           },
//           error: function (error) {
//             console.error("Error saving data:", error);
//           }
//         });
//         window.location.href = "showdata.html";
//       },
//       "prefill": {
//         "name": userName,
//         "email": userEmail,
//         "contact": userMobile
//       },
//       "notes": {
//         "address": "Razorpay Corporate Office"
//       },
//       "theme": {
//         "color": "#3399cc"
//       }
//     };

//     var rzp1 = new Razorpay(options);
//     rzp1.on('payment.failed', function (response) {
//       console.error("❌ Payment Failed:", response.error);
//       alert("Payment failed: " + response.error.description);
//     });


//    rzp1.open();
//   } catch (error) {
//     console.error('❌ Error during payment:', error);
//     alert("Unable to initiate payment. Please try again.");
//   }
// }


// frontend/public/js/rezorpay.js

document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("rzp-button1");
  if (!payBtn) return; // safe check if button missing

  payBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      // ✅ Step 1: Create Razorpay Order
      const orderResponse = await fetch("/api/v1/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 9900, // ideally dynamic: config.bootcamp.fee
          currency: "INR",
        }),
      });

      if (!orderResponse.ok) throw new Error("Failed to create order");
      const orderData = await orderResponse.json();

      // ✅ Step 2: Options for Razorpay SDK
      const { userName, userEmail, userMobile } = window.signupData || {};

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CodeDisha Technology",
        description: "Bootcamp Transaction",
        image: "/assets/images/codeDisha-img/codeDisha-image.png",
        order_id: orderData.id,

        handler: async function (response) {
          console.log("✅ Razorpay Success:", response);
          const { id } = window.signupData;

          try {
            // ✅ Step 3: Tell backend payment is successful
            const successResponse = await fetch("/api/v1/payment/success", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              }),
            });

            if (!successResponse.ok) {
              throw new Error("Backend failed to record payment");
            }

            // ✅ Auto-follow backend redirect
            if (successResponse.redirected) {
              window.location.href = successResponse.url;
            } else {
              const result = await successResponse.json();
              console.log("Payment Success Response:", result);
              window.location.href = "/pages/showdata.html?id=" + id;
            }
          } catch (err) {
            console.error("❌ Error saving payment:", err);
            alert("Payment recorded failed. Please contact support.");
          }
        },

        prefill: {
          name: userName || "",
          email: userEmail || "",
          contact: userMobile || "",
        },

        notes: { address: "Razorpay Corporate Office" },
        theme: { color: "#3399cc" },
      };

      // ✅ Step 4: Open Razorpay checkout
      const rzp1 = new Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        console.error("❌ Payment Failed:", response.error);
        alert("Payment failed: " + response.error.description);
      });

      rzp1.open();
    } catch (error) {
      console.error("❌ Error during payment init:", error);
      alert("Unable to initiate payment. Please try again.");
    }
  });
});


