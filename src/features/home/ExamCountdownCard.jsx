import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNextExam, getTimeLeft } from "@/features/progress/examService";

export default function ExamCountdownCard() {
  const [nextExam, setNextExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadExam() {
      setLoading(true);
      setError("");
      try {
        const upcoming = await getNextExam();
        if (!cancelled) {
          setNextExam(upcoming);
          setTimeLeft(upcoming ? getTimeLeft(upcoming.examDate) : null);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load exam schedule.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExam();
    return () => {
      cancelled = true;
    };
  }, []);

  // Update the countdown every second and clean up when leaving the page
  useEffect(() => {
    if (!nextExam) return;

    const intervalId = setInterval(() => {
      const updated = getTimeLeft(nextExam.examDate);
      if (updated.isOver) {
        // Never display an exam that is already over
        setNextExam(null);
        setTimeLeft(null);
        clearInterval(intervalId);
      } else {
        setTimeLeft(updated);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nextExam]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarClock className="h-5 w-5 text-primary" />
            Next Exam Countdown
          </CardTitle>
          {nextExam && <Badge>Final</Badge>}
        </div>
        <CardDescription>
          Nearest upcoming Semester 3 final exam
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Checking exam dates...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : !nextExam || !timeLeft ? (
          <p className="text-sm font-medium text-muted-foreground">
            No upcoming exam
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-foreground">
                {nextExam.courseName}
              </p>
              <p className="text-xs text-muted-foreground">
                {nextExam.examDate.toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="rounded-md bg-secondary p-2">
                <div className="text-xl font-bold text-foreground">
                  {timeLeft.days}
                </div>
                <div className="text-[11px] text-muted-foreground">Days</div>
              </div>
              <div className="rounded-md bg-secondary p-2">
                <div className="text-xl font-bold text-foreground">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-[11px] text-muted-foreground">Hours</div>
              </div>
              <div className="rounded-md bg-secondary p-2">
                <div className="text-xl font-bold text-foreground">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-[11px] text-muted-foreground">Mins</div>
              </div>
              <div className="rounded-md bg-secondary p-2">
                <div className="text-xl font-bold text-foreground">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[11px] text-muted-foreground">Secs</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
