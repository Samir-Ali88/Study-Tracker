import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { db } from "@/lib/firebase";
import { findTopicTitle } from "@/data/catalog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function TopicFrequencyChart({ course }) {
  const [chartEntries, setChartEntries] = useState([]);
  const [hasSampleData, setHasSampleData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTopicCounts() {
      setLoading(true);
      setError("");

      try {
        const q = query(
          collection(db, "questions"),
          where("courseId", "==", course.id),
          where("examType", "==", "final")
        );
        const snapshot = await getDocs(q);

        const counts = {};
        let foundSample = false;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.isSample) {
            foundSample = true;
          }
          if (Array.isArray(data.topicIds)) {
            for (const topicId of data.topicIds) {
              counts[topicId] = (counts[topicId] || 0) + 1;
            }
          }
        });

        const sortedTop8 = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([topicId, count]) => ({
            topicId,
            label: findTopicTitle(course.id, topicId),
            count,
          }));

        if (!cancelled) {
          setChartEntries(sortedTop8);
          setHasSampleData(foundSample);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Could not load past-paper data right now.");
          setChartEntries([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTopicCounts();
    return () => {
      cancelled = true;
    };
  }, [course.id]);

  const data = {
    labels: chartEntries.map((item) => item.label),
    datasets: [
      {
        label: "Questions",
        data: chartEntries.map((item) => item.count),
        backgroundColor: "rgba(34, 129, 118, 0.85)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.x} past-paper question(s)`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Past-Paper Topic Frequency (Top 8)
        </CardTitle>
        <CardDescription>
          Topics appearing most often in Semester 3 Final questions for{" "}
          {course.code}.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading chart data...</p>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : chartEntries.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No past-paper data yet
          </div>
        ) : (
          <div>
            <div
              className="w-full"
              style={{ height: `${Math.max(200, chartEntries.length * 42)}px` }}
            >
              <Bar data={data} options={options} />
            </div>
            {hasSampleData && (
              <p className="mt-3 text-xs font-medium text-amber-700">
                Sample data
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
