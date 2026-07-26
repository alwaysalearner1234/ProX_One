# ProX One – AI-Powered Global Student Ecosystem Dashboard 🚀

> **The Next-Generation Unified Platform for Students, Universities, Recruiters, and Global Tech Innovators.**

[![GitHub Pages Deployment](https://img.shields.io/badge/GitHub-Pages-222222?logo=github&logoColor=white)](https://alwaysalearner1234.github.io/ProX_One/)
[![Firebase Auth](https://img.shields.io/badge/Firebase-Auth-039BE5?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌐 Live URLs & Previews

- **GitHub Pages Live Deployment**: [https://alwaysalearner1234.github.io/ProX_One/](https://alwaysalearner1234.github.io/ProX_One/)
- **Local Dev Server**: `http://localhost:5173/`
- **Firebase Hosting URL**: [https://prox-one-student.web.app](https://prox-one-student.web.app) *(Requires 1-time `firebase login` CLI refresh below)*

---

## 🔑 Why Firebase Hosting show an authentication error?

If you see a Firebase 401 error when deploying, it means your local Firebase CLI OAuth session expired. Simply run:
```bash
firebase login
firebase deploy --only hosting
```
This re-authenticates your CLI and instantly deploys `dist/` to `https://prox-one-student.web.app`!

---

## 💡 What is ProX One?

**ProX One** combines the absolute best features of **LinkedIn** *(professional networking)*, **GitHub** *(code & portfolios)*, **Discord** *(real-time student communities)*, **Coursera** *(certified learning academy)*, **Devpost** *(hackathons)*, **Internshala** *(internships & entry-level roles)*, and **GenAI Career Mentorship** into one unified, hyper-personalized super-app for students worldwide.

Built with an ultra-modern SaaS design aesthetic inspired by Apple, Linear, Stripe, Notion, Vercel, and Arc Browser, ProX One features deep space dark mode (`#0B0F19`), frosted glassmorphic panels (`backdrop-filter: blur(16px)`), glowing neon gradients (electric blue, neon purple, cyan, emerald), and an interactive HTML5 background particle canvas.

---

## 🔥 Key Feature Matrix

### 1. 🛡 Top Navigation & Global AI Search
- **ProX One Brand Engine**: Glowing atomic icon with animated pulse effect.
- **Global AI Search (⌘ K)**: Instant search overlay across hackathons, jobs, internships, courses, and members.
- **Voice Search Integration**: Native browser Web Speech API voice synthesis and speech recognition visualizer.
- **Firebase Auth Pill**: Real-time sign-in status indicator for Google SSO and Email authentication.
- **Quick Action Bar**: Notifications badge (4 unread), Messages drawer, Calendar shortcut, Glowing AI Coach launcher, and Theme toggle.

### 2. 🧭 18 Active Navigation Views
Every single sidebar item renders a dedicated, fully populated interactive view (0 blank pages):
- 🏠 **Dashboard**: Primary hub featuring Hero 3D orbit, KPIs, AI Match cards, Leaflet map, portfolio suite, and community feed.
- 🌍 **Discover**: Open-source repository & research paper explorer with live demo links and star counts.
- 🎯 **Opportunities**: Unified feed of internships, research fellowships, startup grants, and hackathon challenges.
- 🏆 **Hackathons**: Devpost Hackathons Hub with prize pool breakdown ($250k+), live countdown clocks, and team finder.
- 💼 **Internships**: Verified tech roles at Google, OpenAI, Microsoft, NVIDIA, Meta, Apple, and Tesla with 1-click ATS application.
- 💼 **Jobs**: Full-time graduate & remote software engineering positions for 2026 graduates.
- 🎓 **Colleges**: Global university campus network (Stanford, MIT, Harvard, UC Berkeley, Oxford, ETH Zurich).
- 📚 **Learning**: Coursera & ProX Learning Academy with progress trackers for AI Agents, Next.js 15, and System Design.
- 📂 **Projects**: Student project portfolio showcase with live GitHub stats and recruiter view badges.
- 🏅 **Certificates**: Blockchain-verified credentials from Stanford, Coursera, AWS, and Google Cloud with instant LinkedIn share.
- 🤖 **AI Career Coach**: AI Diagnostic Studio, ATS resume scanner, and mock technical interview simulator.
- 👥 **Communities**: Discord-style developer rooms for AI/ML, Web Dev, Cyber, Robotics, and Competitive Programming.
- 💬 **Messages**: Recruiter and mentor direct inbox with interactive chat window.
- 🎥 **Live Events**: Live streaming auditorium with viewer counters and tech talks.
- 🗓 **Calendar**: Ecosystem deadline & interview schedule grid.
- 📈 **Analytics**: Personal career telemetry, recruiter search visibility, and callback conversion rates.
- ❤️ **Saved**: Bookmarked opportunities, projects, and courses.
- ⚙ **Settings**: Account preferences, profile manager, and AI match sensitivity sliders.

### 3. 🤖 Interactive AI Career Coach Studio
- **Hero Speech Bubble Widget**: Real-time AI recommendations based on profile resume analysis.
- **ATS Resume Diagnostics**: Instant 0–100 ATS compatibility breakdown (96/100) with key keyword density suggestions.
- **Mock Technical Interview Simulator**: Interactive system design and algorithm interview practice.

### 4. 🗺 Nearby Opportunities Map
- **Leaflet.js Dark Mode Map**: Centered on Silicon Valley / Stanford University with custom neon pin markers for nearby Hackathons, Tech Talks, Research Labs, Incubators, and Coworking spaces.

### 5. 🔐 Firebase Authentication Integration
- **Google Single Sign-On (SSO)** & **Email/Password Auth** via Firebase Auth SDK v10.
- **Real-Time State Listener (`onAuthStateChanged`)**: Automatically synchronizes authenticated user name, email, and avatar across top nav, hero welcome banner, and sidebar profile card.

---

## 🛠 Technology Stack

- **Core UI Engine**: HTML5, Vanilla JavaScript (ES Modules), CSS3 (Custom Glassmorphism Design System)
- **Build Tool & Bundler**: [Vite 8.1](https://vitejs.dev/)
- **Interactive Mapping**: [Leaflet.js](https://leafletjs.com/) with CartoDB Dark Matter Vector Tiles
- **Authentication**: [Firebase Auth SDK v10](https://firebase.google.com/docs/auth)
- **Deployment**: GitHub Pages & Firebase Hosting
- **Typography & Icons**: Google Fonts (*Outfit* & *Plus Jakarta Sans*) + FontAwesome 6 Pro

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18.0.0` or higher
- `npm`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/alwaysalearner1234/ProX_One.git
cd ProX_One
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
