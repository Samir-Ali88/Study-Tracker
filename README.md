# Study Tracker — Semester 3 Final Exam

University course project for **CSE-2340 (Software Development 1)**.

## Live Demo
**https://samir-ali88.github.io/Study-Tracker/**

Source code: https://github.com/Samir-Ali88/Study-Tracker

## Problem Statement
Preparing for final exams across multiple university courses makes it hard for students to know which topics they have completed, which syllabus areas appear most often in past papers, how many days remain until the exam, and where to find reliable course notes.

## Description
Study Tracker is a responsive single-page web application focused on **Semester 3 Final Exam** preparation (with data structured so additional semesters and Midterm exams can be added later). Each student registers with their own account and tracks topic completion privately in Cloud Firestore, while viewing the exam countdown, past-paper topic frequency charts, course notes, and past-paper questions.

## Courses Covered (Semester 3)
GEED-2302, CSE-2323, STAT-2311, MATH-2307, CSE-2321, CHEM-2301

## Main Features
- **Firebase Authentication**: Email/Password registration, login, logout, persistent sessions, and route protection.
- **Home Dashboard (`/`)**: Time-of-day student greeting, live per-second countdown to the Semester 3 final exams (**December 19, 2026**), topics completed today, and a daily Islamic reminder (Quran verse) fetched from a public API.
- **Progress Tracker (`/progress`)**: Course cards, keyboard-accessible topic checklists, debounced Firestore autosave (`500 ms`), the **99% completion rule** (reaches 100% only after pressing **Mark course complete**, with **Reopen course** undo), and a responsive **Chart.js** horizontal bar chart of top past-paper topics.
- **Resources (`/resources`)**: Two tabs (`?tab=notes` and `?tab=questions`) for Google Drive course folders, community notes with one-vote-per-student enforcement, and filterable past-paper questions.
- **Light / Dark Mode**: Theme toggle in the navbar, saved in `localStorage`, with a black and ivory colour theme.
- **Security Rules**: Production `firestore.rules` so each student can only read and write their own progress.
- **Deployment**: Automatically built and deployed to GitHub Pages with GitHub Actions.

## Technology Stack
- React 18 + Vite (JavaScript)
- Tailwind CSS + shadcn/ui component architecture (`lucide-react`, `cva`, `tailwind-merge`)
- React Router v6 (`HashRouter`, for GitHub Pages)
- Firebase Authentication & Cloud Firestore
- Chart.js (`chart.js` + `react-chartjs-2`)
- `localStorage` + `fetch()` ([AlQuran Cloud](https://alquran.cloud/api) public API, with an offline fallback)
- GitHub Actions + GitHub Pages

## Routes (4 Main Routes)
The app uses hash-based routing, so the live URLs look like `/#/progress`.

| Route | Page | Access |
| --- | --- | --- |
| `/login` | Login & Registration | Public (redirects to `/` if signed in) |
| `/` | Home Dashboard | Protected |
| `/progress` | Progress Tracker & Chart | Protected |
| `/resources` | Notes (`?tab=notes`) & Questions (`?tab=questions`) | Protected |
| `*` | 404 Not Found | Public |

## Team Responsibilities
- **Member 1 (MD Imam Samir Ali)**: Foundation, Routing, Authentication, Progress Tracker (cards, checklist, autosave, 99% rule, daily count, Chart.js frequency chart), Exam Countdown, Home Dashboard, Light/Dark theme, Firestore Security Rules, and Deployment.
- **Member 2**: Notes tab (`src/features/notes/`): Drive links, note submission link, and one-vote-per-student voting.
- **Member 3**: Questions tab (`src/features/questions/`): Past-paper questions list and filters.

## Quick Start (Extract & Run)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Create a free Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication → Email/Password**.
3. Create a **Cloud Firestore** database.
4. Register a Web App (`</>`) under **Project Settings** and copy the config values.
5. Copy `.env.example` to `.env` in the project root and paste your keys:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
> Never commit `.env` to GitHub (it is already listed in `.gitignore`).

### 3. Run locally
```bash
npm run dev
```
Open the URL printed in the terminal (usually `http://localhost:5173`).

### 4. Customize Course Data
- **`src/data/catalog.js`**: Course codes, names, Google Drive links, and final-exam topics.
- **`src/features/progress/examService.js`**: The final exam date is set in the `FINAL_EXAM_DATE` constant (currently December 19, 2026).
- **`src/features/notes/NotesTab.jsx`**: Replace `SUBMIT_NOTES_LINK` with your admin Gmail or Telegram link.
- **Firestore Security Rules**: Copy the contents of `firestore.rules` into **Firebase Console → Firestore Database → Rules** and click **Publish**.

## Deployment

### GitHub Pages (used for the live demo)
1. Push the project to GitHub (`.env` must not be committed).
2. In the repository go to **Settings → Secrets and variables → Actions** and add the six `VITE_FIREBASE_*` values as repository secrets.
3. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Push to the `main` branch. The workflow in `.github/workflows/deploy.yml` builds the app and publishes it.
5. In **Firebase Console → Authentication → Settings → Authorized domains**, add `samir-ali88.github.io`.

`vite.config.js` uses `base: "/Study-Tracker/"` so assets load from the repository path, and the app uses `HashRouter` so page refreshes do not return a 404.

### Firebase Hosting (alternative)
```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy
```
For Firebase Hosting, remove the `base` line from `vite.config.js` and add your `.web.app` domain to Firebase's authorized domains.

## Screenshots
`PLACEHOLDER — Add screenshots of Login, Home, Progress, and Resources pages (light and dark mode) here`
