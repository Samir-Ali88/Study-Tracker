import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getTodayCompletedCount } from "@/features/progress/progressService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DailyActivityCard() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCount() {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const todayTotal = await getTodayCompletedCount(user.uid);
        if (!cancelled) {
          setCount(todayTotal);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not read today's completed topics.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCount();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckSquare className="h-5 w-5 text-primary" />
            Today&apos;s Progress
          </CardTitle>
          <CardDescription>Topics checked off today</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Counting...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <div>
              <p className="text-3xl font-bold text-foreground">{count}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {count} {count === 1 ? "topic" : "topics"} completed today
              </p>
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter>
        <Link to="/progress" className="w-full">
          <Button variant="outline" className="w-full">
            Open Progress Tracker
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
