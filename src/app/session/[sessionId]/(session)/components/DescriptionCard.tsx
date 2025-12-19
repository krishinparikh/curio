interface DescriptionCardProps {
  heading: string;
  value: string;
}

export default function DescriptionCard({
  heading,
  value,
}: DescriptionCardProps) {
  return (
    <div className="rounded bg-card p-8 shadow">
      <p className="text-sm text-muted-foreground mb-1">{heading}</p>
      <p className="text-xl font-medium">{value}</p>
    </div>
  );
}
