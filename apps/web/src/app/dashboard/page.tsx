'use client'

import { useAuth } from "@/context/authContext";
import { useEntries } from "@/context/EntriesContext";
import { getMoodEmoji } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";
import { PlusCircle, Clock, Calendar, Activity } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import MoodHeatmap from "@/components/dashboard/MoodHeatmap";
import WeeklyReviewCard from "@/components/dashboard/WeeklyReviewCard";
import AchievementsCard from "@/components/dashboard/AchievementsCard";

function calculateStreakFromEntries(entryDates: string[]): number {
    if (entryDates.length === 0) return 0;

    const unique = [...new Set(entryDates.map((d) => d.split("T")[0]))].sort((a, b) =>
        b.localeCompare(a)
    );
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (unique[0] !== today && unique[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < unique.length; i++) {
        const prev = new Date(unique[i - 1]);
        const curr = new Date(unique[i]);
        const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
        if (diffDays === 1) streak++;
        else break;
    }
    return streak;
}

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const { entries, fetchEntries, loading } = useEntries();

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const latestEntry = entries[0];
    const last7 = entries.slice(0, 7);
    const avgMood = last7.length
        ? Math.round(last7.reduce((acc, e) => acc + e.mood, 0) / last7.length)
        : null;

    const totalHours = entries
        .reduce((acc, e) => acc + e.sessionHours, 0)
        .toFixed(1);
    const weeklyEntries = entries.filter((entry) => {
        const created = new Date(entry.createdAt).getTime();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return created >= oneWeekAgo;
    });
    const weeklyMoodAvg = weeklyEntries.length
        ? weeklyEntries.reduce((acc, entry) => acc + entry.mood, 0) / weeklyEntries.length
        : null;
    const weeklyEnergyAvg = weeklyEntries.length
        ? weeklyEntries.reduce((acc, entry) => acc + entry.energy, 0) / weeklyEntries.length
        : null;
    const weeklyHours = weeklyEntries.reduce((acc, entry) => acc + entry.sessionHours, 0);
    const currentStreak = calculateStreakFromEntries(entries.map((entry) => entry.createdAt));

    return (
        <AppShell
            title={`Hey ${user?.name ?? "Developer"} ${latestEntry ? getMoodEmoji(latestEntry.mood) : "👋"}`}
            subtitle={
                entries.length === 0
                    ? "No sessions yet. Start your first log and unlock insights."
                    : `You have logged ${entries.length} session${entries.length !== 1 ? "s" : ""}. Keep the streak alive.`
            }
            onLogout={logout}
        >
            <main className="space-y-6">
                {/* Welcome Hero */}
                <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/15 via-violet-500/10 to-transparent p-6">
                    <p className="text-sm text-indigo-200/90">Today&apos;s focus</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">
                        {avgMood ? `Current momentum: ${avgMood}/10 ${getMoodEmoji(avgMood)}` : "Add one journal entry to start your trend."}
                    </h3>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-3xl p-6 group hover:border-indigo-500/30 hover:bg-gray-900/60 transition-all cursor-default">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                                <Clock size={20} />
                            </div>
                            <h3 className="text-sm font-medium text-gray-400">Total Hours Coded</h3>
                        </div>
                        <p className="text-4xl font-bold tracking-tight">
                            {loading ? '...' : `${totalHours}`}<span className="text-xl text-gray-500 font-normal ml-1">h</span>
                        </p>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-3xl p-6 group hover:border-pink-500/30 hover:bg-gray-900/60 transition-all cursor-default">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-pink-500/10 rounded-xl text-pink-400 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-sm font-medium text-gray-400">Recent Mood Avg</h3>
                        </div>
                        <p className="text-4xl font-bold tracking-tight flex items-center gap-3">
                            {loading ? '...' : avgMood ? (
                                <>
                                    {avgMood} <span className="text-2xl">{getMoodEmoji(avgMood)}</span>
                                </>
                            ) : '-'}
                        </p>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-3xl p-6 group hover:border-emerald-500/30 hover:bg-gray-900/60 transition-all cursor-default border-dashed">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                                <Calendar size={20} />
                            </div>
                            <h3 className="text-sm font-medium text-gray-400">Current Streak</h3>
                        </div>
                        <p className="text-4xl font-bold tracking-tight">
                            {currentStreak}
                            <span className="ml-1 text-xl font-normal text-gray-500">days</span>
                        </p>
                    </div>

                    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/60 rounded-3xl p-6 group hover:border-emerald-500/30 hover:bg-gray-900/60 transition-all cursor-default sm:col-span-2 xl:col-span-1 border-dashed">
                        <div className="flex flex-col h-full justify-between items-start">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                                    <Calendar size={20} />
                                </div>
                                <h3 className="text-sm font-medium text-gray-400">Ready to code?</h3>
                            </div>
                            <Link
                                href="/dashboard/journal"
                                className="w-full inline-flex items-center justify-center gap-2 bg-white text-gray-950 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/5 active:scale-[0.98]"
                            >
                                <PlusCircle size={18} />
                                Log today&apos;s session
                            </Link>
                        </div>
                    </div>
                </div>

                <MoodHeatmap entries={entries} />

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <WeeklyReviewCard
                        avgMood={weeklyMoodAvg}
                        avgEnergy={weeklyEnergyAvg}
                        totalHours={weeklyHours}
                        sessions={weeklyEntries.length}
                    />
                    <AchievementsCard
                        sessions={entries.length}
                        streak={currentStreak}
                        totalHours={Number(totalHours)}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Link
                        href="/dashboard/journal"
                        className="rounded-2xl border border-gray-800/60 bg-gray-900/35 p-5 transition-all hover:border-indigo-500/40"
                    >
                        <p className="text-sm text-gray-400">Journal</p>
                        <h4 className="mt-1 text-lg font-semibold text-white">Capture today&apos;s progress</h4>
                    </Link>
                    <Link
                        href="/dashboard/insights"
                        className="rounded-2xl border border-gray-800/60 bg-gray-900/35 p-5 transition-all hover:border-pink-500/40"
                    >
                        <p className="text-sm text-gray-400">Insights</p>
                        <h4 className="mt-1 text-lg font-semibold text-white">See trends and burnout signals</h4>
                    </Link>
                </div>
            </main>
        </AppShell>
    );
}