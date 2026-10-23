# 🏨 Luxury Hotel Booking & Management Platform

A modern, responsive hotel booking platform with a Vercel-hosted Node API, MongoDB persistence, JWT cookie authentication, and role-based access for admins, owners, and users.

Built with **React 18**, **Vite**, **Tailwind CSS**, **Express**, **MongoDB**, and **Argon2id** password hashing.

---

## 🌟 Key Features

### 1. 🧳 Public Guest Experience
* **Direct Room Booking Flow:** Guests can select dates (Check-in / Check-out), guests, and room category.
* **Zero Payment Gateway Needed:** Instant reservation with Pay-at-Hotel policy. Generates a printable booking voucher and direct WhatsApp confirmation.
* **Room Showcase:**
  * 🛏️ **Executive Room:** King/Twin bed, City/Garden view, Free Wi-Fi, Breakfast, AC, Smart TV.
  * 👑 **Premium Room:** Grand Royal Bed, Palace/Balcony view, Rooftop & Pool access, Luxury bath.
* **Key Amenities Highlighted:**
  * ☕ Complimentary Royal Breakfast Buffet
  * 🏊 Royal Azure Swimming Pool
  * 🌅 Rooftop Sunset Lounge & Sky Dining
  * 📶 200 Mbps High-Speed Wi-Fi
  * 🚗 Free Valet Parking & 24/7 Front Desk
* **Jaipur / City Sightseeing Guide:** Displays nearby monuments (Hawa Mahal, City Palace, Amer Fort, etc.) with travel distances.

---

### 2. 🤖 24/7 Hotel AI Concierge Robot ("Raj-Bot")
* Floating interactive chat widget in the bottom-right corner.
* Answers guest questions instantly:
  * Room rates & inclusions
  * Breakfast, swimming pool, and rooftop dining timings
  * Standard check-in (2:00 PM) and check-out (11:00 AM) policies
  * Sightseeing recommendations & taxi concierge
  * Direct booking guidance
* **Dynamic Knowledge Base:** Reads the hotel's latest rates and details in real-time — if the owner changes room prices or hotel details, the robot automatically answers with the updated information!

---

### 3. 🔐 Three Role Access
* **Admin:** Can view and manage every booking, update booking statuses and hotel pricing/content, and create owner/user accounts.
* **Owner:** Can view aggregate booking counts and booking revenue only. Guest and booking records are not returned to the owner API.
* **User:** Can create bookings and read only their own bookings.
* Public signup always assigns the `user` role. Only the one-time seed command creates the first admin.

### 4. 🛡️ Backend Security
* JWT session is stored in a `HttpOnly`, `SameSite=Lax` cookie—not browser storage.
* Passwords use Argon2id hashes; plain passwords are never stored.
* API authorization checks roles on the server, and booking prices/taxes are calculated server-side from MongoDB hotel settings.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite 5
* **Styling:** Tailwind CSS, PostCSS, Autoprefixer
* **Icons:** Lucide React
* **Visual Effects:** Canvas Confetti
* **Backend:** Express API on Vercel Node Functions
* **Database / Auth:** MongoDB Atlas, JWT cookies, Argon2id password hashes
* **Fonts:** Cinzel (Royal Serif) & Plus Jakarta Sans

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Locally-Devs/Hotel-booking-website.git
   cd Hotel-booking-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MongoDB and API environment variables:**
   Create a `.env` file in the project root:
   ```env
   MONGODB_URI=mongodb+srv://<db-user>:<db-password>@<cluster>.mongodb.net/hotel_booking
   JWT_SECRET=<random secret with at least 32 bytes>
   APP_ORIGIN=http://localhost:3000
   ```
   Add the MongoDB Atlas connection IP access and database user, then use a long, unique JWT secret. Never commit `.env`.

4. **Start the frontend and API in development:**
   ```bash
   npm run dev
   ```
   Vite runs at `http://localhost:3000`; Express runs at `http://localhost:4000`. Vite proxies `/api` requests to Express.

5. **Open in browser:**
   ```
   http://localhost:3000/
   ```

---

## 👤 Create the First Admin

Create an empty `.env`-ignored local bootstrap configuration for the one-time seed command. Use PowerShell:

```powershell
$env:BOOTSTRAP_ADMIN_EMAIL = "your-admin@example.com"
$env:BOOTSTRAP_ADMIN_NAME = "Hotel Administrator"
$env:BOOTSTRAP_ADMIN_PASSWORD = "use-a-unique-password-of-at-least-12-characters"
npm run seed:admin
Remove-Item Env:BOOTSTRAP_ADMIN_EMAIL, Env:BOOTSTRAP_ADMIN_NAME, Env:BOOTSTRAP_ADMIN_PASSWORD
```

The script refuses to run if an admin already exists. After it succeeds, sign in on the website. The admin dashboard can create owner/user accounts; public signups can only create `user` accounts.

## ☁️ Vercel + MongoDB Atlas

1. Create a MongoDB Atlas cluster and database user; allow Vercel's outbound access as appropriate for your Atlas network policy.
2. Import the repository root into Vercel as one project. The checked-in `vercel.json` configures `npm run build` and `frontend/dist` as the output directory. The function in `api/[...path].js` serves `/api/*` requests through Express; the Vercel rewrite serves the SPA for frontend routes. The frontend calls relative `/api/...` URLs, so it does not need a public API URL or a `VITE_` API variable.
3. Add these server-side Vercel environment variables (no `VITE_` prefix). Set them for Production, and also Preview if you use preview deployments:
   - `MONGODB_URI` — Atlas connection string.
   - `JWT_SECRET` — unique random value of at least 32 bytes.
   - `APP_ORIGIN` — your production site origin, e.g. `https://your-site.vercel.app`. Vercel preview deployment origins are also checked against the forwarded request host.
4. Redeploy after adding the variables. Open `https://your-site.vercel.app/api/health` to verify that the API function can connect to MongoDB and responds with `{"status":"ok"}`. The UI and API share the same origin, and auth cookies remain HttpOnly.

Local development requires MongoDB URI and JWT secret in `.env`, then `npm run dev`. Vite proxies `/api` to Express locally. The one-time admin seed command uses temporary `BOOTSTRAP_ADMIN_*` environment variables and should not be configured as persistent Vercel variables.

---

## 📁 Project Structure

```
├── api/[...path].js        # Vercel serverless adapter
├── backend/                # Express API, models, controllers, middleware
├── .env.example            # Environment variable template
├── frontend/               # Vite/React frontend application
│   ├── index.html           # HTML entry point with Google Fonts
│   ├── vite.config.js       # Vite dev server and API proxy
│   ├── tailwind.config.js   # Custom theme
│   ├── postcss.config.js    # CSS processing
│   └── src/                 # React pages, components, contexts, and API client
├── package.json            # Project dependencies & scripts
└── vercel.json             # SPA routing for Vercel
```

---

## 🌐 Deployment (Zero VPS Required)

This application is built as an optimized Single Page Application (SPA) and can be hosted for **free** on:

* **Vercel:** Deploy the Vite frontend and Node API together, with MongoDB environment variables configured.

---

## 📄 License

This project is licensed under the MIT License. Developed and maintained by **Locally-Devs**.
