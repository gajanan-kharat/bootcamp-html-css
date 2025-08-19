# 🚀 Bootcamp Payment & Signup Application

## 📖 Overview
This is a **3 Days Bootcamp Application** that allows students to:
- Register online
- Make test payments using **Razorpay**
- Receive a payment receipt via **Email (PDF attached)**  

It integrates:

- **Frontend (HTML/CSS/JS)** – Static single‑page Bootcamp site
- **Backend (Node.js/Express)** – Handles signup, payments, PDF generation, sending emails
- **Firebase (Firestore)** – Stores student registration & payment records
- **Razorpay API** – Payment Gateway
- **Nodemailer (Gmail SMTP)** – Sends confirmation emails with PDFs

---

## 🛠️ Technologies Used
- **Frontend:** HTML5, CSS3, Vanilla JavaScript  
- **Backend:** Node.js, Express.js, Body-Parser  
- **Database:** Firebase Firestore  
- **Payments:** Razorpay API  
- **Emailing:** Nodemailer + Gmail App Password  
- **PDF Receipts:** PDFKit  
- **Deployment:** Docker, Docker Compose  
- **CI/CD:** GitHub Actions  

---

## 📂 Folder Structure
BOOTCAMP-HTML-CSS/
├── backend/ # Express API
│ ├── src/ # app.js, server.js, controllers, services, config
│ ├── package.json
│ ├── Dockerfile
│ ├── .env # gitignored
│ └── .env.example # sample (safe to commit)
├── frontend/ # static SPA
│ └── public/ # index.html, css/, js/, assets/
├── package.json # root shortcuts
├── docker-compose.yml # run in one command
└── .env.example # root-level placeholders


---

## 🔐 Environment Setup
There are **two env files**:
1. **Root `.env`** (general app settings, backend/frontend URLs)  
2. **`backend/.env`** (sensitive backend secrets)

### Step 1 — Copy example files
cp .env.example .env
cp backend/.env.example backend/.env


### Step 2 — Fill actual values
- Set your Gmail (`EMAIL_USER`) and **Google App Password** (16-char, no spaces)
- Paste Razorpay `KEY_ID` and `KEY_SECRET`
- Adjust Bootcamp details, Zoom link, etc.

### Step 3 — Never commit `.env`  
Only commit `.env.example`.

---

## 🧑‍💻 Local Development

install backend dependencies
cd backend
npm install

run backend + serve frontend
npm run dev # for auto-reload

OR
npm start # production-like


Open browser:  
http://localhost:3000/


---

## 🏭 Production (Docker)

build image
docker build -t bootcamp-app -f backend/Dockerfile .

run
docker run -p 3000:3000 --env-file backend/.env bootcamp-app


or using Docker Compose:

docker-compose up --build


Access:  
- **Frontend** → `http://localhost:3000`  
- **APIs** → `http://localhost:3000/api/...`

---

## ⚙️ CI/CD (Optional)
- Use **GitHub Actions** to:
  - Build Docker image
  - Push to DockerHub
  - Deploy to server via SSH  
- Store secrets in repo → `EMAIL_PASS`, `RAZORPAY_KEY`, Firebase `serviceAccountKey.json`

---

## 📌 Purpose of Firebase
- Stores signup data (`name, email, phone`)
- Stores payment records (`orderId, paymentId, status`)
- Used for admin dashboards/reports.

---

## 📌 How the Payment Flow Works
1. Frontend → calls backend to create Razorpay order  
2. Backend → generates order via Razorpay SDK  
3. User → pays via Razorpay popup (test card)  
4. Razorpay → returns `paymentId + orderId`  
5. Frontend → calls `/api/payment/payment_success`  
6. Backend → Updates Firebase + Emails PDF Receipt  

---

## 📚 Learning Outcomes
By working on this project you’ll learn:  
- Full‑stack architecture (Static Frontend + API Backend + Cloud DB)  
- Secure environment management with `.env` + `.env.example`  
- Integrating Razorpay Payment Gateway  
- Sending dynamic emails w/PDF attachments  
- Dockerizing apps & CI/CD automation  

