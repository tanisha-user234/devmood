'use client'

import { useAuth } from "@/context/authContext";
import { insightsApi, InsightsSummary } from "@/lib/api";
import { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Clock, BatteryWarning, TrendingUp, AlertTriangle } from 'lucide-react';
import AppShell from "@/components/layout/AppShell";

export default function InsightsPage() {
    const { logout } = useAuth();
    const [summary, setSummary] = useState<InsightsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchInsights() {
            try {
                setLoading(true);
                const data = await insightsApi.getSummary();
                setSummary(data);
            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Failed to load insights');
            } finally {
                setLoading(false);
            }
        }
        fetchInsights();
    }, []);

    const colors = {
        primary: '#6366f1',
        secondary: '#ec4899',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        text: '#94a3b8',
        grid: '#334155'
    };

    return (
        <AppShell
            title="Insights Engine"
            subtitle="See your patterns and optimize your developer rhythm."
            onLogout={logout}
        >
            <main className="space-y-6">
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-28 rounded-2xl border border-gray-800/50 bg-gray-900/30 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                        {error}
                        <p className="text-xs mt-2 opacity-70">If the backend is not running, ensure the insights API is implemented.</p>
                    </div>
                ) : summary ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {summary.moodTrend.length === 0 && summary.tagStats.length === 0 ? (
                            <div className="rounded-2xl border border-gray-800/70 bg-gray-900/30 p-8">
                                <h3 className="text-lg font-semibold text-white">No insight data yet</h3>
                                <p className="text-sm text-gray-400 mt-2">Add a few journal entries and come back to view trends.</p>
                                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                                        <p className="text-sm font-medium text-white">Step 1</p>
                                        <p className="mt-1 text-xs text-gray-400">Log at least 3 coding sessions.</p>
                                    </div>
                                    <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                                        <p className="text-sm font-medium text-white">Step 2</p>
                                        <p className="mt-1 text-xs text-gray-400">Add tags like frontend, backend, bugfix.</p>
                                    </div>
                                    <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                                        <p className="text-sm font-medium text-white">Step 3</p>
                                        <p className="mt-1 text-xs text-gray-400">Track mood and energy regularly for better analysis.</p>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* High-Level Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 p-6 rounded-2xl flex items-center gap-4 group hover:border-indigo-500/30 transition-all">
                                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                                    <Flame size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Current Streak</p>
                                    <p className="text-2xl font-bold">{summary.currentStreak} Days</p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 p-6 rounded-2xl flex items-center gap-4 group hover:border-pink-500/30 transition-all">
                                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Peak Hour</p>
                                    <p className="text-2xl font-bold">{summary.peakHour?.hour || 'N/A'}</p>
                                    {summary.peakHour && <p className="text-xs text-gray-400 mt-1">Avg mood: {summary.peakHour.avgMood.toFixed(1)}</p>}
                                </div>
                            </div>

                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 p-6 rounded-2xl flex items-center gap-4 group hover:border-red-500/30 transition-all">
                                <div className="p-3 bg-red-500/10 rounded-xl text-red-400 group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Burnout Risk</p>
                                    <p className="text-2xl font-bold flex items-end gap-2">
                                        {summary.burnoutRisk.toFixed(1)} <span className="text-sm font-normal text-gray-400">/ 10</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Mood Trend */}
                            <div className="bg-gray-900/30 border border-gray-800/50 rounded-2xl p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <TrendingUp size={18} className="text-indigo-400" />
                                        Mood Trend over 30 Days
                                    </h3>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={summary.moodTrend}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke={colors.text} 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false}
                                                tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                                            />
                                            <YAxis 
                                                domain={[0, 10]} 
                                                stroke={colors.text} 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false}
                                                ticks={[2, 4, 6, 8, 10]}
                                            />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                                                itemStyle={{ color: '#fff' }}
                                                labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="avgMood" 
                                                stroke={colors.primary} 
                                                strokeWidth={3}
                                                isAnimationActive
                                                animationDuration={900}
                                                animationEasing="ease-out"
                                                dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6, fill: '#fff' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Tag Breakdown */}
                            <div className="bg-gray-900/30 border border-gray-800/50 rounded-2xl p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <BatteryWarning size={18} className="text-pink-400" />
                                        Tag Performance
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Average mood per tag</p>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={summary.tagStats} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                                            <XAxis type="number" domain={[0, 10]} stroke={colors.text} fontSize={12} />
                                            <YAxis 
                                                type="category" 
                                                dataKey="tag" 
                                                stroke={colors.text} 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                            />
                                            <Tooltip 
                                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                                            />
                                            <Bar dataKey="avgMood" radius={[0, 4, 4, 0]} maxBarSize={32} isAnimationActive animationDuration={900}>
                                                {
                                                    summary.tagStats?.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.avgMood > 6 ? colors.success : entry.avgMood > 4 ? colors.warning : colors.danger} />
                                                    ))
                                                }
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Energy by Day Heatmap / Bar */}
                            <div className="bg-gray-900/30 border border-gray-800/50 rounded-2xl p-6 lg:col-span-2">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Flame size={18} className="text-amber-500" />
                                        Average Energy by Day
                                    </h3>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={summary.energyByDay}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
                                            <XAxis 
                                                dataKey="dayOfWeek" 
                                                stroke={colors.text} 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                            />
                                            <YAxis 
                                                domain={[0, 10]} 
                                                stroke={colors.text} 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                ticks={[2, 4, 6, 8, 10]}
                                            />
                                            <Tooltip 
                                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }}
                                            />
                                            <Bar dataKey="avgEnergy" fill={colors.secondary} radius={[4, 4, 0, 0]} maxBarSize={48} isAnimationActive animationDuration={900} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
        </AppShell>
    );
}
