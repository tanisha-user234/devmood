"use client";

type WeeklyReviewCardProps = {
  avgMood: number | null;
  avgEnergy: number | null;
  totalHours: number;
  sessions: number;
};

function getFocusMessage(avgMood: number | null, avgEnergy: number | null): string {
  if (avgMood === null || avgEnergy === null) {
    return "Log 3 sessions this week to unlock personalized recommendations.";
  }
  if (avgMood >= 7 && avgEnergy >= 7) {
    return "Strong week. Keep protecting your deep-work slots and repeat this routine.";
  }
  if (avgEnergy < 5) {
    return "Energy dropped this week. Try shorter sessions and one full recovery block.";
  }
  if (avgMood < 5) {
    return "Mood looked low. Start tomorrow with a small win task and one easy PR.";
  }
  return "Solid consistency. Push one extra focused session to lift momentum.";
}

export default function WeeklyReviewCard({
  avgMood,
  avgEnergy,
  totalHours,
  sessions,
}: WeeklyReviewCardProps) {
  return (
    <section className="rounded-3xl border border-gray-800/60 bg-gray-900/40 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Weekly Review</h3>
        <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
          Auto summary
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-3">
          <p className="text-xs text-gray-500">Sessions</p>
          <p className="mt-1 text-xl font-semibold text-white">{sessions}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-3">
          <p className="text-xs text-gray-500">Hours</p>
          <p className="mt-1 text-xl font-semibold text-white">{totalHours.toFixed(1)}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-3">
          <p className="text-xs text-gray-500">Mood avg</p>
          <p className="mt-1 text-xl font-semibold text-white">{avgMood ? avgMood.toFixed(1) : "-"}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-3">
          <p className="text-xs text-gray-500">Energy avg</p>
          <p className="mt-1 text-xl font-semibold text-white">{avgEnergy ? avgEnergy.toFixed(1) : "-"}</p>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        {getFocusMessage(avgMood, avgEnergy)}
      </p>
    </section>
  );
}
