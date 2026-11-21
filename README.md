# Study Tracker — Semester 3 Final Exam

University course project for **CSE-2340 (Software Development 1)**.

## Problem Statement
Preparing for final exams across multiple university courses makes it hard for students to know which topics they have completed, which syllabus areas appear most often in past papers, how many days remain until the next exam, and where to find reliable course notes.

## Description
Study Tracker is a responsive single-page web application focused on **Semester 3 Final Exam** preparation (with data structured so additional semesters and Midterm exams can be added later). Each student registers with their own account and tracks topic completion privately in Cloud Firestore, while viewing shared exam dates, past-paper topic frequency charts, course notes, and past-paper questions.

## Main Features
- **Firebase Authentication**: Real Email/Password registration, login, logout, persistent sessions, and route protection.
- **Home Dashboard (`/`)**: Time-of-day student greeting, live per-second countdown to the next upcoming final exam, topics completed today, quick note link, and daily study quote cached in `localStorage` with an offline fallback.
- **Progress Tracker (`/progress`)**: Course cards, keyboard-accessible topic checklists, debounced Firestore autosave (`500 ms`), the **99% completion rule** (reaches 100% only after pressing **Mark course complete**, with **Reopen course** undo), and a responsive **Chart.js** horizontal bar chart of top past-paper topics.
- **Resources (`/resources`)**: Two tabs (`?tab=notes` and `?tab=questions`) for Google Drive course folders, community notes with one-vote-per-student enforcement, and filterable past-paper questions.
- **Security Rules & Hosting**: Production `firestore.rules` and Firebase Hosting SPA config (`firebase.json`).

## Technology Stack
- React 18 + Vite (JavaScript)
- Tailwind CSS + shadcn/ui component architecture (`lucide-react`, `cva`, `tailwind-merge`)
- React Router v6
- Firebase Authentication & Cloud Firestore
- Chart.js (`chart.js` + `react-chartjs-2`)
- `localStorage` + `fetch()` (DummyJSON public Quote API)

## Routes (4 Main Routes)
| Route | Page | Access |
| --- | --- | --- |
| `/login` | Login & Registration | Public (redirects to `/` if signed in) |
| `/` | Home Dashboard | Protected |
| `/progress` | Progress Tracker & Chart | Protected |
| `/resources` | Notes (`?tab=notes`) & Questions (`?tab=questions`) | Protected |
| `*` | 404 Not Found | Public |

## Team Responsibilities
- **Member 1 (You)**: Foundation, Routing, Authentication, Progress Tracker (cards, checklist, autosave, 99% rule, daily count, Chart.js frequency chart), Exam Countdown, Home Dashboard, Firestore Security Rules, and Deployment.
- **Member 2**: Notes tab (`src/features/notes/`) — Drive links, note submission link, and one-vote-per-student voting.
- **Member 3**: Questions tab (`src/features/questions/`) — Past-paper questions list and filters.

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

### 4. Customize Placeholders Before Submission
- **`src/data/catalog.js`**: Replace the `PLACEHOLDER` Semester 3 courses, codes, Google Drive links, and final topics with your real syllabus data.
- **`src/features/notes/NotesTab.jsx`**: Replace `SUBMIT_NOTES_LINK` with your admin Gmail or Telegram link.
- **Firestore `exams` collection**: Add one document per course (ID: `{courseId}_final`) with fields `courseId` (string), `semester` (number `3`), `examType` (string `"final"`), and `examDate` (Timestamp).
- **Firestore Security Rules**: Copy the contents of `firestore.rules` into **Firebase Console → Firestore Database → Rules** and click **Publish**.

## Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy
```
Remember to add your deployed `.web.app` / `.firebaseapp.com` domain under **Firebase Console → Authentication → Settings → Authorized domains** if it is not already listed.

## Live URL
`PLACEHOLDER — Add your deployed Firebase Hosting URL here`

## Screenshots
`PLACEHOLDER — Add screenshots of Login, Home, Progress, and Resources pages here`
