# 🏨 Luxury Hotel Booking & Management Platform

A modern, responsive hotel booking platform with a Vercel-hosted frontend, Render-hosted Node API, MongoDB persistence, JWT cookie authentication, and role-based access for admins, owners, and users.

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
* **Owner:** Can view aggregate booking counts and payments marked as received only. Guest and booking records are not returned to the owner API.
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
* **Backend:** Express API on Render
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
   PORT=5000
   ```
   Add the MongoDB Atlas connection IP access and database user, then use a long, unique JWT secret. Use the database user's credentials from Atlas **Database Access** (not your Atlas website login). If the database username or password contains URI-reserved characters such as `@`, `:`, `/`, `?`, `#`, or `%`, percent-encode the username and password in the URI. Never commit `.env`.

4. **Start the frontend and API in development:**
   ```bash
   npm run dev
   ```
   Vite runs at `http://localhost:3000`; Express listens on `PORT` from `.env` (defaults to `5000`). Vite reads the same root `.env` value and proxies `/api` requests to that port.

5. **Open in browser:**
   ```
   http://localhost:3000/
   ```

---

## 👤 Create the First Admin and Owner

Set these local, `.env`-ignored values using your own email addresses and non-empty passwords:

```env
BOOTSTRAP_ADMIN_EMAIL=your-admin@example.com
BOOTSTRAP_ADMIN_NAME=Hotel Administrator
BOOTSTRAP_ADMIN_PASSWORD=your-admin-password
BOOTSTRAP_OWNER_EMAIL=your-owner@example.com
BOOTSTRAP_OWNER_NAME=Hotel Owner
BOOTSTRAP_OWNER_PASSWORD=your-owner-password
```

After MongoDB Atlas credentials are working, run `npm run seed:demo-accounts` once to create the admin and owner accounts. The script refuses to overwrite existing admin/owner accounts or emails. Then use the login form's **Admin** or **Owner** option and the matching email/password. Admins can view/manage all bookings; owners receive only aggregate booking counts and revenue. Keep bootstrap passwords only in the ignored local `.env`; do not put them in frontend config or commit them.

## Vercel frontend + Render API + MongoDB Atlas

1. Create a MongoDB Atlas cluster and database user; allow the Render service to connect under your Atlas network policy.
2. Deploy the repository root to Vercel for the frontend. The checked-in `vercel.json` builds `frontend/dist`, proxies `/api/*` requests to `https://hotel-website-gwmt.onrender.com`, and sends frontend routes to the SPA. The browser keeps using same-origin `/api/...` URLs.
3. Deploy the repository root to Render as a Node web service with build command `npm install` and start command `npm start`.
4. Set these Render environment variables: `MONGODB_URI` (Atlas connection string), `JWT_SECRET` (unique random value of at least 32 bytes), and `APP_ORIGIN=https://hotelweb-ten-dusky.vercel.app`. Render supplies `PORT` automatically.
5. Redeploy both services after configuration. Open `https://hotelweb-ten-dusky.vercel.app/api/health`; it should return `{"status":"ok"}`. Auth cookies remain HttpOnly and are served through the Vercel domain.

Local development requires MongoDB URI and JWT secret in `.env`, then `npm run dev`. Vite proxies `/api` to Express locally. Bootstrap credentials are only needed once to seed accounts; do not configure them as persistent Vercel variables.

### Troubleshooting MongoDB Atlas authentication

If the API log reports `bad auth : authentication failed`, Atlas rejected the username/password in `MONGODB_URI`. In Atlas, open **Security → Database Access**, reset the database user's password (or create a dedicated database user), then copy a fresh connection string from **Connect → Drivers** and replace its placeholders. If credentials contain reserved URI characters, percent-encode each credential before placing it in the connection string. Update `MONGODB_URI` in the environment where the error occurs (local `.env` or the matching Vercel Production/Preview environment), then restart the local API or redeploy Vercel. Do not paste the URI or password into chat or logs.

---

## 📁 Project Structure

```
├── backend/                # Express API, models, controllers, middleware
├── .env.example            # Environment variable template
├── frontend/               # Vite/React frontend application
│   ├── index.html           # HTML entry point with Google Fonts
│   ├── vite.config.js       # Vite dev server and API proxy
│   ├── tailwind.config.js   # Custom theme
│   ├── postcss.config.js    # CSS processing
│   └── src/                 # React pages, components, contexts, and API client
├── package.json            # Project dependencies & scripts
└── vercel.json             # Vercel SPA routing and Render API proxy
```

---

## 🌐 Deployment (Zero VPS Required)

This application is built as an optimized Single Page Application (SPA) and can be hosted for **free** on:

* **Vercel + Render:** Deploy the Vite frontend to Vercel and the Node API to Render, with MongoDB environment variables configured on Render.

---

## 📄 License

This project is licensed under the MIT License. Developed and maintained by **Locally-Devs**.
