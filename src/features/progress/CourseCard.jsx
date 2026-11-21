import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculatePercent } from "./progressUtils";
import { cn } from "@/lib/utils";

export default function CourseCard({
  course,
  completedCount,
  markedComplete,
  isSelected,
  onSelect,
}) {
  const totalTopics = course.finalTopics.length;
  const percent = calculatePercent(completedCount, totalTopics, markedComplete);

  return (
    <button
      type="button"
      onClick={() => onSelect(course.id)}
      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      aria-pressed={isSelected}
    >
      <Card
        className={cn(
          "h-full transition-all hover:border-primary/60",
          isSelected && "border-primary ring-2 ring-primary/25 bg-accent/20"
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{course.code}</Badge>
            {markedComplete && (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Complete
              </Badge>
            )}
          </div>
          <CardTitle className="mt-2 text-base">{course.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {completedCount} of {totalTopics} topics
            </span>
            <span className="font-semibold text-foreground">{percent}%</span>
          </div>
          <Progress value={percent} />
        </CardContent>
      </Card>
    </button>
  );
}
