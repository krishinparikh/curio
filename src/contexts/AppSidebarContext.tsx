"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

interface AppSidebarContextType {
  // Re-export shadcn sidebar properties
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;

  // Custom app-specific methods
  navigateAndClose: (href: string) => void;
  closeMobileSidebar: () => void;
}

const AppSidebarContext = createContext<AppSidebarContextType | undefined>(undefined);

export function AppSidebarProvider({ children }: { children: ReactNode }) {
  const sidebar = useSidebar();
  const router = useRouter();

  const closeMobileSidebar = useCallback(() => {
    sidebar.setOpenMobile(false);
  }, [sidebar]);

  const navigateAndClose = useCallback((href: string) => {
    if (sidebar.isMobile) {
      // Close mobile sidebar first
      sidebar.setOpenMobile(false);
      // Delay navigation to allow sheet close animation to start
      setTimeout(() => {
        router.push(href);
      }, 100);
    } else {
      // Desktop: navigate immediately
      router.push(href);
    }
  }, [sidebar, router]);

  const value: AppSidebarContextType = {
    ...sidebar,
    navigateAndClose,
    closeMobileSidebar,
  };

  return (
    <AppSidebarContext.Provider value={value}>
      {children}
    </AppSidebarContext.Provider>
  );
}

export function useAppSidebar() {
  const context = useContext(AppSidebarContext);
  if (!context) {
    throw new Error("useAppSidebar must be used within AppSidebarProvider");
  }
  return context;
}
