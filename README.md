# Abdul Motaleb — Cyber Security Portfolio & Admin Control Center

A modern, high-performance personal portfolio website and full-featured Admin Control Panel for **Abdul Motaleb** (Cyber Security Expert, Ethical Hacker, Social Media Expert, and Web Developer).

Built with a futuristic cyber security dark aesthetic, glassmorphism, neon UI, interactive terminal elements, Firebase Authentication, Firebase Firestore, and direct ImgBB cloud media integration.

---

## 🌟 Key Features

### 1. Cyber Security Public Portfolio
- **Cyber Hero Section:** Available for Projects live beacon, animated terminal card (`user@portfolio:~$ whoami`), floating code badges, glowing circular cyber avatar frame, and quick CTAs (Hire Me, Download CV).
- **About Section:** `About_Me.exe` terminal parameters card, biography in English and বাংলা, strength checklist.
- **My Skills:** Animated circular SVG progress gauges with percentage counters, category badges, and hover glow.
- **My Services:** 6 cyber cards covering Network Security, Ethical Hacking, Web Development, UI/UX Design, Social Media Management, and Security Consultation.
- **My Projects:** Filterable project showcase (Security, Web Development, Social Media, Design) with live demo modals, tech tags, and source repository links.
- **Career Journey (Experience):** Vertical glowing diamond timeline from 2023 to 2026.
- **Certificates:** Verified credentials (Google Ethical Hacking, Coursera Cyber Security, freeCodeCamp, Meta) with credential verification modals.
- **Gallery (52+ Photos):** All 52 original website photographs preserved, category filter tabs (Nature, Tech, Design, Others), live search, masonry view, and full lightbox with Next/Previous navigation.
- **My Stats:** 50+ Projects Completed, 30+ Websites Developed, 20+ Happy Clients, 5+ Years Experience.
- **Testimonials:** Interactive client review slider with 5-star ratings.
- **Contact Me:** Direct inquiries form saving automatically to Firebase Firestore `messages` collection.
- **Multilingual Support:** One-click language switcher (`EN | বাংলা`).
- **Themes:** Instant live theme switcher across **Cyber Dark**, **Electric Blue**, **Hacker Green**, and **Cyber Light**.
- **Mobile First:** Mobile drawer menu, swipe gallery, and persistent mobile bottom navigation bar.

---

### 2. Comprehensive Admin Control Panel (`/admin/login` & `/admin/dashboard`)
- **Restricted Access:** Firebase Email/Password Authentication with NO public registration.
- **Admin Authorization:** Enforced via Firebase Auth and Firestore Security Rules.
- **Full CRUD Management:**
  - Hero section text, avatar, buttons, and terminal messages
  - About section biography and highlights
  - Skills dials, percentages, icons, colors, and order
  - Services titles, descriptions, and action links
  - Projects with live URLs, GitHub links, and multiple screenshots
  - Career journey milestones and organizations
  - Certificates and accreditation body badges
  - Gallery photos (manage, replace, and upload new photos)
  - Central Media Library with direct ImgBB API uploads (`https://api.imgbb.com/`)
  - Statistics numbers and labels
  - Client testimonials and star ratings
  - Contact inbox with unread counter, read/unread status, and message deletion
  - Header navigation links and reordering
  - Social media channels (GitHub, LinkedIn, Facebook, YouTube, WhatsApp)
  - SEO metadata, Open Graph, Twitter cards, and Google Verification
  - Theme colors and neon glow intensity
  - Site maintenance mode toggle
  - Complete JSON backup export and validated import

---

## 🔒 Preserved SEO & Google Verification
- **Google Site Verification:** `qMBAhBAM1H9LGRBS2XRXJY_ffyNEucSdZW1W_Dbf2Bw`
- **Existing Title:** `Abdul Motaleb | Personal Portfolio`
- **Existing Description:** `Abdul Motaleb – Modern personal portfolio from Feni, Bangladesh. Cyber Security Expert, Ethical Hacker, Social Media Expert, and Web Developer.`
- **SEO Keywords:** Preserved in both English and Bengali (including `আবদুল মোতালেব`, `আবদুল মোতালেব ওয়েবসাইট`, etc.).
- **Structured Data:** JSON-LD schema for `Person` and `WebSite`.

---

## 🚀 Deployment Guide

### A. Deploy to Vercel
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/), select **Add New Project** and import the repository.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Deploy!

### B. Deploy to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. Initialize hosting: `firebase init hosting`
   - Public directory: `dist`
   - Configure as single-page app: `Yes`
4. Build the application: `npm run build`
5. Deploy: `firebase deploy --only hosting`

### C. Deploy to Netlify
1. Connect repository in [Netlify Dashboard](https://app.netlify.com/).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

---

## 🛡️ Firestore Security Rules

To apply the production security rules, upload `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Public visitors have read-only access to public sections and can submit messages to `messages`. Only authenticated administrators can modify content or read inbox messages.

---

## 🔑 Administrator Access

- **Admin Login Route:** `/admin/login`
- **Subtle Footer Link:** Click the lock icon next to "Admin Login" in the footer.
- **Default / Demo Credentials:**
  - Email: `admin@abdulmotaleb.com`
  - Password: `Admin@Cyber2026!`
- Or create a user in your Firebase Authentication console (`abdul-motaleb-website`).
