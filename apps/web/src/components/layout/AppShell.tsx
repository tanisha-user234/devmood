"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenText, Home, LogOut } from "lucide-react";

type AppShellProps = {
  title: string;
  subtitle: string;
  onLogout: () => void;
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/journal", label: "Journal", icon: BookOpenText },
  { href: "/dashboard/insights", label: "Insights", icon: BarChart3 },
];

export default function AppShell({ title, subtitle, onLogout, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
        <aside className="hidden w-64 shrink-0 rounded-3xl border border-gray-800/60 bg-gray-900/40 p-5 backdrop-blur-lg lg:block">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              DevMood
            </h1>
            <p className="mt-1 text-xs text-gray-400">Build. Reflect. Improve.</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/40"
                      : "text-gray-300 hover:bg-gray-800/70 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={onLogout}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900/60 px-3 py-2.5 text-sm text-gray-300 transition-colors hover:border-red-500/40 hover:text-red-300"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="mb-6 rounded-3xl border border-gray-800/60 bg-gray-900/35 p-5 backdrop-blur-lg">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
                <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
              </div>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900/70 px-3 py-2 text-sm text-gray-300 transition-colors hover:text-white lg:hidden"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
