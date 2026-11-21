import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, BookOpen, Mail, MessageSquare } from "lucide-react";

// Replace these with your real contact email or community link when ready
const SUPPORT_EMAIL = "mailto:support@studytracker.app";
const FEEDBACK_EMAIL =
  "mailto:support@studytracker.app?subject=Study%20Tracker%20Feedback";

const WORKSPACE_LINKS = [
  { label: "Dashboard", to: "/" },
  { label: "Progress Tracker", to: "/progress" },
  { label: "Course Notes", to: "/resources?tab=notes" },
  { label: "Past Questions", to: "/resources?tab=questions" },
];

export default function Footer() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
        {/* Top Multi-Column Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Mission (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Study Tracker
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              A focused academic workspace designed to help students track
              syllabus mastery, prepare for exams on schedule, and keep study
              resources organized in one place.
            </p>

            {/* Live Cloud Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                {isOnline && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    isOnline ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
              </span>
              <span className={isOnline ? "text-slate-200" : "text-amber-300"}>
                {isOnline ? "All systems operational" : "Offline — local view"}
              </span>
            </div>
          </div>

          {/* Workspace Links (3 cols) */}
          <div className="space-y-4 lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Workspace
            </h2>
            <ul className="space-y-2.5 text-sm">
              {WORKSPACE_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-slate-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Connect (4 cols) */}
          <div className="space-y-4 lg:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Support &amp; Contribution
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Have organized notes, past papers, or ideas to make Study Tracker
              better? Reach out directly.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href={SUPPORT_EMAIL}
                className="inline-flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-primary" />
                Contact Support
              </a>
              <a
                href={FEEDBACK_EMAIL}
                className="inline-flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              >
                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                Send Feedback
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Utility Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
            <p className="text-slate-400">
              &copy; {currentYear} Study Tracker. All rights reserved.
            </p>
            <span aria-hidden="true" className="hidden sm:inline">
              &middot;
            </span>
            <span>Private cloud-synced student accounts</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}