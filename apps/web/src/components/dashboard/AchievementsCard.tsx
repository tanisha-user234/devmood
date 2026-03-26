"use client";

type Achievement = {
  label: string;
  unlocked: boolean;
  hint: string;
};

type AchievementsCardProps = {
  sessions: number;
  streak: number;
  totalHours: number;
};

export default function AchievementsCard({ sessions, streak, totalHours }: AchievementsCardProps) {
  const achievements: Achievement[] = [
    {
      label: "First Commit Energy",
      unlocked: sessions >= 1,
      hint: "Log your first journal session",
    },
    {
      label: "Consistency Coder",
      unlocked: streak >= 3,
      hint: "Reach a 3-day streak",
    },
    {
      label: "Focus Finisher",
      unlocked: totalHours >= 10,
      hint: "Cross 10 hours of logged coding",
    },
    {
      label: "Momentum Builder",
      unlocked: sessions >= 10,
      hint: "Log 10 sessions",
    },
  ];

  return (
    <section className="rounded-3xl border border-gray-800/60 bg-gray-900/40 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white">Achievements</h3>
      <p className="mt-1 text-sm text-gray-400">Gamified milestones to keep you motivated.</p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {achievements.map((item) => (
          <div
            key={item.label}
            className={`rounded-xl border p-3 transition-all ${
              item.unlocked
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-gray-800 bg-gray-950/40"
            }`}
          >
            <p className={`text-sm font-medium ${item.unlocked ? "text-emerald-200" : "text-gray-300"}`}>
              {item.unlocked ? "Unlocked - " : "Locked - "}
              {item.label}
            </p>
            <p className="mt-1 text-xs text-gray-400">{item.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
