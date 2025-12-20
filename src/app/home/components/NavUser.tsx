"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useAppSidebar } from "@/contexts/AppSidebarContext";

export function NavUser() {
  const { data: session, status: sessionStatus } = useSession();
  const { navigateAndClose } = useAppSidebar();
  const isLoading = sessionStatus === "loading";

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="!py-3">
            <Skeleton className="h-10 w-10 rounded shrink-0" />
            <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const userName = session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg" tooltip={userName} className="!py-3">
          <button onClick={() => navigateAndClose("/profile")} className="w-full">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={userName}
                width={40}
                height={40}
                className="h-10 w-10 rounded object-cover border border-sidebar-border shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded bg-sidebar-accent border border-sidebar-border flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-sidebar-foreground">
                {userName}
              </span>
              <span className="text-xs text-muted-foreground">
                Free Plan
              </span>
            </div>
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
