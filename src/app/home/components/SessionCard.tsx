import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface SessionCardProps {
  id: string;
  title: string;
  progress: number;
  modulesCompleted: number;
  totalModules: number;
}

export function SessionCard({ id, title, progress, modulesCompleted, totalModules }: SessionCardProps) {
  return (
    <Link href={`/session/${id}`} className="block group">
      <div className="px-4 py-4 border border-sidebar-border rounded-lg hover:bg-sidebar-accent hover:border-sidebar-accent-foreground/20 transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground truncate">{title}</h3>
        </div>
        <Progress value={progress} className="h-1.5 mb-2 bg-sidebar-border" />
        <p className="text-xs text-muted-foreground">
          {modulesCompleted}/{totalModules} modules completed
        </p>
      </div>
    </Link>
  );
}
