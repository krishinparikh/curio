"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

export function NavUser() {
  const { data: session, status: sessionStatus } = useSession();
  const isLoading = sessionStatus === "loading";

  const identity = isLoading ? (
    <>
      <Skeleton className="h-9 w-9 rounded-lg" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </>
  ) : (
    <>
      {session?.user?.image ? (
        <Image
          src={session.user.image}
          alt={session?.user?.name ?? "User avatar"}
          width={36}
          height={36}
          className="h-9 w-9 rounded-lg object-cover border border-sidebar-border"
        />
      ) : (
        <div className="h-9 w-9 rounded-lg bg-sidebar-accent border border-sidebar-border flex items-center justify-center">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-sidebar-foreground">
          {session?.user?.name ?? session?.user?.email}
        </span>
        <span className="text-xs text-muted-foreground">
          Free Plan
        </span>
      </div>
    </>
  );

  return (
    <Link
      href="/profile"
      className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
    >
      {identity}
    </Link>
  );
}
