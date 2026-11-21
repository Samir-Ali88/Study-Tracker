import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Loads all Semester 3 Final exam past-paper questions from Firestore.
 */
export async function loadSemester3FinalQuestions() {
  const q = query(
    collection(db, "questions"),
    where("semester", "==", 3),
    where("examType", "==", "final")
  );
  const snapshot = await getDocs(q);

  const list = [];
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    list.push({
      id: docSnap.id,
      semester: data.semester,
      courseId: data.courseId || "",
      examType: data.examType || "final",
      year: data.year || "",
      text: data.text || "",
      topicIds: Array.isArray(data.topicIds) ? data.topicIds : [],
      solution: data.solution || "",
      isSample: Boolean(data.isSample),
    });
  });

  return list.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
}
