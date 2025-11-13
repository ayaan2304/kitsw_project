# 📚 Course Web 2.0 - Project Summary

## 🎯 Project Overview

**Course Web 2.0** is a premium study portal for KITSW (Kakatiya Institute of Technology & Science, Warangal) students. It provides centralized access to curated **Previous Year Questions (PYQs)**, organized by branch, semester, and subject with an intuitive, modern interface.

---

## 🛠️ Technology Stack

### **Frontend**
- **React 19.2** - UI library for building interactive components
- **TypeScript 5.9** - Type-safe JavaScript development
- **Vite 7.2** - Ultra-fast build tool and dev server
- **TailwindCSS 3.4** - Utility-first CSS framework for styling
- **React Router DOM 7.9** - Client-side routing and navigation
- **Framer Motion 12.23** - Smooth animations and transitions
- **TanStack React Query 5.90** - Server state management and data fetching
- **Axios 1.13** - HTTP client for API requests
- **Headless UI 2.2** - Unstyled, accessible components (Listbox, Modal, etc.)
- **Lucide React 0.553** - Beautiful SVG icon library
- **React Hot Toast 2.6** - Toast notifications
- **React PDF 10.2** - PDF viewing and rendering
- **PostCSS & Autoprefixer** - CSS processing and cross-browser compatibility

### **Backend**
- **Node.js 22** - JavaScript runtime
- **Express 5.1** - Web framework for REST APIs
- **JWT (jsonwebtoken 9.0)** - Secure token-based authentication
- **CORS 2.8** - Cross-Origin Resource Sharing
- **Helmet 8.1** - Security headers
- **Morgan 1.10** - HTTP request logging
- **Cookie Parser** - Parse cookies
- **Dotenv 17.2** - Environment variable management

### **Development Tools**
- **Nodemon 3.1** - Auto-restart server during development
- **Supertest 7.1** - HTTP assertion testing
- **ESLint & Prettier** - Code linting and formatting

### **Infrastructure**
- **Docker** - Containerization
- **npm** - Package management

---

## 📱 Page Navigation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LANDING PAGE (/)                              │
│                 Public Entry Point                                │
│  - Hero section with project description                          │
│  - Info about KITSW                                               │
│  - "Login" & "Explore Dashboard" buttons                          │
│  - "About KITSW" external link                                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼ (Click "Login" or "Explore Dashboard")
┌─────────────────────────────────────────────────────────────────┐
│                    LOGIN PAGE (/login)                            │
│              Public Authentication Page                           │
│  - Branch selector dropdown (fetches from /api/branches)          │
│  - Name input field                                               │
│  - Email input field                                              │
│  - Password field                                                 │
│  - "Enter Dashboard" button                                       │
│  - Note: Any credentials work (demo mode)                         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │ ✅ Authentication Success   │
        │ (JWT token generated)       │
        │ (User data stored locally)  │
        │ (Redirect to Dashboard)     │
        └──────────────┬──────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                 DASHBOARD PAGE (/dashboard)                       │
│            🔐 PROTECTED (Requires Authentication)                 │
│                   Main Navigation Hub                             │
│                                                                    │
│  ▶ STEP 1: Select Year                                            │
│    - 4 year options (1st, 2nd, 3rd, 4th Year)                     │
│    - Toast: "Year X selected"                                     │
│                       │                                            │
│  ▶ STEP 2: Select Semester                                        │
│    - 2 semester options per year (Odd/Even)                       │
│    - Toast: "Semester X locked in"                                │
│    - Fetches subjects via /api/subjects                           │
│                       │                                            │
│  ▶ STEP 3: View Subjects                                          │
│    - Grid of subject cards                                        │
│    - Shows total PYQs per subject                                 │
│    - Search bar to filter subjects                                │
│    - Click any subject to view PYQs                               │
│                       │                                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │ (Click on Subject Card)     │
        └──────────────┬──────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│          SUBJECT PAGE (/subjects/:branch/:sem/:subject)           │
