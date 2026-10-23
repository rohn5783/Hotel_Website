# 🏨 Luxury Hotel Booking & Management Platform

A modern, high-performance, and responsive online hotel booking platform with an integrated **Owner CMS (Content Management System)**, **24/7 Hotel AI Concierge Robot**, and **Agency SuperAdmin Controls (with Client Kill Switch)**.

Built with **React 18**, **Vite**, **Tailwind CSS**, and **Supabase (Free Tier)**.

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

### 3. 🏨 Hotel Owner CMS Dashboard (Admin)
When the hotel owner logs in with their credentials, the public landing page transforms into a full-screen **Administrative Management Portal**:
* **Live Bookings Manager:** View, filter, and manage all direct customer reservations with guest phone numbers, dates, room types, and total revenue.
* **Hotel Profile & Branding:** Edit Hotel Name, Tagline, Hero Subtitles (e.g. "...in the heart of Pink City"), City/Location, Address, Phone, WhatsApp, and Email.
* **Room Inventory, Pricing & Photos:** Edit Executive and Premium room rates per day, descriptions, specifications, and upload new room photos (file upload or URL).
* **Nearby Tourist Attractions:** Add, edit, or delete tourist monuments and drive times.
* **Account Security & Google Link:** Update password and link a personal Google account for future 1-click Google Sign-In.
* **Live Website Preview:** One-click toggle to view the live website as visitors see it, with a floating top bar to return to the dashboard.

---

### 4. 👑 Agency SuperAdmin Command Center
* **Client Kill Switch (Payment Protection):** If a client defaults on development payments, the agency can toggle the Kill Switch to suspend the website and display a custom lockdown screen (*"Website Access Temporarily Suspended"*).
* **Owner Credential Generator:** Create new Hotel Owner admin credentials with a single click, ready to copy and paste to WhatsApp or Email.

---

### 5. ☁️ Supabase Cloud Database (Free Tier Ready)
* **Dual-Mode Persistence:** 
  * Works out of the box in local demo mode (persisting in browser storage).
  * Connects seamlessly to a free Supabase Cloud PostgreSQL database simply by adding credentials in `.env`.
* **Database Schema Included:** Complete SQL schema ready to paste into Supabase SQL Editor (`supabase_schema.sql`).

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite 5
* **Styling:** Tailwind CSS, PostCSS, Autoprefixer
* **Icons:** Lucide React
* **Visual Effects:** Canvas Confetti
* **Database / Auth:** Supabase (`@supabase/supabase-js`) with Local Dual-Mode Fallback
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

3. **Configure Environment Variables (Optional for Supabase Cloud):**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_SUPERADMIN_SECRET_KEY=agency_royal_master_2026
   ```
   *(Note: The project works out of the box even without Supabase keys using local dual-mode).*

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000/
   ```

---

## 🔑 Demo Login Credentials

You can test all user roles using the single **"Sign In / Sign Up"** button on the website:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **🏨 Hotel Owner** | `owner@royalgrand.com` | `owner` | Full Administrative CMS Dashboard |
| **👑 SuperAdmin (Agency)** | `superadmin@agency.com` | `admin` | Kill Switch & Credential Generator |
| **🧳 Hotel Guest** | Any email or Google Sign-In | Any password | Public Booking & Reservations |

---

## 📁 Project Structure

```
├── .env.example            # Environment variables template
├── index.html              # HTML entry point with Google Fonts
├── package.json            # Project dependencies & scripts
├── supabase_schema.sql     # Supabase SQL schema for tables & RLS policies
├── tailwind.config.js      # Custom theme colors (Royal Gold & Deep Navy)
├── vite.config.js          # Vite build configuration
└── src/
    ├── App.jsx             # Main router & role-based view switcher
    ├── index.css           # Global Tailwind & scrollbar styles
    ├── main.jsx            # React root mount
    ├── components/
    │   ├── AboutSection.jsx          # Heritage story & nearby Jaipur spots
    │   ├── AdminDashboard.jsx        # Modal CMS for hotel management
    │   ├── AmenitiesSection.jsx      # Royal privileges & features
    │   ├── AuthModal.jsx             # Single unified Login/Signup modal
    │   ├── BookingModal.jsx          # Multi-step direct booking flow
    │   ├── Footer.jsx                # Contact details & inquiry form
    │   ├── GallerySection.jsx        # Visual photo tour
    │   ├── GoogleChooserModal.jsx    # Google account sign-in popup
    │   ├── Hero.jsx                  # Main banner & quick booking search
    │   ├── HotelRobot.jsx            # 24/7 AI concierge chatbot widget
    │   ├── Navbar.jsx                # Sticky navigation header
    │   ├── OwnerApp.jsx              # Full-screen Owner CMS Portal
    │   ├── RoomsSection.jsx          # Room cards (Executive & Premium)
    │   ├── SuperAdminModal.jsx       # Agency Kill Switch & Admin Generator
    │   └── SuspendedScreen.jsx       # Lockdown screen when Kill Switch is active
    ├── context/
    │   ├── AuthContext.jsx           # Authentication & role management
    │   └── HotelContext.jsx          # Hotel data & booking state store
    ├── data/
    │   └── hotelData.js              # Default hotel configuration & seed data
    └── lib/
        └── supabaseClient.js         # Supabase client & dual-mode storage
```

---

## 🌐 Deployment (Zero VPS Required)

This application is built as an optimized Single Page Application (SPA) and can be hosted for **free** on:

* **Vercel:** Connect this GitHub repository, leave default build command (`npm run build`) and output directory (`dist`), and deploy!
* **Cloudflare Pages:** Connect repository, framework preset `Vite`, deploy!
* **Netlify / Hostinger Shared Hosting:** Run `npm run build` and upload the contents of the `dist/` folder.

---

## 📄 License

This project is licensed under the MIT License. Developed and maintained by **Locally-Devs**.
