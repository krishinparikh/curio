interface HeaderProps {
  leftAction?: React.ReactNode;
  mainContent: React.ReactNode;
  rightActions?: React.ReactNode;
}

export function Header({ leftAction, mainContent, rightActions }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="grid grid-cols-[2.5rem_1fr_auto] items-center h-14 px-4">
        {/* Left: Fixed width for toggle button or spacer */}
        <div className="flex items-center justify-start">
          {leftAction}
        </div>

        {/* Center: Main content (logo + breadcrumbs) */}
        <div className="flex items-center gap-3 min-w-0">
          {mainContent}
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          {rightActions}
        </div>
      </div>
    </header>
  );
}
