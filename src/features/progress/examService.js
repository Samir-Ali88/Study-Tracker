// Exam date is set in code (no Firestore needed).
// Format: new Date(year, monthIndex, day, hour, minute)
// monthIndex starts at 0, so December = 11.
const FINAL_EXAM_DATE = new Date(2026, 11, 19, 10, 0, 0); // Dec 19, 2026, 10:00 AM

export async function getNextExam() {
  if (FINAL_EXAM_DATE <= new Date()) return null;

  return {
    courseId: "sem3-final",
    courseName: "Semester 3 Final Exam",
    semester: 3,
    examType: "final",
    examDate: FINAL_EXAM_DATE,
  };
}

export function getTimeLeft(date) {
  if (!date) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const diffMs = date.getTime() - Date.now();
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isOver: false };
}