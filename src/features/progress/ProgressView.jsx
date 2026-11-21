import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSemester3Courses } from "@/data/catalog";
import { todayKey } from "@/lib/dates";
import { loadAllProgress, saveProgress } from "./progressService";
import CourseCard from "./CourseCard";
import TopicChecklist from "./TopicChecklist";
import TopicFrequencyChart from "./TopicFrequencyChart";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const EMPTY_PROGRESS = {
  completedTopicIds: [],
  completedOn: {},
  markedComplete: false,
};

export default function ProgressView() {
  const { user } = useAuth();
  const courses = getSemester3Courses();

  const [selectedCourseId, setSelectedCourseId] = useState(
    courses[0]?.id || null
  );
  const [progressByCourse, setProgressByCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");

  // Keeps one debounce timer per course so rapid clicks don't spam Firestore
  const timersRef = useRef({});

  useEffect(() => {
    let cancelled = false;

    async function fetchSavedProgress() {
      if (!user) return;
      setLoading(true);
      setError("");

      try {
        const saved = await loadAllProgress(user.uid);
        if (!cancelled) {
          setProgressByCourse(saved);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "Could not load your saved progress from Firestore. Check your connection and Firestore rules."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSavedProgress();

    return () => {
      cancelled = true;
      Object.values(timersRef.current).forEach((timerId) =>
        clearTimeout(timerId)
      );
    };
  }, [user]);

  function scheduleSave(courseId, nextProgress, immediate = false) {
    if (!user) return;

    if (timersRef.current[courseId]) {
      clearTimeout(timersRef.current[courseId]);
    }

    setSaveStatus("saving");
    setError("");

    const persist = async () => {
      try {
        await saveProgress(user.uid, courseId, nextProgress);
        setSaveStatus("saved");
      } catch (err) {
        setSaveStatus("idle");
        setError("Failed to save progress to Firestore. Please try again.");
      }
    };

    if (immediate) {
      persist();
    } else {
      timersRef.current[courseId] = setTimeout(persist, 500);
    }
  }

  function handleToggleTopic(topicId) {
    if (!selectedCourseId) return;

    const current = progressByCourse[selectedCourseId] || EMPTY_PROGRESS;
    const alreadyTicked = current.completedTopicIds.includes(topicId);

    let nextCompletedIds;
    const nextCompletedOn = { ...current.completedOn };
    let nextMarkedComplete = current.markedComplete;

    if (alreadyTicked) {
      nextCompletedIds = current.completedTopicIds.filter(
        (id) => id !== topicId
      );
      delete nextCompletedOn[topicId];
      // If a topic is unticked, the course is no longer 100% complete
      nextMarkedComplete = false;
    } else {
      nextCompletedIds = [...current.completedTopicIds, topicId];
      nextCompletedOn[topicId] = todayKey();
    }

    const nextProgress = {
      courseId: selectedCourseId,
      examType: "final",
      completedTopicIds: nextCompletedIds,
      completedOn: nextCompletedOn,
      markedComplete: nextMarkedComplete,
    };

    setProgressByCourse((prev) => ({
      ...prev,
      [selectedCourseId]: nextProgress,
    }));

    scheduleSave(selectedCourseId, nextProgress, false);
  }

  function handleSetMarkedComplete(value) {
    if (!selectedCourseId) return;

    const current = progressByCourse[selectedCourseId] || EMPTY_PROGRESS;
    const nextProgress = {
      courseId: selectedCourseId,
      examType: "final",
      completedTopicIds: current.completedTopicIds,
      completedOn: current.completedOn,
      markedComplete: value,
    };

    setProgressByCourse((prev) => ({
      ...prev,
      [selectedCourseId]: nextProgress,
    }));

    scheduleSave(selectedCourseId, nextProgress, true);
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Semester 3 · Final exam
        </h1>
        <div className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          No courses found in <code>src/data/catalog.js</code>. Add your
          Semester 3 courses to start tracking progress.
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading your Semester 3 progress..." />;
  }

  const selectedCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];
  const selectedProgress =
    progressByCourse[selectedCourse.id] || EMPTY_PROGRESS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Semester 3 · Final exam
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a course to check off topics. Your progress saves automatically
          to your account.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Course cards grid */}
      <section aria-label="Semester 3 courses">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const prog = progressByCourse[course.id] || EMPTY_PROGRESS;
            return (
              <CourseCard
                key={course.id}
                course={course}
                completedCount={prog.completedTopicIds.length}
                markedComplete={prog.markedComplete}
                isSelected={course.id === selectedCourse.id}
                onSelect={(id) => {
                  setSelectedCourseId(id);
                  setSaveStatus("idle");
                }}
              />
            );
          })}
        </div>
      </section>

      {/* Checklist + Past-Paper Frequency Chart */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopicChecklist
            course={selectedCourse}
            completedTopicIds={selectedProgress.completedTopicIds}
            markedComplete={selectedProgress.markedComplete}
            saveStatus={saveStatus}
            onToggleTopic={handleToggleTopic}
            onMarkComplete={() => handleSetMarkedComplete(true)}
            onReopenCourse={() => handleSetMarkedComplete(false)}
          />
        </div>

        <div className="lg:col-span-1">
          <TopicFrequencyChart course={selectedCourse} />
        </div>
      </section>
    </div>
  );
}
