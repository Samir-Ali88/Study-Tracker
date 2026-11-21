import { Link } from "react-router-dom";
import { FilePlus2, Info, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getTimeOfDayGreeting } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ExamCountdownCard from "./ExamCountdownCard";
import DailyActivityCard from "./DailyActivityCard";
import DailyQuoteCard from "./DailyQuoteCard";

// Edit your team members' names, IDs, and roles right here
const TEAM_MEMBERS = [
  {
    name: "Imam Samir Ali",
    id: "C253011",
    role: "Home, Progress, Login & Deployment",
  },
  {
    name: "Iftekhar Uddin Bhuyian",
    id: "C253019",
    role: "Notes Module",
  },
  {
    name: "Muntasir Mahmud",
    id: "C253020",
    role: "Questions Module",
  },
];

export default function HomeDashboard() {
  const { user } = useAuth();
  const greeting = getTimeOfDayGreeting();
  const studentName = user?.displayName || "Student";

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting}, {studentName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Semester 3 · Final Exam Dashboard
          </p>
        </div>

        <Link to="/resources?tab=notes">
          <Button>
            <FilePlus2 className="h-4 w-4" />
            Quick add note
          </Button>
        </Link>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <ExamCountdownCard />
        <DailyActivityCard />
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Study Resources</CardTitle>
            <CardDescription>
              Access Semester 3 course notes and past-paper questions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link to="/resources?tab=notes">
              <Button variant="secondary" className="w-full justify-start">
                Browse Course Notes &amp; Drive Links
              </Button>
            </Link>
            <Link to="/resources?tab=questions">
              <Button variant="secondary" className="w-full justify-start">
                Explore Final Past-Paper Questions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Daily Quote */}
      <DailyQuoteCard />

      {/* About & Who Made It */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-5 w-5 text-primary" />
              About Study Tracker
            </CardTitle>
            <CardDescription>
              CSE-2340 · Software Development 1 Project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              Study Tracker helps Semester 3 students stay organized for final
              exams by tracking syllabus topic completion per course, counting
              down to the next exam, and keeping course notes and previous year
              questions in one place.
            </p>
            <p>
              Each student gets a private account powered by Firebase so
              progress stays saved across sessions and devices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Built By
            </CardTitle>
            <CardDescription>
              Team members behind Study Tracker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y rounded-md border">
              {TEAM_MEMBERS.map((member, index) => (
                <li
                  key={`${member.name}-${index}`}
                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                  {member.id && <Badge variant="secondary">{member.id}</Badge>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}