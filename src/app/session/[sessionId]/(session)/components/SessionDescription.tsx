interface SessionDescriptionProps {
  description: string;
}

export function SessionDescription({
  description,
}: SessionDescriptionProps) {
  return (
    <div className="rounded-lg bg-background p-8 shadow-sm">
      <h3 className="text-sm text-muted-foreground mb-2">Description</h3>
      <p className="text-base leading-relaxed">{description}</p>
    </div>
  );
}
