"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function HomeHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <Header>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted p-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Link href="/home" className="hover:opacity-80 transition-opacity">
          <Image src="/CurioLogo.png" alt="Curio" width={600} height={200} priority className="h-6 w-auto" />
        </Link>
      </div>
    </Header>
  );
}