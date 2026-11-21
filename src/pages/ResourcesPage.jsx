import { useSearchParams } from "react-router-dom";
import NotesTab from "@/features/notes/NotesTab";
import QuestionsTab from "@/features/questions/QuestionsTab";
import { Button } from "@/components/ui/button";

export default function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab =
    searchParams.get("tab") === "questions" ? "questions" : "notes";

  function switchTab(tab) {
    setSearchParams({ tab });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Study Resources
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Semester 3 · Final Exam Notes &amp; Past-Paper Questions
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Resource tabs"
          className="inline-flex rounded-lg bg-secondary p-1"
        >
          <Button
            role="tab"
            aria-selected={activeTab === "notes"}
            size="sm"
            variant={activeTab === "notes" ? "default" : "ghost"}
            onClick={() => switchTab("notes")}
          >
            Notes
          </Button>
          <Button
            role="tab"
            aria-selected={activeTab === "questions"}
            size="sm"
            variant={activeTab === "questions" ? "default" : "ghost"}
            onClick={() => switchTab("questions")}
          >
            Questions
          </Button>
        </div>
      </div>

      {activeTab === "notes" ? <NotesTab /> : <QuestionsTab />}
    </div>
  );
}
