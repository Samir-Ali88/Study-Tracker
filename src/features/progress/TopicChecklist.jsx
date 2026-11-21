import { CheckCircle2, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculatePercent } from "./progressUtils";

export default function TopicChecklist({
  course,
  completedTopicIds,
  markedComplete,
  saveStatus,
  onToggleTopic,
  onMarkComplete,
  onReopenCourse,
}) {
  const totalTopics = course.finalTopics.length;
  const completedCount = completedTopicIds.length;
  const percent = calculatePercent(completedCount, totalTopics, markedComplete);
  const allTopicsTicked = totalTopics > 0 && completedCount === totalTopics;

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {course.code} · Final Exam Topics
            </p>
            <CardTitle className="mt-1">{course.name}</CardTitle>
            <CardDescription className="mt-1">
              {completedCount} of {totalTopics} topics completed ({percent}%)
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus === "saving" && (
              <span className="text-xs text-muted-foreground">Saving...</span>
            )}
            {saveStatus === "saved" && (
              <span className="text-xs text-emerald-700">Saved</span>
            )}
            {markedComplete ? (
              <Button variant="outline" size="sm" onClick={onReopenCourse}>
                <RotateCcw className="h-4 w-4" />
                Reopen course
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onMarkComplete}
                disabled={totalTopics === 0}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark course complete
              </Button>
            )}
          </div>
        </div>

        <Progress value={percent} />

        {allTopicsTicked && !markedComplete && (
          <div
            role="status"
            className="rounded-md border border-primary/30 bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
          >
            All topics done! Press Mark course complete to finish.
          </div>
        )}
      </CardHeader>

      <CardContent>
        {totalTopics === 0 ? (
          <p className="text-sm text-muted-foreground">
            No final topics listed for this course yet.
          </p>
        ) : (
          <ul className="divide-y rounded-md border">
            {course.finalTopics.map((topic) => {
              const checked = completedTopicIds.includes(topic.id);
              const checkboxId = `topic-${topic.id}`;

              return (
                <li key={topic.id}>
                  <label
                    htmlFor={checkboxId}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/50"
                  >
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleTopic(topic.id)}
                      className="h-4 w-4 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <span
                      className={
                        checked
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }
                    >
                      {topic.title}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