│            🔐 PROTECTED (Requires Authentication)                 │
│                  PYQ Listing & Viewing                            │
│                                                                    │
│  - Subject name & semester breadcrumb                             │
│  - List of all PYQs (organized by year)                           │
│  - Each PYQ shows:                                                │
│    • Title & Year                                                 │
│    • File size                                                    │
│    • "View PDF" button                                            │
│    • "Download PDF" button                                        │
│    • ⭐ "Add to Bookmarks" button                                  │
│                       │                                            │
│  ▶ Click "View PDF" ──┐                                            │
│                       └──▶ Opens PDF Modal (PdfViewerModal)        │
│                            - Inline PDF viewer                     │
│                            - Zoom controls                         │
│                            - Page navigation                       │
│                       │                                            │
│  ▶ Click "Download"  ──▶ Downloads PDF file                       │
│                       │                                            │
│  ▶ Click "Bookmark"  ──▶ Saves to local bookmarks                 │
│                            - Toast: "Added to Bookmarks"          │
│                                                                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼ (Navbar Bookmarks Button)
┌─────────────────────────────────────────────────────────────────┐
│                BOOKMARKS PAGE (/bookmarks)                        │
│            🔐 PROTECTED (Requires Authentication)                 │
│               Saved PYQs Collection                                │
│                                                                    │
│  - List of all bookmarked PYQs                                    │
│  - Organized by branch → semester → subject                       │
│  - Quick access buttons:                                          │
│    • "View PDF"                                                   │
│    • "Download PDF"                                               │
│    • "Remove Bookmark"                                            │
│  - Empty state if no bookmarks                                    │
│                                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### **Route Summary**

| Route | Page | Authentication | Purpose |
|-------|------|-----------------|---------|
| `/` | Landing | ❌ Public | Project overview & welcome |
| `/login` | Login | ❌ Public | User authentication (branch + name + email + password) |
| `/dashboard` | Dashboard | ✅ Protected | Year → Semester → Subject selection |
| `/subjects/:branch/:sem/:subject` | SubjectPage | ✅ Protected | View & manage PYQs for a subject |
| `/bookmarks` | Bookmarks | ✅ Protected | View saved bookmarked PYQs |
| `*` | - | - | Redirects to Landing page |

---

## 🔐 Authentication Flow

1. **User lands on Landing page** (`/`)
2. **User clicks "Login"** → Routes to `/login`
3. **User fills form:**
   - Selects Branch (CSE, Civil, ECE, etc.)
   - Enters Name
   - Enters Email
   - Enters Password (any password works in demo)
4. **Backend validates & creates JWT:**
   - Endpoint: `POST /api/auth/login`
   - Returns: `{ token, user: { name, email, branch, branchSlug } }`
5. **Frontend stores in localStorage:**
   - Key: `course2_auth_state`
   - Persists across sessions
6. **User redirected to Dashboard** (`/dashboard`)
7. **AuthContext provides:**
   - `user` object
   - `token` string
   - `isAuthenticated` boolean
   - `logout()` function
8. **Protected routes check `isAuthenticated`:**
   - If false → Redirect to Login
   - If true → Allow access

---

## 📊 Component Architecture

### **Layout Components** (`src/components/layout/`)
- **MainLayout.tsx** - Wraps protected pages with Header + Sidebar
- **Header.tsx** - Top navigation bar with user info & logout
- **Sidebar.tsx** - Left sidebar with navigation links (Dashboard, Bookmarks)

### **UI Components** (`src/components/ui/`)
- **Button.tsx** - Reusable button with variants (primary, secondary, outline)
- **Badge.tsx** - Label/tag component for status indicators
- **Skeleton.tsx** - Loading placeholder for subjects grid

### **PDF Component** (`src/components/pdf/`)
- **PdfViewerModal.tsx** - Modal with embedded PDF viewer (react-pdf)

