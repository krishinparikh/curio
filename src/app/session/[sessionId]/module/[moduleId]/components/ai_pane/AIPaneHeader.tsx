"use client";

import { X } from "lucide-react";
import { Header } from "@/components/Header";
import { IconButton } from "@/components/IconButton";

interface AIPaneHeaderProps {
  onClose: () => void;
}

export function AIPaneHeader({ onClose }: AIPaneHeaderProps) {
  return (
    <Header
      className="bg-background md:hidden"
      content={
        <div className="flex items-center justify-between w-full gap-1">
          <h1 className="text-sm font-normal">AI Tutor</h1>
          <IconButton
            icon={<X className="h-4 w-4" />}
            variant="ghost"
            onClick={onClose}
            className="h-9 w-9"
          />
        </div>
      }
    />
  );
}
