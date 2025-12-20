"use client";

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function HomeHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <Header
      content={
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Menu className="h-5 w-5" />
        </Button>
      }
      className="bg-transparent border-b-0"
    />
  );
}
