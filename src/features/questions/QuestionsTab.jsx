import { ExternalLink, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Add or edit your courses and previous-year question Google Drive links right here.
// This ONLY affects the Questions tab — nothing else in the app is changed.
const COURSE_QUESTIONS = [
  {
    code: "COURSE-101",
    name: "Course 1 Name",
    driveUrl: "PLACEHOLDER",
  },
  {
    code: "COURSE-102",
    name: "Course 2 Name",
    driveUrl: "PLACEHOLDER",
  },
  {
    code: "COURSE-103",
    name: "Course 3 Name",
    driveUrl: "PLACEHOLDER",
  },
];

export default function QuestionsTab() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Previous Year Questions</h2>
        <p className="text-sm text-muted-foreground">
          Open the Google Drive file for each course to view past exam
          questions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSE_QUESTIONS.map((course, index) => {
          const isPlaceholder =
            !course.driveUrl || course.driveUrl === "PLACEHOLDER";

          return (
            <Card
              key={`${course.code}-${index}`}
              className="flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{course.code}</Badge>
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="mt-2 text-base">{course.name}</CardTitle>
                <CardDescription>Previous year questions</CardDescription>
              </CardHeader>

              <CardContent>
                {isPlaceholder ? (
                  <p className="text-xs text-muted-foreground">
                    Paste your Google Drive link in <code>COURSE_QUESTIONS</code>{" "}
                    inside <code>src/features/questions/QuestionsTab.jsx</code>.
                  </p>
                ) : (
                  <a
                    href={course.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Open Past Questions
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}