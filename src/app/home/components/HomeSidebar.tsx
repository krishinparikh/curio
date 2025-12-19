"use client";

import { useState, useMemo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SearchInput } from "./SearchInput";
import { SessionCard } from "./SessionCard";
import { NavUser } from "./NavUser";

interface SessionData {
  id: string;
  title: string;
  progress: number;
  modulesCompleted: number;
  totalModules: number;
}

interface HomeSidebarProps {
  sessionData: SessionData[];
  isLoading: boolean;
}

export function HomeSidebar({ sessionData, isLoading }: HomeSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessionData;

    return sessionData.filter((session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sessionData, searchQuery]);

  return (
    <Sidebar>
      <SidebarHeader className="p-0">
        <div className="px-4 h-20 flex items-center">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupContent className="py-2 space-y-4 px-2">
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading sessions...</p>
            ) : filteredSessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {searchQuery.trim() ? "No sessions found." : "No learning sessions yet. Create one to get started!"}
              </p>
            ) : (
              filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  id={session.id}
                  title={session.title}
                  progress={session.progress}
                  modulesCompleted={session.modulesCompleted}
                  totalModules={session.totalModules}
                />
              ))
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-input">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
