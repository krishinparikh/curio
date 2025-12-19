"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSession } from "../hooks";

interface SessionHeaderProps {
  sessionId: string;
}

export function SessionHeader({ sessionId }: SessionHeaderProps) {
  const getSessionQuery = useGetSession(sessionId);
  const isLoading = getSessionQuery.isLoading;

  return (
    <Header
      mainContent={
        <>
          <Link href="/home" className="hover:opacity-80 transition-opacity">
            <Image src="/CurioIcon.png" alt="Curio" width={32} height={32} className="h-6 w-6" />
          </Link>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                {isLoading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  <BreadcrumbPage>{getSessionQuery.data?.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      }
    />
  );
}
