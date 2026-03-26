"use client";

import { EntriesProvider } from "@/context/EntriesContext";
import { AuthProvider } from "@/context/authContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EntriesProvider>
        {children}
      </EntriesProvider>
    </AuthProvider>
  );
}