# 🛡️ GuardianAI

**A Real-Time Payment Scam Interception Engine**
Built for Hackathon Problem Statement **PS09**.

🔗 **[Live Demo on Vercel](https://guardian-pay-chi.vercel.app)**

## 🚀 Overview
Digital payment scams rely on urgency and unverified recipients. **GuardianAI** acts as an agentic payment-security assistant capable of analyzing a payment request, evaluating risk vectors, and taking appropriate protective action *before* the transaction completes.

## 🧠 Core Features
* **Deterministic Risk Engine:** Mathematically evaluates transactions based on historical trust, volume anomalies, and brand impersonation checks.
* **Explainable AI (XAI) Panel:** Provides a clear, numbered breakdown of *why* a transaction was flagged (e.g., +45 points for Brand Impersonation), ensuring complete auditability.
* **Simulated Security Interventions:** Dynamically locks payments requiring OTP verification (Medium Risk) or outright suspends suspected fraud (High Risk).
* **Live Transaction Ledger:** Persistent tracking of successful, held, and blocked transfers with dynamic balance adjustments.

## 💻 Tech Stack
* **Frontend:** React.js (Vite)
* **Styling:** Tailwind CSS v4 (Glassmorphism UI)
* **Icons:** Lucide React
* **Deployment:** Vercel

## 🛠️ How to Run Locally
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the local development server.