"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SearchInput } from "@/app/home/components/SearchInput";
import { CourseCard } from "@/app/home/components/CourseCard";
import { NavUser } from "@/app/home/components/NavUser";
import { useGetCourses } from "@/app/home/hooks";

const bgBlendPages = ["/course", "/module", "/profile"];

export function AppSidebar() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const getCoursesQuery = useGetCourses(userId);
  const pathname = usePathname();

  const shouldBlendBorder = bgBlendPages.some(page => pathname?.startsWith(page));

  const [searchQuery, setSearchQuery] = useState("");

  const courseData = useMemo(() => {
    if (!getCoursesQuery.data) return [];

    return getCoursesQuery.data.map(course => {
      const totalModules = course.modules.length;
      const modulesCompleted = course.modules.filter(m => m.isComplete).length;
      const progress = totalModules > 0 ? Math.round((modulesCompleted / totalModules) * 100) : 0;

      return {
        id: course.id,
        title: course.name,
        progress,
        modulesCompleted,
        totalModules,
      };
    });
  }, [getCoursesQuery.data]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courseData;

    return courseData.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courseData, searchQuery]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0 gap-0">
        <div className="h-14 flex items-center px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/CurioLogo.png" alt="Curio" width={600} height={200} priority className="h-7 w-auto group-data-[collapsible=icon]:hidden" />
            <Image src="/CurioIcon.png" alt="Curio" width={200} height={200} priority className="h-7 w-7 hidden group-data-[collapsible=icon]:block" />
          </Link>
        </div>
        <div className="px-4 group-data-[collapsible=icon]:hidden">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </SidebarHeader>
      <SidebarContent className="scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-4 group-data-[collapsible=icon]:px-0">
              {getCoursesQuery.isLoading ? (
                <p className="text-muted-foreground text-center py-8 group-data-[collapsible=icon]:hidden">Loading courses...</p>
              ) : filteredCourses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 group-data-[collapsible=icon]:hidden">
                  {searchQuery.trim() ? "No courses found." : "No courses yet. Create one to get started!"}
                </p>
              ) : (
                filteredCourses.map((course, index) => (
                  <div key={course.id}>
                    {index > 0 && <div className="border-t border-sidebar-border group-data-[collapsible=icon]:hidden" />}
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      progress={course.progress}
                      modulesCompleted={course.modulesCompleted}
                      totalModules={course.totalModules}
                    />
                  </div>
                ))
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border px-4 py-2 gap-0">
        <NavUser />
      </SidebarFooter>
      <SidebarRail className={shouldBlendBorder ? "sidebar-rail-cutoff" : ""} />
    </Sidebar>
  );
}
