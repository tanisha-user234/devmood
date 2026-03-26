"use client";

import { Entry } from "shared";

type MoodHeatmapProps = {
  entries: Entry[];
};

function getMoodColor(mood: number) {
  if (mood >= 8) return "bg-emerald-400/90";
  if (mood >= 6) return "bg-lime-400/85";
  if (mood >= 4) return "bg-amber-400/85";
  if (mood > 0) return "bg-rose-400/85";
  return "bg-gray-800";
}

export default function MoodHeatmap({ entries }: MoodHeatmapProps) {
  const days = 35;
  const today = new Date();
  const byDate = new Map<string, { moodTotal: number; count: number }>();

  for (const entry of entries) {
    const dateKey = new Date(entry.createdAt).toISOString().split("T")[0];
    const bucket = byDate.get(dateKey) ?? { moodTotal: 0, count: 0 };
    bucket.moodTotal += entry.mood;
    bucket.count += 1;
    byDate.set(dateKey, bucket);
  }

  const grid = Array.from({ length: days }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - idx));
    const key = d.toISOString().split("T")[0];
    const stats = byDate.get(key);
    const avgMood = stats ? stats.moodTotal / stats.count : 0;
    return { key, avgMood };
  });

  return (
    <div className="rounded-3xl border border-gray-800/60 bg-gray-900/40 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Mood consistency</h3>
        <p className="text-xs text-gray-400">Last 35 days</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {grid.map((item) => (
          <div
            key={item.key}
            title={`${item.key} • Mood ${item.avgMood ? item.avgMood.toFixed(1) : "No entry"}`}
            className={`h-7 rounded-md border border-black/20 ${getMoodColor(item.avgMood)}`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <span>Low</span>
        <span className="h-3 w-3 rounded bg-rose-400/85" />
        <span className="h-3 w-3 rounded bg-amber-400/85" />
        <span className="h-3 w-3 rounded bg-lime-400/85" />
        <span className="h-3 w-3 rounded bg-emerald-400/90" />
        <span>High</span>
      </div>
    </div>
  );
}
