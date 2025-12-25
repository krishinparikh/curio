'use client'

import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/actions/courseActions";

export function useGetCourses(userId: string) {
    return useQuery({
        queryKey: ['courses', userId],
        queryFn: () => getCourses(userId),
        enabled: !!userId,
    });
}