interface CourseDescriptionProps {
  description: string;
}

export function CourseDescription({
  description,
}: CourseDescriptionProps) {
  return (
    <div className="rounded bg-card p-4 sm:p-8 shadow">
      <h3 className="text-xs sm:text-sm text-muted-foreground mb-2">Description</h3>
      <p className="text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  );
}
