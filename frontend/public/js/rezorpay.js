document.getElementById('rzp-button1').onclick = async function (e) {
  e.preventDefault();

  try {
    const orderResponse = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 9900,
        currency: 'INR'
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to create order');
    }

    const orderData = await orderResponse.json();

    var options = {
      "key": orderData.key,
      "amount": orderData.amount,
      "currency": orderData.currency,
      "name": "codeDisha Technology",
      "description": "Bootcamp Transaction",
      "image": "/assets/images/codeDisha-img/codeDisha-image.png",
      "order_id": orderData.id,
      "handler": function (response) {
        // Handle payment success
        $.ajax({
          type: "POST",
          url: "/api/payment/payment_success",
          data: {
            name: getQueryParam("name"),
            email: getQueryParam("email"),
            mobile: getQueryParam("mobile"),
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id
          },
          success: function (data) {
            console.log("Data saved successfully:");
          },
          error: function (error) {
            console.error("Error saving data:", error);
          }
        });
        window.location.href = "showdata.html";
      },
      "prefill": {
        "name": userName,
        "email": userEmail,
        "contact": userMobile
      },
      "notes": {
        "address": "Razorpay Corporate Office"
      },
      "theme": {
        "color": "#3399cc"
      }
    };

    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      console.error("❌ Payment Failed:", response.error);
      alert("Payment failed: " + response.error.description);
    });


   rzp1.open();
  } catch (error) {
    console.error('❌ Error during payment:', error);
    alert("Unable to initiate payment. Please try again.");
  }
}
