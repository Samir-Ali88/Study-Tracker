import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { todayKey } from "@/lib/dates";

/**
 * Returns the Firestore document ID for a course's final-exam progress.
 */
function progressDocId(courseId) {
  return `${courseId}_final`;
}

/**
 * Loads saved progress for ONE course for the given student.
 */
export async function loadProgress(uid, courseId) {
  const ref = doc(db, "users", uid, "progress", progressDocId(courseId));
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      courseId,
      examType: "final",
      completedTopicIds: [],
      completedOn: {},
      markedComplete: false,
    };
  }

  const data = snap.data();
  return {
    courseId: data.courseId || courseId,
    examType: data.examType || "final",
    completedTopicIds: Array.isArray(data.completedTopicIds)
      ? data.completedTopicIds
      : [],
    completedOn:
      data.completedOn && typeof data.completedOn === "object"
        ? data.completedOn
        : {},
    markedComplete: Boolean(data.markedComplete),
  };
}

/**
 * Loads all saved Semester 3 final progress documents for the given student.
 * Returns a map keyed by courseId: { [courseId]: progressObject }.
 */
export async function loadAllProgress(uid) {
  const colRef = collection(db, "users", uid, "progress");
  const snapshot = await getDocs(colRef);
  const byCourse = {};

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.courseId && (data.examType || "final") === "final") {
      byCourse[data.courseId] = {
        courseId: data.courseId,
        examType: data.examType || "final",
        completedTopicIds: Array.isArray(data.completedTopicIds)
          ? data.completedTopicIds
          : [],
        completedOn:
          data.completedOn && typeof data.completedOn === "object"
            ? data.completedOn
            : {},
        markedComplete: Boolean(data.markedComplete),
      };
    }
  });

  return byCourse;
}

/**
 * Saves progress for a course to users/{uid}/progress/{courseId}_final.
 * Uses setDoc with mergeFields so unticked keys removed from completedOn
 * are cleanly removed in Firestore while keeping any unrelated fields safe.
 */
export async function saveProgress(uid, courseId, data) {
  const ref = doc(db, "users", uid, "progress", progressDocId(courseId));

  const payload = {
    courseId,
    examType: "final",
    completedTopicIds: Array.isArray(data.completedTopicIds)
      ? data.completedTopicIds
      : [],
    completedOn:
      data.completedOn && typeof data.completedOn === "object"
        ? data.completedOn
        : {},
    markedComplete: Boolean(data.markedComplete),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, payload, {
    mergeFields: [
      "courseId",
      "examType",
      "completedTopicIds",
      "completedOn",
      "markedComplete",
      "updatedAt",
    ],
  });
}

/**
 * Reads all documents in users/{uid}/progress and counts how many topics
 * were completed on today's local date (YYYY-MM-DD).
 */
export async function getTodayCompletedCount(uid) {
  const today = todayKey();
  const colRef = collection(db, "users", uid, "progress");
  const snapshot = await getDocs(colRef);

  let count = 0;
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const completedOn = data.completedOn;
    if (completedOn && typeof completedOn === "object") {
      for (const dateString of Object.values(completedOn)) {
        if (dateString === today) {
          count += 1;
        }
      }
    }
  });

  return count;
}
