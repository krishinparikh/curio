interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b">
      {children}
    </header>
  );
}
