# 🛠️ Backend Service (Express API)

## 📖 Description
The backend handles:
- User Signup (`/api/signup`)
- Payment Order Creation (`/api/payment/create-order`)
- Payment Success Handler (`/api/payment/payment_success`)
- Firestore DB Updates
- Receipt PDF Generation (PDFKit)
- Sending Confirmation Emails (Nodemailer + Gmail)

---

## 📂 Structure
backend/
├── src/
│ ├── app.js # Express config (routes, static server)
│ ├── server.js # Server entrypoint
│ ├── controllers/ # signup.controller.js, payment.controller.js
│ ├── services/ # mail.service.js, pdf.service.js
│ └── config/ # firebase.js, serviceAccountKey.json
├── package.json
├── Dockerfile
├── .env # ignored (secrets)
└── .env.example # safe sample

---

## ⚙️ Tech Used
- **Node.js + Express**
- **Firebase Firestore** (database)
- **Nodemailer (Gmail)** → send emails
- **PDFKit** → generate receipts
- **Razorpay SDK** → integrate payment gateway
- **dotenv** → load env vars

---

## 🧩 API Routes
- `POST /api/signup/sign_up` → Register user in Firebase
- `POST /api/payment/create-order` → Create Razorpay test order
- `POST /api/payment/payment_success` → On success → update Firebase + email receipt

---

## 🔐 Environment Setup
- Copy example env file and edit:

cp .env.example .env
- Update values:
- `EMAIL_USER` → Gmail ID
- `EMAIL_PASS` → Google App Password (16-char)
- `KEY_ID` & `KEY_SECRET` → Razorpay Keys
- Bootcamp details & Zoom Link  

`.env` is **ignored** → only `.env.example` is committed.

---

## ▶️ Run Backend
npm install
npm start


For development w/auto-reload:

---

## 🏭 Build & Run (Docker)
docker build -t bootcamp-backend -f Dockerfile .
docker run -p 3000:3000 --env-file .env bootcamp-backend


or with docker-compose: docker-compose up --build


---

## 📌 Firebase Role
- Stores signup + payment info (`name, email, orderId, paymentId, status`)  
- Used to keep track of registered participants  
- Provides admin‑friendly reporting

---

## 📌 Payment Flow
1. Frontend hits `/api/payment/create-order`
2. Razorpay returns `orderId`
3. User pays via Razorpay popup
4. Frontend submits to `/api/payment/payment_success`
5. Backend updates Firestore & sends receipt email
