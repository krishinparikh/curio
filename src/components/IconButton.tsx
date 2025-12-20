import { Button, ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: ReactNode;
  iconOnLeft?: boolean;
  children?: ReactNode;
  hideTextOnMobile?: boolean;
}

export function IconButton({
  icon,
  iconOnLeft = false,
  variant = "default",
  className,
  children,
  hideTextOnMobile = false,
  ...props
}: IconButtonProps) {
  const mobileClasses = hideTextOnMobile && children
    ? "md:gap-2 md:px-4 px-2 gap-0 md:h-auto h-9 md:w-auto w-9"
    : "gap-2";

  return (
    <Button
      variant={variant}
      className={cn("flex items-center justify-center font-normal", mobileClasses, className)}
      {...props}
    >
      {iconOnLeft && icon}
      {children && (
        <span className={hideTextOnMobile ? "hidden md:inline" : ""}>
          {children}
        </span>
      )}
      {!iconOnLeft && icon}
    </Button>
  );
}
