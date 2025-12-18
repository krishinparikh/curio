import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";

export function ModuleHeader() {
  return (
    <Header>
      <div className="pl-9">
        <Link href="/home" className="hover:opacity-80 transition-opacity">
          <Image src="/CurioLogo.png" alt="Curio" width={600} height={200} priority className="h-6 w-auto" />
        </Link>
      </div>
    </Header>
  );
}
