'use client'
import EntryForm from "@/components/journal/EntryForm";
import EntryList from "@/components/journal/EntryList";
import { useAuth } from "@/context/authContext";
import AppShell from "@/components/layout/AppShell";

export default function JournalPage() {
    const { logout } = useAuth();
    return (
        <AppShell
            title="Journal"
            subtitle="Log your day in less than two minutes."
            onLogout={logout}
        >
            <main className="space-y-6">
                <div className="rounded-2xl border border-gray-800/60 bg-gray-900/30 p-4 text-sm text-gray-300">
                    Consistent logging helps unlock better insights. Add mood, energy, wins, and blockers after each coding session.
                </div>
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                    <div>
                        <EntryForm />
                    </div>
                    <div>
                        <EntryList />
                    </div>
                </div>
            </main>
        </AppShell>
    )
}