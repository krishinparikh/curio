"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchInput } from "@/app/home/components/SearchInput";
import { SessionCard } from "@/app/home/components/SessionCard";
import { NavUser } from "@/app/home/components/NavUser";
import { useGetSessions } from "@/app/home/hooks";

const bgBlendPages = ["/session", "/module"];

export function AppSidebar() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const getSessionsQuery = useGetSessions(userId);
  const pathname = usePathname();

  const shouldBlendBorder = bgBlendPages.some(page => pathname?.startsWith(page));

  const [searchQuery, setSearchQuery] = useState("");

  const sessionData = useMemo(() => {
    if (!getSessionsQuery.data) return [];

    return getSessionsQuery.data.map(session => {
      const totalModules = session.modules.length;
      const modulesCompleted = session.modules.filter(m => m.isComplete).length;
      const progress = totalModules > 0 ? Math.round((modulesCompleted / totalModules) * 100) : 0;

      return {
        id: session.id,
        title: session.name,
        progress,
        modulesCompleted,
        totalModules,
      };
    });
  }, [getSessionsQuery.data]);

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessionData;

    return sessionData.filter((session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sessionData, searchQuery]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0 gap-0">
        <div className="h-14 flex items-center px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/CurioLogo.png" alt="Curio" width={600} height={200} priority className="h-8 w-auto group-data-[collapsible=icon]:hidden" />
            <Image src="/CurioIcon.png" alt="Curio" width={200} height={200} priority className="h-8 w-8 hidden group-data-[collapsible=icon]:block" />
          </Link>
        </div>
        <div className="px-4 group-data-[collapsible=icon]:hidden">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-4 group-data-[collapsible=icon]:px-0">
              {getSessionsQuery.isLoading ? (
                <p className="text-muted-foreground text-center py-8 group-data-[collapsible=icon]:hidden">Loading sessions...</p>
              ) : filteredSessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 group-data-[collapsible=icon]:hidden">
                  {searchQuery.trim() ? "No sessions found." : "No learning sessions yet. Create one to get started!"}
                </p>
              ) : (
                filteredSessions.map((session, index) => (
                  <div key={session.id}>
                    {index > 0 && <div className="border-t border-sidebar-border group-data-[collapsible=icon]:hidden" />}
                    <SessionCard
                      id={session.id}
                      title={session.title}
                      progress={session.progress}
                      modulesCompleted={session.modulesCompleted}
                      totalModules={session.totalModules}
                    />
                  </div>
                ))
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border px-4 py-2 gap-0">
        <NavUser />
      </SidebarFooter>
      <SidebarRail className={shouldBlendBorder ? "sidebar-rail-cutoff" : ""} />
    </Sidebar>
  );
}
