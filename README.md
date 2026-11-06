# PriceMaker — Gold & Silver Daily Rate Generator & Template Filler
**ચોકસી બાપુલાલ અમથાભાઈ એન્ડ સન્સ**

A specialized web application for jewelry shops to enter daily rates for Gold (24K, 22K, 20K) and Silver, automatically fill high-resolution promotional Canva templates, download the ready-to-use image, share instantly to WhatsApp/Status/Email, and export all historical entries to CSV for business analytics.

---

## 🌟 Features

- **Dynamic Canva Template Overlay**: Automatically loads the jewelry shop's branding banner and draws the Date, Time, and Rates directly on top.
- **Dual-Language Output**: Automatically renders **English Numerals** in the left column (e.g. `78,500`) and **Gujarati Numerals** in the right column (e.g. `૭૮,૫૦૦`).
- **One-Click Download**: Generates high-res PNG image matching your Canva banner format.
- **Instant Sharing**: 
  - **WhatsApp Status & Native Share**: Uses Web Share API with attached PNG image file.
  - **WhatsApp Chat**: Formatted text summary with rates.
  - **Email**: Mailto with pre-formatted rate card.
- **Continuous Audit Trail**: Every entry (morning, afternoon, evening) creates a new record with exact timestamps — nothing is overwritten.
- **CSV Data Export**: One click exports the entire historical ledger with S.No, Date, Time, 24K, 22K, 20K, and Silver prices for Excel / Google Sheets analysis.

---

## 🚀 Running Locally

### 1. Run Backend
```bash
cd backend
npm install
node index.js
```
Runs on `http://localhost:5000` (uses local memory fallback if MongoDB URI is not set).

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🌐 Deploying to Vercel

### Backend
1. In your Vercel Dashboard, import the repository and set the root directory to `backend`.
2. Add environment variable:
   - `MONGODB_URI`: your MongoDB Atlas connection string (free tier at [mongodb.com/atlas](https://mongodb.com/atlas)).
3. Deploy!

### Frontend
1. Import repository and set root directory to `frontend`.
2. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://your-backend.vercel.app/api`).
3. Deploy!

