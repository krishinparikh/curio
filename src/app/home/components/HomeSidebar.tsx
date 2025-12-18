"use client";

import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
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
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-4">
          <Image
            src="/CurioLogo.png"
            alt="Curio"
            width={600}
            height={200}
            priority
            className="h-6 w-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="space-y-4 px-2">
              {isLoading ? (
                <p className="text-muted-foreground text-center py-8">Loading sessions...</p>
              ) : sessionData.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No learning sessions yet. Create one to get started!
                </p>
              ) : (
                sessionData.map((session) => (
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
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
