"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bot, Check } from "lucide-react";
import { Header } from "@/components/Header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { IconButton } from "@/components/IconButton";
import { useGetModule, useMarkModuleComplete } from "../hooks";
import { constructModuleName } from "@/lib/utils";

interface ModuleHeaderProps {
  courseId: string;
  moduleId: string;
  isPaneOpen: boolean;
  onTogglePane: () => void;
}

export function ModuleHeader({ courseId, moduleId, isPaneOpen, onTogglePane }: ModuleHeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const getModuleQuery = useGetModule(moduleId, userId);
  const isLoading = getModuleQuery.isLoading;

  // Mark module complete mutation
  const markModuleCompleteMutation = useMarkModuleComplete(userId);
  const isModuleComplete = getModuleQuery.data?.isComplete || false;

  // Handle complete button click
  const handleComplete = async () => {
    try {
      await markModuleCompleteMutation.mutateAsync(moduleId);
      // Navigate back to course page
      router.push(`/course/${courseId}`);
    } catch (error) {
      console.error("Failed to mark module as complete:", error);
    }
  };

  return (
    <Header
      className="bg-background"
      content={
        <div className="flex items-center justify-between w-full gap-1 md:gap-2">
          <Link href="/home" className="md:hidden flex-shrink-0">
            <Image src="/CurioIcon.png" alt="Curio" width={200} height={200} priority className="h-7 w-7" />
          </Link>
          <Breadcrumb className="flex-1 min-w-0 overflow-hidden">
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="hidden md:block flex-shrink-0">
                {isLoading ? (
                  <Skeleton className="h-5 w-24" />
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={`/course/${courseId}`}>{getModuleQuery.data?.course?.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbItem className="md:hidden flex-shrink-0">
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={`/course/${courseId}`}>...</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="flex-shrink-0" />
              <BreadcrumbItem className="min-w-0">
                {isLoading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  <BreadcrumbPage className="truncate">
                    {constructModuleName(getModuleQuery.data?.order || 0, getModuleQuery.data?.name || "")}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <IconButton
              icon={<Bot className="h-3.5 w-3.5 md:h-4 md:w-4" />}
              className={`${isPaneOpen ? "bg-accent hover:bg-accent" : "bg-card hover:bg-card"}`}
              iconOnLeft={true}
              variant="outline"
              onClick={onTogglePane}
              hideTextOnMobile
            >
              AI Tutor
            </IconButton>
            <IconButton
              icon={markModuleCompleteMutation.isPending ? <Spinner className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Check className="h-3.5 w-3.5 md:h-4 md:w-4" />}
              iconOnLeft={true}
              variant="default"
              onClick={handleComplete}
              disabled={markModuleCompleteMutation.isPending || isModuleComplete}
              hideTextOnMobile
            >
              Mark Complete
            </IconButton>
          </div>
        </div>
      }
    />
  );
}
