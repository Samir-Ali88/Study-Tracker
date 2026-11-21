import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Loads all Semester 3 notes from Firestore and checks which ones
 * the signed-in student has already upvoted.
 */
export async function loadSemester3Notes(uid) {
  const q = query(collection(db, "notes"), where("semester", "==", 3));
  const snapshot = await getDocs(q);

  const notes = [];
  for (const noteSnap of snapshot.docs) {
    const data = noteSnap.data();
    const votesSnap = await getDocs(
      collection(db, "notes", noteSnap.id, "votes")
    );
    const hasVoted = votesSnap.docs.some((v) => v.id === uid);

    notes.push({
      id: noteSnap.id,
      courseId: data.courseId || "",
      title: data.title || "Untitled Note",
      url: data.url || "",
      authorName: data.authorName || "Shared Note",
      voteCount: Number(data.voteCount) || 0,
      hasVoted,
    });
  }

  return notes.sort((a, b) => b.voteCount - a.voteCount);
}

/**
 * Casts ONE vote for a note per student.
 * Runs inside a Firestore transaction so voteCount increases by exactly 1
 * at the exact same moment notes/{noteId}/votes/{uid} is created (matching firestore.rules).
 */
export async function upvoteNote(noteId, uid) {
  const noteRef = doc(db, "notes", noteId);
  const voteRef = doc(db, "notes", noteId, "votes", uid);

  await runTransaction(db, async (transaction) => {
    const voteSnap = await transaction.get(voteRef);
    if (voteSnap.exists()) {
      throw new Error("You have already voted for this note.");
    }

    const noteSnap = await transaction.get(noteRef);
    if (!noteSnap.exists()) {
      throw new Error("Note not found.");
    }

    const currentVotes = Number(noteSnap.data().voteCount) || 0;
    transaction.set(voteRef, { createdAt: serverTimestamp() });
    transaction.update(noteRef, { voteCount: currentVotes + 1 });
  });
}
