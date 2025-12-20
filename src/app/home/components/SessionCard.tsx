"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useSidebar } from "@/components/ui/sidebar";

interface SessionCardProps {
  id: string;
  title: string;
  progress: number;
  modulesCompleted: number;
  totalModules: number;
}

export function SessionCard({ id, title, progress, modulesCompleted, totalModules }: SessionCardProps) {
  const { setOpenMobile, isMobile } = useSidebar();

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Link
      href={`/session/${id}`}
      onClick={handleClick}
      className="flex flex-col items-start p-6 hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:hidden"
    >
      <span className="text-base mb-2 truncate w-full">{title}</span>
      <div className="w-full space-y-2">
        <Progress value={progress} className="h-1.5 bg-sidebar-border" />
        <p className="text-xs text-muted-foreground">
          {modulesCompleted}/{totalModules} modules completed
        </p>
      </div>
    </Link>
  );
}