### **Page Components** (`src/pages/`)
- **Landing.tsx** - Landing page with hero section
- **Login.tsx** - Login form with branch selector
- **Dashboard.tsx** - Year/Semester/Subject selection
- **SubjectPage.tsx** - List of PYQs for a subject
- **Bookmarks.tsx** - Bookmarked PYQs collection

---

## 🔌 API Endpoints

### **Authentication**
```
POST /api/auth/login
Request: { name, email, password, branch }
Response: { token, user: { name, email, branch, branchSlug } }
```

### **Branches**
```
GET /api/branches
Response: [ { id, code, name, slug, totalSubjects }, ... ]
```

### **Subjects**
```
GET /api/subjects?branch={slug}&semester={num}
Response: { branch, semester, subjects: [ { name, slug, totalPyqs }, ... ] }
```

### **PYQs (Previous Year Questions)**
```
GET /api/pyqs?branch={slug}&semester={num}&subject={slug}
Response: { branch, semester, subject, items: [ { id, title, year, sizeBytes, file }, ... ] }
```

### **File Operations**
```
GET /files/view?branch={slug}&sem={num}&subject={slug}&id={id}
→ Returns PDF file for inline viewing

GET /files/download?branch={slug}&sem={num}&subject={slug}&id={id}
→ Downloads PDF file with original name
```

### **Analytics**
```
GET /api/analytics
Response: { views: { key: count }, downloads: { key: count } }
→ Tracks views & downloads per PYQ
```

### **Health Check**
```
GET /health
Response: { status: "ok", timestamp }
```

---

## 💾 Data Structure

### **Backend Data Files**
- **`server/data/subjects.json`** - Maps branches → semesters → subject names
- **`server/data/pyqs.json`** - Maps branches → semesters → subjects → PYQ metadata
- **`server/public/pdfs/`** - Actual PDF files organized by branch/semester/subject

### **Frontend Storage**
- **localStorage `course2_auth_state`** - Stores user auth data
- **React Query Cache** - Caches API responses (branches, subjects, PYQs)
- **Bookmarks Hook (`useBookmarks`)** - Manages bookmarked PYQs via localStorage

### **Supported Branches**
1. **CSE** - Computer Science & Engineering
2. **CSE(AI&ML)** - CSE with AI & Machine Learning
3. **CSE(DS)** - CSE with Data Science
4. **Civil** - Civil Engineering
5. **ECE** - Electronics & Communication Engineering
6. **CSN** - Computer Science & Network Security

Each branch has 8 semesters (4 years × 2 semesters per year)

---

## 🎨 UI/UX Features

### **Design System**
- **Dark Theme** - Slate 950/900 base colors
- **Glass Morphism** - Frosted glass effect panels
- **Gradients** - Cyan/blue primary color scheme
- **Animations** - Smooth transitions via Framer Motion
- **Responsive** - Mobile-first Tailwind CSS

### **Key Features**
- **Toast Notifications** - User feedback (success, error)
- **Loading States** - Skeleton screens for subjects
- **Search Bar** - Filter subjects on Dashboard
- **Breadcrumbs** - Navigation context in SubjectPage
- **PDF Viewer Modal** - Inline PDF viewing with zoom/pan
- **Bookmark System** - Save favorite PYQs
- **Analytics Tracking** - View & download counts per PYQ

---

## 📦 Project Structure

