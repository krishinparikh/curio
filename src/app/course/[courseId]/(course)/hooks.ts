'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getCourseById, deleteCourse } from "@/lib/actions/courseActions";

export function useGetCourse(courseId: string) {
    const { data: session } = useSession();
    const userId = session?.user?.id || "";

    return useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId, userId),
        enabled: !!courseId && !!userId,
    });
}

export function useDeleteCourse() {
    const { data: session } = useSession();
    const userId = session?.user?.id || "";
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => deleteCourse(courseId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            router.push('/home');
        },
    });
}
