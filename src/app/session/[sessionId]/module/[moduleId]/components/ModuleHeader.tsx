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

interface ModuleHeaderProps {
  sessionId: string;
  moduleId: string;
  isPaneOpen: boolean;
  onTogglePane: () => void;
}

export function ModuleHeader({ sessionId, moduleId, isPaneOpen, onTogglePane }: ModuleHeaderProps) {
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
      // Navigate back to session page
      router.push(`/session/${sessionId}`);
    } catch (error) {
      console.error("Failed to mark module as complete:", error);
    }
  };

  return (
    <Header
      className="bg-background shadow-sm"
      mainContent={
        <>
          <Link href="/home" className="hover:opacity-80 transition-opacity">
            <Image src="/CurioIcon.png" alt="Curio" width={32} height={32} className="h-6 w-6" />
          </Link>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                {isLoading ? (
                  <Skeleton className="h-5 w-24" />
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={`/session/${sessionId}`}>{getModuleQuery.data?.learningSession?.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLoading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  <BreadcrumbPage>{getModuleQuery.data?.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      }
      rightActions={
        <>
          <IconButton
            icon={<Bot className="h-4 w-4" />}
            iconOnLeft={true}
            variant="outline"
            onClick={onTogglePane}
          >
            AI Tutor
          </IconButton>
          <IconButton
            icon={markModuleCompleteMutation.isPending ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            iconOnLeft={true}
            variant="default"
            onClick={handleComplete}
            disabled={markModuleCompleteMutation.isPending || isModuleComplete}
          >
            Mark Complete
          </IconButton>
        </>
      }
    />
  );
}
