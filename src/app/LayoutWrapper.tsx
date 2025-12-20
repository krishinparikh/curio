"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarProvider } from "@/contexts/AppSidebarContext";
import { AppSidebar } from "@/components/AppSidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show sidebar on landing page
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          {children}
        </SidebarInset>
      </AppSidebarProvider>
    </SidebarProvider>
  );
}
