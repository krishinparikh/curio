interface SessionDescriptionProps {
  description: string;
}

export function SessionDescription({
  description,
}: SessionDescriptionProps) {
  return (
    <div className="rounded bg-card p-8 shadow">
      <h3 className="text-sm text-muted-foreground mb-2">Description</h3>
      <p className="text-base leading-relaxed">{description}</p>
    </div>
  );
}
