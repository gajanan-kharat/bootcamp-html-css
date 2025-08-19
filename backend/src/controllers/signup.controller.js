const { uploadData } = require("../config/firebase");

// POST /sign_up
exports.handleSignup = (req, res) => {
  const { name, email, mobile } = req.body;

  const data = {
    name,
    email,
    mobile,
    paymentId: "",
    paymentStatus: "fail",
  };

  uploadData(data);
  console.log("✅ Register Record Inserted Successfully in Firestore");

return res.redirect(
  `/pages/signup_successful.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(mobile)}`
);
};
