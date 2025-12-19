interface SessionTitleSectionProps {
  sessionName: string;
  completedModules: number;
  totalModules: number;
}

export function SessionTitleSection({
  sessionName,
  completedModules,
  totalModules,
}: SessionTitleSectionProps) {
  const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="mb-4 rounded bg-card p-8 shadow">
      {/* Header with Title */}
      <h1 className="text-3xl font-medium mb-4">{sessionName}</h1>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{completedModules} of {totalModules} modules completed</span>
        </div>
        <div className="h-3 bg-input rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
