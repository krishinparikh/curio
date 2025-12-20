"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

interface SessionCardProps {
  id: string;
  title: string;
  progress: number;
  modulesCompleted: number;
  totalModules: number;
}

export function SessionCard({ id, title, progress, modulesCompleted, totalModules }: SessionCardProps) {
  const { setOpen } = useSidebar();

  const handleClick = () => {
    setOpen(false);
  };

  return (
    <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
      <SidebarMenuButton asChild>
        <Link href={`/session/${id}`} onClick={handleClick} className="flex flex-col items-start gap-1 h-auto py-4">
          <span className="text-base truncate w-full">{title}</span>
          <div className="w-full space-y-1">
            <Progress value={progress} className="h-1.5 bg-sidebar-border" />
            <p className="text-xs text-muted-foreground">
              {modulesCompleted}/{totalModules} modules completed
            </p>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
