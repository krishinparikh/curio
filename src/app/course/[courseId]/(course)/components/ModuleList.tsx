import { ModuleCard } from './ModuleCard';

interface Module {
  id: string;
  name: string;
  overview: string;
  order: number;
  isComplete: boolean;
}

interface ModuleListProps {
  courseId: string;
  modules: Module[];
}

export function ModuleList({ courseId, modules }: ModuleListProps) {
  return (
    <div className="rounded bg-card p-4 shadow">
      {/* <h3 className="text-sm text-muted-foreground mb-2">Modules</h3> */}
      <div>
        {modules.map((module, index) => (
          <div key={module.id}>
            <ModuleCard
              courseId={courseId}
              moduleId={module.id}
              moduleName={module.name}
              moduleOverview={module.overview}
              moduleOrder={module.order}
              isComplete={module.isComplete}
            />
            {index < modules.length - 1 && (
              <div className="border-b border-border" />
            )}
          </div>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No modules available for this course.</p>
        </div>
      )}
    </div>
  );
}
