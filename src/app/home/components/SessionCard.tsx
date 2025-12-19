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
    <Link href={`/session/${id}`} className="block">
      <div className="px-5 py-5 border border-input rounded-md hover:bg-secondary">

      
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-foreground truncate">{title}</h3>
          {/* <span className="text-lg font-semibold">{progress}%</span> */}
        </div>
        <Progress value={progress} className="my-2 h-2 bg-input" />
        <p className="text-xs text-muted-foreground">
          {modulesCompleted}/{totalModules} Modules Completed
        </p>
      </div>
    </Link>
  );
}
