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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { useGetSession, useDeleteSession } from "../hooks";

interface SessionHeaderProps {
  sessionId: string;
}

export function SessionHeader({ sessionId }: SessionHeaderProps) {
  const getSessionQuery = useGetSession(sessionId);
  const deleteSessionMutation = useDeleteSession();
  const isLoading = getSessionQuery.isLoading;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    deleteSessionMutation.mutate(sessionId);
  };

  return (
    <>
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
        rightActions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the session &quot;{getSessionQuery.data?.name}&quot; and all of its modules. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-secondary hover:text-secondary-foreground" disabled={deleteSessionMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteSessionMutation.isPending}
            >
              {deleteSessionMutation.isPending ? (
                <>
                  <Spinner className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
