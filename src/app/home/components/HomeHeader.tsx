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
    <div className="[&>header]:border-b-0">
      <Header
        leftAction={
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 text-secondary-foreground hover:text-foreground hover:bg-muted p-1"
          >
            <Menu className="!h-5 !w-5" />
          </Button>
        }
        mainContent={
          <Link href="/home" className="hover:opacity-80 transition-opacity">
            <Image src="/CurioLogo.png" alt="Curio" width={600} height={200} priority className="h-6 w-auto" />
          </Link>
        }
      />
    </div>
  );
}