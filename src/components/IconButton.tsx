import { Button, ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: ReactNode;
  iconOnLeft?: boolean;
  children?: ReactNode;
}

export function IconButton({
  icon,
  iconOnLeft = false,
  variant = "default",
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn("flex items-center gap-2 py-2 h-auto", className)}
      {...props}
    >
      {iconOnLeft && icon}
      {children}
      {!iconOnLeft && icon}
    </Button>
  );
}
