interface DescriptionCardProps {
  heading: string;
  value: string;
}

export default function DescriptionCard({
  heading,
  value,
}: DescriptionCardProps) {
  return (
    <div className="rounded-lg bg-background p-8 shadow-sm">
      <p className="text-sm text-muted-foreground mb-2">{heading}</p>
      <p className="text-2xl font-medium">{value}</p>
    </div>
  );
}