```
project/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── App.tsx                 # Main router config
│   │   ├── main.tsx                # Entry point
│   │   ├── components/
│   │   │   ├── layout/             # MainLayout, Header, Sidebar
│   │   │   ├── ui/                 # Button, Badge, Skeleton
│   │   │   └── pdf/                # PdfViewerModal
│   │   ├── pages/                  # Landing, Login, Dashboard, SubjectPage, Bookmarks
│   │   ├── context/                # AuthContext (auth state mgmt)
│   │   ├── hooks/                  # useBookmarks (bookmarks management)
│   │   ├── services/               # api.ts (Axios instance & API calls)
│   │   ├── types/                  # TypeScript interfaces
│   │   └── utils/                  # Helper functions (format, semesters)
│   ├── vite.config.ts              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── tsconfig.json               # TypeScript config
│   └── package.json                # Dependencies
│
└── server/                         # Node.js Backend (Express)
    ├── src/
    │   ├── index.js                # Server entry & port setup
    │   └── app.js                  # Express app & route handlers
    ├── data/
    │   ├── subjects.json           # Branch → Semester → Subjects
    │   └── pyqs.json               # PYQ metadata
    ├── public/
    │   └── pdfs/                   # PDF files organized by branch/semester
    ├── scripts/
    │   └── generateData.js         # Script to generate test data
    ├── tests/
    │   └── app.test.js             # API tests
    └── package.json                # Dependencies
```

---

## 🚀 Running the Project

### **Prerequisites**
- Node.js 22+
- npm or yarn

### **Development Setup**

**Terminal 1 - Backend Server:**
```bash
cd server
npm install
npm start  # Runs on http://localhost:4000
```

**Terminal 2 - Frontend Dev Server:**
```bash
cd client
npm install
npm run dev  # Runs on http://localhost:5173
```

### **Production Build**
```bash
# Build frontend
cd client
npm run build  # Creates dist/ folder

# Run with Docker
docker build -t course-web-2.0 .
docker run -p 4000:4000 course-web-2.0
```

---

## 🔄 State Management Strategy

### **Authentication State** (AuthContext)
- Global state for user login status
- Persisted in localStorage
- Used across all protected routes

### **Data Fetching** (TanStack React Query)
- Automatic caching & revalidation
- Request deduplication
- Retry logic on failures
- **Cached queries:** branches, subjects, analytics

### **Bookmarks** (Custom Hook)
- LocalStorage-based persistence
- Managed via `useBookmarks` hook
- UI updates in SubjectPage & Bookmarks page

### **UI State** (Component State)
- Year/Semester selection on Dashboard
- Form input on Login
- Search filter on Dashboard

---

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **CORS** - Configured for frontend origin only
- **Helmet** - HTTP security headers
- **Credential Cookies** - HttpOnly, SameSite, Secure flags
- **Token Expiry** - 12 hours
- **Path Sanitization** - PDF file path validation

---

## 📈 Key Metrics

- **Branches:** 6
- **Semesters:** 8 per branch (4 years × 2)
- **Subjects:** 201 total
- **Features:** Branch selection, PDF viewing, Bookmarking, Analytics
- **Mobile Responsive:** Yes
- **Dark Mode:** Yes (default)
- **Animations:** Framer Motion

---

## ✅ Completion Status

| Feature | Status |
|---------|--------|
| Landing Page | ✅ Complete |
| Login System | ✅ Complete (Fixed branch loading) |
| Dashboard | ✅ Complete |
| Subject Page | ✅ Complete |
| Bookmarks | ✅ Complete |
| PDF Viewer | ✅ Complete |
| Authentication | ✅ Complete |
| API Backend | ✅ Complete |
| Responsive Design | ✅ Complete |
| Error Handling | ✅ Enhanced |

---

## 🔧 Recent Fixes

✅ **Fixed Branch Loading Issue**
- Updated API base URL to http://localhost:4000
- Added error state handling in Login page
- Added retry logic to branch fetch query
- Improved error UI with helpful messages
- Added console logging for debugging

---

## 👥 Target Users

- KITSW undergraduate & postgraduate students
- Faculty members for reference
- Placement preparation aspirants

---

## 📞 Support & Feedback

For issues or feature requests:
1. Check browser console for errors
2. Verify backend server is running on port 4000
3. Verify frontend dev server is running on port 5173
4. Check localStorage for auth state
5. Clear browser cache and retry

---

**Built with ❤️ for KITSW Students**
