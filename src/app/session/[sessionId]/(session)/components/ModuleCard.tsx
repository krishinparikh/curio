import Link from 'next/link';
import { constructModuleName } from '@/lib/utils';

interface ModuleCardProps {
  sessionId: string;
  moduleId: string;
  moduleName: string;
  moduleOverview: string;
  moduleOrder: number;
  isComplete: boolean;
}

export function ModuleCard({
  sessionId,
  moduleId,
  moduleName,
  moduleOverview,
  moduleOrder
}: ModuleCardProps) {
  return (
    <Link href={`/session/${sessionId}/module/${moduleId}`}>
      <div className="group relative p-4 hover:bg-accent transition-colors cursor-pointer">
        <h3 className="font-medium text-base group-hover:text-accent-foreground transition-colors mb-2">
          {constructModuleName(moduleOrder, moduleName)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {moduleOverview}
        </p>
      </div>
    </Link>
  );
}
