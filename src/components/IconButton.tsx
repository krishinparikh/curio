import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  iconOnLeft?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function IconButton({
  icon,
  iconOnLeft = false,
  variant = "default",
  onClick,
  disabled = false,
  className = "",
  children,
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 ${className}`}
    >
      {iconOnLeft && icon}
      {children}
      {!iconOnLeft && icon}
    </Button>
  );
}
