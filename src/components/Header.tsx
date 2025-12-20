interface HeaderProps {
  content: React.ReactNode;
  className?: string;
}

export function Header({ content, className }: HeaderProps) {
  return (
    <header className={`h-14 px-4 bg-card border-b border-border flex items-center ${className || ''}`}>
      {content}
    </header>
  );
}
