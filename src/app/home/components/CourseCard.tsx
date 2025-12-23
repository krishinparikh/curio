"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useAppSidebar } from "@/contexts/AppSidebarContext";

interface CourseCardProps {
  id: string;
  title: string;
  progress: number;
  modulesCompleted: number;
  totalModules: number;
}

export function CourseCard({ id, title, progress, modulesCompleted, totalModules }: CourseCardProps) {
  const { isMobile, setOpen, setOpenMobile } = useAppSidebar();

  const handleClick = () => {
    if (isMobile) {
      // Mobile: close the sheet
      setOpenMobile(false);
    } else {
      // Desktop: collapse to icon mode
      setOpen(false);
    }
  };

  return (
    <Link
      href={`/course/${id}`}
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
