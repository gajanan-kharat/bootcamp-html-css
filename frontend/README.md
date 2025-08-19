# 🎨 Frontend (Static Website)

## 📖 Description
The frontend is a **single page application (SPA)** written in plain HTML, CSS, and JavaScript.  
It provides:
- Signup form
- Payment button (integrates Razorpay checkout)
- Success page

Everything is served by the backend Express static server.

---

## 📂 Structure
frontend/
└── public/
├── index.html # signup page
├── pages/
│ ├── signup_successful.html
│ ├── showdata.html
├── css/ # stylesheets
├── js/ # frontend scripts
└── assets/ # images/icons


---

## ⚙️ Tech Used
- **HTML5 + CSS3 + Vanilla JavaScript**
- **Razorpay Checkout.js** (payment UI)
- Served via **Express**

---

## ▶️ Run Frontend
No build tool required (since static).

npm start # starts backend + frontend

Browse to:http://localhost:3000/


---

## 📌 Flow
1. User opens `index.html` and fills signup form.
2. Data is sent → `/api/signup/sign_up`
3. Backend redirects → `/pages/signup_successful.html`
4. Payment button triggers Razorpay checkout
5. On success → backend `/api/payment/payment_success`
6. Redirect → `/pages/showdata.html` (see payment success)

---

## 📌 Learning
- How to integrate Vanilla JS with a backend REST API
- How to dynamically handle query params (redirected user details)
- How Razorpay checkout popups work
