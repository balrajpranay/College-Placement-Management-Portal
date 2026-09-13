# 🎓 Campus Connect — Institutional Career & Placement Intelligence Platform

---

## 📖 Table of Contents
- [Executive Overview](#-executive-overview)
- [Core Production Pillars](#-core-production-pillars)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Directory Structure](#-directory-structure)
- [Local Quickstart & Setup](#-local-quickstart--setup)
- [Vercel Production Deployment](#-vercel-production-deployment)
- [Demo Credentials](#-demo-credentials)
- [License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Executive Overview

**Campus Connect** is an institutional placement and career intelligence portal built with **React 18**, **Vite**, **Node.js / Express**, and **MongoDB Atlas**, with automated **Vercel Serverless** deployment. Designed specifically for collegiate ecosystems, it unifies over **520+ live, verified opportunities** across full-time graduate recruitment and national internship schemes, with 100% direct-to-application deep links.

---

## 🚀 Core Production Pillars

### 1. 📈 520+ Production Opportunity Catalog
- **🎓 Placements & Jobs (260+ Listings)**: Sourced from premier tech giants and recruitment networks including *Infosys, TCS Digital, Wipro, Google, Microsoft, Amazon, Deloitte, Tech Mahindra, Razorpay, PhonePe, Swiggy, Zomato, Cred, Paytm, Meesho, Groww, Zerodha, Postman, Cisco, Oracle, SAP Labs, Adobe, Intel, AMD, Qualcomm, AccioJob, AICTE, SJCE, NMAMIT, and Naukri.com*.
- **💼 Internships & PM Scheme (260+ Listings)**: Curated tracks from the *Prime Minister's Internship Scheme* alongside *AICTE Regional Hub (Hyderabad), Internshala, LinkedIn, and Indeed*.
- **🛠️ 28 Skill-Up Learning Tracks**: Interactive skill curricula spanning Software Engineering, AI/ML, Cloud Infrastructure, and Data Analytics.

### 2. 🔗 100% Direct Pre-Filtered Application Deep Links
- **Zero Homepage Roots**: Every listing links directly to the specific job permalink or pre-filtered student/India career board.
- **Safe Session Preserving**: All application triggers open in a new tab (`target="_blank" rel="noopener noreferrer"`), ensuring candidates never lose their place in the portal.

### 3. ⭐ Featured Top Employers & MNCs Showcase
- Prominently showcases high-tier corporate partners (*Google, Microsoft, Deloitte, Tech Mahindra, Infosys, Amazon, TCS, Wipro, Accenture, Capgemini, IBM, PM Scheme*) with custom vector SVG branding, hiring tracks, and instant 1-click application access.

### 4. 👨‍🎓 Comprehensive Multi-Role Portals
- **Student Portal**: Live KPI metrics (Profile Strength, Applications, Upcoming Interviews, Placement Status, Notifications).
- **Recruiter Portal**: End-to-end drive management, applicant pipelines, interview scheduling, and offer finalization.
- **Admin Portal**: Institutional cohort auditing, company approvals, drive verification, placement reports, and system analytics.

---

## 🏗️ System Architecture

```
                                +---------------------------+
                                |    Client Web Browser     |
                                |  (Desktop, Tablet, Mobile)|
                                +-------------+-------------+
                                              |
                                              | HTTPS (Vite React SPA)
                                              v
+------------------------------------------------------------------------------------------+
|                                     Vercel Platform                                      |
|                                                                                          |
|   +---------------------------------------+   +--------------------------------------+   |
|   |         React 18 Single Page App      |   |       Serverless API Function        |   |
|   |          (client/dist static)         |   |             (/api/*)                 |   |
|   |  - Student, Recruiter & Admin Portals |   |  - Express.js Serverless Adapter     |   |
|   |  - 520+ Opportunity Hub & Search      |   |  - JWT Authentication & RBAC Guard   |   |
|   |  - Real-Time Skill-Up Center          |   |  - Mongoose Connection Cache         |   |
|   +-------------------+-------------------+   +------------------+-------------------+   |
+-----------------------|------------------------------------------|-----------------------+
                        |                                          |
                        v                                          v
+------------------------------------------------------------------------------------------+
|                                  MongoDB Atlas (Cloud)                                   |
|   - Users (Bcrypt Passwords & Google Auth)                                               |
|   - Placement Drives, Applications, Interviews, Notifications & Placement Results        |
+------------------------------------------------------------------------------------------+
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Description |
|---|---|---|
| **Frontend** | React 18, Vite 6, React Router 6 | Modern Single-Page Application with responsive dark/light themes |
| **Backend API** | Node.js, Express.js | Modular REST API with JWT authentication and RBAC |
| **Database** | MongoDB Atlas, Mongoose 8 | Cloud document database with cached serverless pooling |
| **Authentication** | JWT, BcryptJS, Google OAuth 2.0 | Multi-role secure session management |
| **Deployment** | Vercel Serverless | Automated Git-integrated frontend static serving + serverless backend |

---

## 📂 Directory Structure

```
Campus Connect/
├── api/
│   └── index.js               # Vercel Serverless Function Adapter
├── client/                    # React 18 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/        # UI Components (Navbar, Footer, ProtectedRoute, etc.)
│   │   ├── context/           # AuthContext (JWT & Session Store)
│   │   ├── layouts/           # Role Shells (Public, Student, Recruiter, Admin)
│   │   ├── pages/             # Route Views (Landing, JobsHub, Portals, Auth)
│   │   └── services/          # API Client (Fetch Adapter)
│   ├── public/                # Static assets (Company SVGs, Logos, Favicon)
│   └── package.json           # Frontend Dependencies & Vite Scripts
├── server/                    # Express.js REST API Backend
│   ├── config/                # Database Connector (Mongoose Connection Cache)
│   ├── controllers/           # Business Logic (Auth, Student, Recruiter, Admin, Jobs)
│   ├── middleware/            # Auth & RBAC Guards
│   ├── models/                # Mongoose Models (User, Student, Company, Drive, etc.)
│   ├── routes/                # Express Route Declarations
│   └── server.js              # Express App Factory
├── vercel.json                # Vercel Deployment & SPA Routing Configuration
├── package.json               # Root Build Configuration for Vercel
└── README.md                  # Project Documentation
```

---

## 💻 Local Quickstart & Setup

### Prerequisites
- Node.js 18+ installed on your system.
- Git installed.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/balrajpranay/Campus-Connect.git
cd Campus-Connect

# Install server & client dependencies
npm install
cd client && npm install && cd ..
```

### 2. Configure Environment Variables
Create `.env` in the root (or `server/.env`):
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your-secure-jwt-secret-key-here
MONGODB_URI=your-mongodb-atlas-uri
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Run Locally
```bash
# Terminal 1 — Start Backend:
npm start

# Terminal 2 — Start Frontend:
cd client && npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🚀 Vercel Production Deployment

1. Push your changes to GitHub:
   ```bash
   git push origin main
   ```
2. In the **Vercel Dashboard**, import your GitHub repository.
3. Configure the following **Environment Variables** in Vercel:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(your secure JWT secret)*
   - `MONGODB_URI`: *(your MongoDB Atlas connection string)*
   - `GOOGLE_CLIENT_ID`: *(your Google OAuth client ID)*
   - `GOOGLE_CLIENT_SECRET`: *(your Google OAuth client secret)*
4. Click **Deploy**. Vercel will automatically build the React frontend and deploy the serverless Express API.

---

## 👥 Demo Credentials

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| 👨‍🎓 **Student** | `priya.sharma@student.edu` | `student123` | Student Dashboard, Applications, Interviews, Profile |
| 🏢 **Recruiter** | `hr@technova.com` | `recruiter123` | Drive Creation, Candidate Pipeline, Scheduling, Offers |
| 🏛️ **Placement Admin** | `admin@college.edu` | `admin123` | Institutional Analytics, Cohort Auditing, Drives, Reports |

---

## 📄 License & Acknowledgments

Distributed under the **MIT License**.

Special thanks to:
- **AICTE & Ministry of Corporate Affairs** for the Prime Minister's Internship Scheme initiative.
- All contributing academic institutions and recruitment partners.

---

<div align="center">
  <sub>Built with ❤️ for student career acceleration.</sub>
</div>

