# Quantum Within — AI-Powered Astrology SaaS Platform

> **"For entertainment and personal insight purposes only. Not a substitute for professional, legal, or medical advice."**

---

## 🌌 Overview
Quantum Within is a full-stack astrology SaaS platform with AI-powered Palm/Face reading, Vedic Kundali generation, Numerology, Horoscopes, Razorpay payments, and a freemium monetization model.

---

## 🗂️ Project Structure
```
Quantum Within/
├── backend/         → Node.js + Express + MongoDB
│   ├── controllers/
│   ├── middleware/
│   ├── models/        User, Report, Transaction
│   ├── routes/
│   ├── services/      PDF generation
│   └── server.js
└── frontend/        → React + Vite
    └── src/
        ├── api/       Axios instance
        ├── components/ Navbar
        └── pages/     Home, Horoscope, Kundali, Numerology,
                       PalmReading, FaceReading, Dashboard, AdminPanel
```

---

## ⚙️ Setup Instructions

### 1. Backend
```bash
cd backend
# Copy and fill in your credentials
copy .env.example .env

# Start the server
node server.js
# Server runs on http://localhost:5000
```

**Required `.env` values:**
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Any strong random string |
| `RAZORPAY_KEY_ID` | From Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | From Razorpay Dashboard |

### 2. Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 🚀 Features
| Module | Free | ₹49 Mini | ₹99 Full | ₹199 Premium |
|---|---|---|---|---|
| Daily Horoscope | ✅ Basic | ✅ | ✅ Full | ✅ Full |
| Kundali Generation | ✅ Summary | ✅ | ✅ Full | ✅ Full |
| Numerology | ✅ Numbers | — | ✅ Full | ✅ Full |
| AI Palm Reading | ✅ Life Line | ✅ All Lines | ✅ Full | ✅ Full |
| AI Face Reading | ✅ Shape | ✅ | ✅ Full | ✅ Full |
| PDF Download | ❌ | ✅ | ✅ | ✅ |
| Admin Panel | — | — | — | — |

---

## 🛡️ Security
- JWT authentication on all protected routes
- Rate limiting (100 req / 15 min)
- Multer validates image type and size (5MB max)
- Razorpay HMAC signature verification
- Bcrypt password hashing

---

## 💰 Monetization
- ₹49 Mini Report — single 7-day access
- ₹99 Full Report — 30-day full access
- ₹199 Premium Bundle — 30-day VIP + all AI features
- Wallet top-up: ₹100 / ₹200 / ₹500
- Referral system: ₹20 wallet credit per referral

---

## 👤 Admin Access
Create a user in MongoDB and manually set `role: "admin"` to access `/admin`.
