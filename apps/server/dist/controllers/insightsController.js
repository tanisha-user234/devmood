"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInsights = void 0;
const prisma_1 = require("../lib/prisma");
function round1(value) {
    return Math.round(value * 10) / 10;
}
function calculateStreak(dates) {
    if (dates.length === 0)
        return 0;
    const uniqueDates = [...new Set(dates.map((d) => d.split("T")[0]))].sort((a, b) => b.localeCompare(a));
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        return 0;
    }
    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
        if (diffDays === 1) {
            streak++;
        }
        else {
            break;
        }
    }
    return streak;
}
const getInsights = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const entries = await prisma_1.prisma.entry.findMany({
            where: { userId },
            include: { tags: true },
            orderBy: { createdAt: "asc" },
        });
        const last30Ms = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const moodByDate = new Map();
        const moodByHour = new Map();
        const energyByDow = new Map();
        const tagStatsMap = new Map();
        for (const entry of entries) {
            const createdAt = new Date(entry.createdAt);
            const dateKey = createdAt.toISOString().split("T")[0];
            const hour = createdAt.getHours();
            const dow = createdAt.getDay();
            if (createdAt.getTime() >= last30Ms) {
                const moodBucket = moodByDate.get(dateKey) ?? { mood: 0, count: 0 };
                moodBucket.mood += entry.mood;
                moodBucket.count += 1;
                moodByDate.set(dateKey, moodBucket);
            }
            const hourBucket = moodByHour.get(hour) ?? { mood: 0, count: 0 };
            hourBucket.mood += entry.mood;
            hourBucket.count += 1;
            moodByHour.set(hour, hourBucket);
            const dowBucket = energyByDow.get(dow) ?? { energy: 0, count: 0 };
            dowBucket.energy += entry.energy;
            dowBucket.count += 1;
            energyByDow.set(dow, dowBucket);
            for (const tag of entry.tags) {
                const key = tag.label.trim().toLowerCase();
                const tagBucket = tagStatsMap.get(key) ?? { mood: 0, count: 0 };
                tagBucket.mood += entry.mood;
                tagBucket.count += 1;
                tagStatsMap.set(key, tagBucket);
            }
        }
        const moodTrend = Array.from(moodByDate.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, { mood, count }]) => ({
            date,
            avgMood: round1(mood / count),
        }));
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const energyByDay = dayNames.map((dayOfWeek, dow) => {
            const bucket = energyByDow.get(dow);
            return {
                dayOfWeek,
                avgEnergy: bucket ? round1(bucket.energy / bucket.count) : 0,
            };
        });
        const tagStats = Array.from(tagStatsMap.entries())
            .map(([tag, { mood, count }]) => ({
            tag,
            avgMood: round1(mood / count),
            count,
        }))
            .sort((a, b) => b.avgMood - a.avgMood);
        let peakHour = null;
        for (const [hour, { mood, count }] of moodByHour.entries()) {
            const avgMood = round1(mood / count);
            if (!peakHour || avgMood > peakHour.avgMood) {
                peakHour = { hour: `${hour.toString().padStart(2, "0")}:00`, avgMood };
            }
        }
        const recentEntries = [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const recent3 = recentEntries.slice(0, 3);
        const avgRecentEnergy = recent3.length > 0 ? recent3.reduce((acc, e) => acc + e.energy, 0) / recent3.length : 0;
        const burnoutRisk = round1(Math.max(0, Math.min(10, (10 - avgRecentEnergy) * 1.2)));
        const currentStreak = calculateStreak(entries.map((e) => new Date(e.createdAt).toISOString()));
        return res.json({
            moodTrend,
            energyByDay,
            tagStats,
            peakHour,
            burnoutRisk,
            currentStreak,
        });
    }
    catch (error) {
        console.error("Insights error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.getInsights = getInsights;
