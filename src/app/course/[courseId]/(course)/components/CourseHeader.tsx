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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Trash2, FileText } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { useGetCourse, useDeleteCourse } from "../hooks";

interface CourseHeaderProps {
  courseId: string;
}

export function CourseHeader({ courseId }: CourseHeaderProps) {
  const getCourseQuery = useGetCourse(courseId);
  const deleteCourseMutation = useDeleteCourse();
  const isLoading = getCourseQuery.isLoading;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPromptDialog, setShowPromptDialog] = useState(false);

  const handleDelete = () => {
    deleteCourseMutation.mutate(courseId);
  };

  return (
    <>
      <Header
        content={
          <div className="flex items-center justify-between w-full gap-2">
            <Link href="/home" className="md:hidden flex-shrink-0">
              <Image src="/CurioIcon.png" alt="Curio" width={200} height={200} priority className="h-7 w-7" />
            </Link>
            <Breadcrumb className="flex-1 min-w-0">
              <BreadcrumbList>
                <BreadcrumbItem>
                  {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                  ) : (
                    <BreadcrumbPage>{getCourseQuery.data?.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowPromptDialog(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Original Prompt
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Original Prompt</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">{getCourseQuery.data?.originalPrompt}</p>
          </div>
          
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course &quot;{getCourseQuery.data?.name}&quot; and all of its modules. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCourseMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteCourseMutation.isPending}
            >
              {deleteCourseMutation.isPending ? (
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
