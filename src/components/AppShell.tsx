"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/components/BottomNav";

// Admin is a facilitator surface with no participant navigation.
export function showBottomNav(pathname: string) {
  return !pathname.startsWith("/admin");
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const withNav = showBottomNav(pathname);

  return (
    <>
      <div className={withNav ? "has-bottom-nav" : undefined} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
      {withNav && <BottomNav />}
    </>
  );
}
