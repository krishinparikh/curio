'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getCourses, createCourse, CreateCourseInput } from "@/lib/actions/courseActions";

export function useGetCourses(userId: string) {
    return useQuery({
        queryKey: ['courses', userId],
        queryFn: () => getCourses(userId),
        enabled: !!userId,
    });
}

export function useCreateCourse() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (input: CreateCourseInput) => createCourse(input),
        onSuccess: (data, variables) => {
            // Invalidate courses query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['courses', variables.userId] });

            // Navigate to the new course page
            router.push(`/course/${data.id}`);
        },
    });
}