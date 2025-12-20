interface DescriptionCardProps {
  heading: string;
  value: string;
}

export default function DescriptionCard({
  heading,
  value,
}: DescriptionCardProps) {
  return (
    <div className="rounded bg-card p-4 sm:p-6 shadow">
      <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{heading}</p>
      <p className="text-sm sm:text-xl font-medium truncate">{value}</p>
    </div>
  );
}
