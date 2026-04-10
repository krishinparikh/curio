"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";

const chatMessageVariants = cva(
  "break-words",
  {
    variants: {
      variant: {
        user: "bg-muted rounded px-4 py-3 inline-block",
        ai: "w-full",
      },
    },
    defaultVariants: {
      variant: "ai",
    },
  }
);

export interface ChatMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatMessageVariants> {
  content: string;
  role: "user" | "assistant" | "system";
}

const ChatMessage = React.memo(React.forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ className, variant, content, role, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="flex w-full justify-start min-w-0"
        {...props}
      >
        <div
          className={cn(
            chatMessageVariants({ variant: role === "user" ? "user" : "ai" }),
            "min-w-0",
            className
          )}
        >
          <Streamdown plugins={{ code, math }}>
            {content}
          </Streamdown>
        </div>
      </div>
    );
  }
));
ChatMessage.displayName = "ChatMessage";

export { ChatMessage, chatMessageVariants };
