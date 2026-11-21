import { useEffect, useState } from "react";
import { Quote, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Motivational verses (surah:ayah). One is picked at random and its
// English text is fetched from the AlQuran Cloud API.
const VERSE_REFS = [
  "94:5", "94:6", "2:286", "65:3", "65:2", "2:153", "2:45", "20:114",
  "53:39", "3:139", "3:159", "3:200", "13:11", "2:152", "9:120", "39:53",
  "12:87", "2:216", "29:69", "16:128", "8:46", "3:173", "2:186", "93:3",
];

// Used when the API fails or the device is offline (includes hadith).
const FALLBACK_QUOTES = [
  { text: "Indeed, with hardship comes ease.", source: "Quran 94:6" },
  { text: "Allah does not burden a soul beyond what it can bear.", source: "Quran 2:286" },
  { text: "Man will have nothing except what he strives for.", source: "Quran 53:39" },
  { text: "Actions are judged by intentions.", source: "Hadith, Bukhari & Muslim" },
  { text: "Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise.", source: "Hadith, Sahih Muslim" },
  { text: "The most beloved deeds to Allah are those done consistently, even if they are small.", source: "Hadith, Bukhari & Muslim" },
  { text: "Tie your camel, then put your trust in Allah.", source: "Hadith, Jami at-Tirmidhi" },
];

const CACHE_KEY = "dailyIslamicQuote";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function fetchRandomVerse() {
  const ref = randomItem(VERSE_REFS);
  const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ref}/en.sahih`);
  if (!res.ok) throw new Error("API error");
  const json = await res.json();
  const data = json?.data;
  if (!data?.text) throw new Error("Bad response");
  return {
    text: data.text,
    source: `Quran ${data.surah.englishName} ${data.surah.number}:${data.numberInSurah}`,
  };
}

function readCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (saved && saved.date === todayKey() && saved.quote) return saved.quote;
  } catch {
    /* ignore */
  }
  return null;
}

function writeCache(quote) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ date: todayKey(), quote }));
  } catch {
    /* ignore */
  }
}

export default function DailyQuoteCard() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadQuote(force = false) {
    if (!force) {
      const cached = readCache();
      if (cached) {
        setQuote(cached);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const fresh = await fetchRandomVerse();
      setQuote(fresh);
      writeCache(fresh);
    } catch {
      setQuote(randomItem(FALLBACK_QUOTES));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuote(false);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Quote className="h-5 w-5 text-primary" />
            Daily Reminder
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => loadQuote(true)}
            disabled={loading}
            aria-label="Show another quote"
            title="Show another quote"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>Motivation for your study day</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        {loading && !quote ? (
          <p className="text-sm text-muted-foreground">Loading quote...</p>
        ) : quote ? (
          <>
            <p className="text-base font-medium leading-relaxed text-foreground">
              “{quote.text}”
            </p>
            <p className="text-sm text-muted-foreground">— {quote.source}</p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}