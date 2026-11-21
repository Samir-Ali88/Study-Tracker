import { useEffect, useState } from "react";
import { ExternalLink, Mail, ThumbsUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getSemester3Courses, findCourseById } from "@/data/catalog";
import { loadSemester3Notes, upvoteNote } from "./notesService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// PLACEHOLDER: Replace with your admin Gmail or Telegram link (never put a bot token here).
const SUBMIT_NOTES_LINK =
  "mailto:PLACEHOLDER_ADMIN@example.com?subject=Study%20Tracker%20Semester%203%20Note%20Submission";

export default function NotesTab() {
  const { user } = useAuth();
  const courses = getSemester3Courses();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchNotes() {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const list = await loadSemester3Notes(user.uid);
        if (!cancelled) {
          setNotes(list);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load shared notes from Firestore.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchNotes();
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleUpvote(noteId) {
    if (!user) return;
    setVotingId(noteId);
    setError("");
    try {
      await upvoteNote(noteId, user.uid);
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? { ...note, voteCount: note.voteCount + 1, hasVoted: true }
            : note
        )
      );
    } catch (err) {
      setError(err.message || "Could not record your vote.");
    } finally {
      setVotingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Course Google Drive Folders */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              Semester 3 Course Drive Folders
            </h2>
            <p className="text-sm text-muted-foreground">
              Open a course folder on Google Drive or submit your own notes for
              review.
            </p>
          </div>

          <a href={SUBMIT_NOTES_LINK} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4" />
              Submit Notes
            </Button>
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isPlaceholderLink =
              !course.driveUrl || course.driveUrl === "PLACEHOLDER";
            return (
              <Card key={course.id}>
                <CardHeader className="pb-3">
                  <Badge variant="secondary" className="w-fit">
                    {course.code}
                  </Badge>
                  <CardTitle className="mt-2 text-base">{course.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isPlaceholderLink ? (
                    <p className="text-xs text-muted-foreground">
                      Drive link not set yet (update <code>driveUrl</code> in{" "}
                      <code>src/data/catalog.js</code>).
                    </p>
                  ) : (
                    <a
                      href={course.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        Open Google Drive
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Shared Notes with One-Vote-Per-Student */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Shared Study Notes</h2>
          <p className="text-sm text-muted-foreground">
            Each student can upvote a helpful note once.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading notes...</p>
        ) : notes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No shared notes in Firestore yet. Add documents to the{" "}
              <code>notes</code> collection in Firebase to show them here.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notes.map((note) => {
              const course = findCourseById(note.courseId);
              return (
                <Card key={note.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant="secondary">
                          {course ? course.code : note.courseId || "Semester 3"}
                        </Badge>
                        <CardTitle className="mt-2 text-base">
                          {note.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Shared by {note.authorName}
                        </CardDescription>
                      </div>

                      <Button
                        variant={note.hasVoted ? "secondary" : "outline"}
                        size="sm"
                        disabled={note.hasVoted || votingId === note.id}
                        onClick={() => handleUpvote(note.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        {note.voteCount}
                      </Button>
                    </div>
                  </CardHeader>

                  {note.url && (
                    <CardContent>
                      <a
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        View note
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
