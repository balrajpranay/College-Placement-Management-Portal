# 🎓 Campus Connect — Institutional Career & Placement Intelligence Platform

[![Live Production](https://img.shields.io/badge/Live%20Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://college-placement-management-portal.vercel.app/)
[![Production Status](https://img.shields.io/badge/Status-Live%20%26%20Operational-2ea44f?style=for-the-badge)](https://college-placement-management-portal.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> 🌐 **Live Production Portal**: [**https://college-placement-management-portal.vercel.app/**](https://college-placement-management-portal.vercel.app/)  
> Instant cloud access for Students, Corporate Recruiters, and Placement Officers.

Campus Connect is a comprehensive, production-grade placement and career intelligence portal designed for collegiate ecosystems. It bridges students, corporate recruiters, and institutional placement administrators into a unified, secure platform featuring real-time eligibility screening, automated Google Meet interview scheduling, instant candidate selection notifications, and Google Gemini AI career coaching.

---

## 👥 Project Team & Task Distribution

### Team Members

| Name | Roll Number | Primary Role |
| :--- | :---: | :--- |
| **Aisha Earam** | `24QM1A6605` | Frontend Engineering & UI/UX Design |
| **B. Pranay Kumar** | `24QM1A6608` | Full-Stack Architecture & Backend Development |
| **Kethapaga Bhavani** | `24QM1A6652` | Database Modeling, Data Pipeline & AI Integration |

---

### Task & Responsibility Breakdown

#### 🎨 Aisha Earam (24QM1A6605) — Frontend Engineering & UI/UX Design
* **Responsive Portal Design**: Architected the frontend UI with React 18 and Vite, implementing a custom CSS design system with variable tokens, zero-overflow containers, and dynamic light/dark theming.
* **Student Portal Experience**: Built the interactive Student Dashboard, Profile management, verified credentials showcase, and application status trackers.
* **Resume Studio & Typography**: Designed the live LaTeX-inspired Resume Builder Studio featuring multiple header alignment styles (Left, Center, Split, Modern Right, Icon Badges), custom separators (`|`, `•`, `/`, `–`, `❖`), and font selections (Times New Roman, Plus Jakarta Sans, Inter, Outfit).
* **Interactive AI Assistant Interface**: Crafted the floating Gemini AI Career Advisor widget with smooth horizontal scrolling prompt chips, mousewheel navigation, and interactive starter chips.
* **Candidate Notification System**: Developed the rich notification feed displaying candidate selection badges, schedule details, direct Google Meet action triggers, and copy-link utilities.

#### ⚙️ B. Pranay Kumar (24QM1A6608) — Full-Stack Architecture & Backend Development
* **System Architecture & API Design**: Designed the modular Node.js and Express RESTful API architecture, endpoint controllers, routing structure, and error-handling middleware.
* **Authentication & RBAC Security**: Implemented JSON Web Token (JWT) session lifecycle, bcrypt password hashing, Google OAuth 2.0 authentication, and strict Role-Based Access Control across Student, Recruiter, and Admin boundaries.
* **Recruiter & Selection Workflows**: Engineered candidate pipeline controls, applicant review stages (Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Rejected), and verified recruiter approval gates.
* **Google Meet Automation & Sync**: Developed dynamic Google Meet meeting link generation, selection modal workflows, and bidirectional real-time synchronization between recruiter hiring decisions and student accounts.
* **Placement Administration Command**: Implemented institutional governance tools, company verification controls, campus drive approvals, and placement offer dispatches.

#### 🗄️ Kethapaga Bhavani (24QM1A6652) — Database Modeling, Data Pipeline & AI Integration
* **Data Modeling & Schema Architecture**: Designed MongoDB Atlas schemas and Mongoose models for Users, Students, Companies, Drives, Applications, Interviews, Notifications, Placement Results, and Chat Sessions.
* **Opportunity Catalog Pipeline**: Curated and structured the database with 600+ placement drives, national internships (Prime Minister's Internship Scheme), and technical skill-up learning modules with direct application deep links.
* **Google Gemini AI Integration**: Integrated Google Gemini API for intelligent career advising, automated eligibility reasoning, and technical DSA/mock interview prep.
* **Data Synchronization & In-Memory Fallbacks**: Implemented persistent conversation storage, notification delivery pipelines, and reliable MongoDB-to-memory cache fallbacks for high availability.
* **Verification, Testing & Build Optimization**: Managed automated API integration testing, production build auditing (`npm run build`), and Vercel serverless deployment configurations.

---

## 🛠️ Technology Stack

The project is built entirely on modern web standards and proven open-source technologies:

### Frontend
* **React 18**: Component-based user interface and reactive state management.
* **Vite 6**: Next-generation lightning-fast frontend tooling and bundling.
* **React Router 6**: Declarative client-side routing and protected role gateways.
* **Custom Design System**: Native CSS3 with CSS custom properties, responsive grid/flexbox layouts, zero layout shift, and dark/light mode tokens.
* **SVG Icon System**: Custom accessible vector icons and responsive brand lockups.

### Backend
* **Node.js**: Asynchronous JavaScript runtime environment.
* **Express.js**: Fast, unopinionated REST API framework.
* **JSON Web Tokens (JWT)**: Stateless, tamper-proof user authentication.
* **Bcrypt.js**: High-entropy password hashing and cryptographic security.
* **CORS & Middleware**: Protected cross-origin headers, role authorization guards, and request validators.

### Database & ODM
* **MongoDB Atlas**: Fully managed cloud NoSQL database cluster.
* **Mongoose 8**: Object Data Modeling (ODM) library with strict schemas, population hooks, and validation.
* **In-Memory Cache Layer**: Resilient fallback cache ensuring zero downtime during network reconnects.

### AI & External Integrations
* **Google Gemini API**: Context-aware career coaching, ATS resume evaluation, and technical coding guidance.
* **Google Meet Integration**: Automated generation of secure video conference links for candidate selection and interview rounds.
* **Google OAuth 2.0**: Fast single sign-on authentication for campus students and verified recruiters.

### Deployment & DevOps
* **Vercel**: Automated Git-integrated continuous deployment for both static React frontend and Express serverless functions.
* **Git & GitHub**: Distributed source code version control.
* **npm**: Dependency management and build lifecycle scripting.

---

## 🌟 Key Application Modules

* **Student Career Hub**: Browse and filter 600+ curated opportunities, real-time eligibility evaluation against CGPA and backlog requirements, live interview schedule tracking, and direct Google Meet joining.
* **Recruiter Pipeline**: Verified corporate partners can post campus drives, review resumes, advance candidates, trigger automated Google Meet selection rounds, and issue official placement results.
* **Placement Administration**: Real-time institution-wide placement metrics, corporate verification approval gate, student cohort auditing, and drive management.
* **AI Career Advisor**: Google Gemini-powered career mentor for placement roadmaps, DSA prep, interview mock questions, and Prime Minister's Internship Scheme guidance.
* **Resume Studio**: Overleaf-inspired LaTeX resume editing engine with real-time typography, custom separators, and instant PDF export.

---

## 🌐 Live Production Deployment

The complete application is continuously built and hosted on Vercel:

| Resource | URL | Description |
| :--- | :--- | :--- |
| **Production Web Portal** | [**college-placement-management-portal.vercel.app**](https://college-placement-management-portal.vercel.app/) | Primary user interface for Students, Recruiters & Admin |
| **Backend REST API** | [**college-placement-management-portal.vercel.app/api/health**](https://college-placement-management-portal.vercel.app/api/health) | Live Node.js + Express API health verification |
| **Opportunities Catalog** | [**college-placement-management-portal.vercel.app/api/jobs**](https://college-placement-management-portal.vercel.app/api/jobs) | Live 600+ placement & internship aggregator pipeline |

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)
* **MongoDB Atlas** connection string

### 1. Clone the Repository
```bash
git clone https://github.com/balrajpranay/College-Placement-Management-Portal.git
cd College-Placement-Management-Portal
```

### 2. Install Dependencies
```bash
# Install root and backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the project root:
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Run the Application
```bash
# Terminal 1 — Start the Backend Server:
npm start

# Terminal 2 — Start the Frontend Vite Dev Server:
cd client
npm run dev
```

* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://127.0.0.1:5001`
* **Health Check**: `http://127.0.0.1:5001/api/health`

---

## 📄 License
This project is developed for institutional academic placement operations and released under the **MIT License**.
