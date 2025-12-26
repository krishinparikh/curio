"use client";

import { use, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CourseTitleSection } from './components/CourseTitleSection';
import { CourseDescription } from './components/CourseDescription';
import { ModuleList } from './components/ModuleList';
import DescriptionCard from './components/DescriptionCard';
import { Spinner } from '@/components/ui/spinner';
import { useGetCourse, useDeleteCourse } from './hooks';
import { formatDate } from '@/lib/utils';

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const { courseId } = use(params);
  const { status: sessionStatus } = useSession();

  const getCourseQuery = useGetCourse(courseId);
  const deleteCourseMutation = useDeleteCourse();

  const courseData = useMemo(() => {
    if (!getCourseQuery.data) return null;

    const course = getCourseQuery.data;
    const totalModules = course.modules.length;
    const completedModules = course.modules.filter((m: any) => m.isComplete).length;

    // Infer length from module count
    const inferredLength: 'short' | 'medium' | 'long' =
      totalModules <= 3 ? 'short' :
      totalModules <= 5 ? 'medium' :
      'long';

    return {
      course,
      totalModules,
      completedModules,
      inferredLength,
    };
  }, [getCourseQuery.data]);

  // Show loading while auth session or query is loading
  if (sessionStatus === 'loading' || getCourseQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  // Only call notFound if query has completed and still no data
  if (getCourseQuery.isSuccess && !courseData) {
    notFound();
  }

  // Show spinner if data not yet available (query disabled or still fetching)
  if (!courseData) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="size-12" />
      </div>
    );
  }

  const { course, totalModules, completedModules, inferredLength } = courseData;

  return (
    <div className="h-full overflow-auto scrollbar-hide">
      <div className="p-4 w-full mx-auto">
        <CourseTitleSection
          courseName={course.name}
          completedModules={completedModules}
          totalModules={totalModules}
        />

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Side - Course Info */}
          <div className="flex-1 space-y-4">
            <CourseDescription
              description={course.description}
            />

            {/* Two Cards in a Row */}
            <div className="grid grid-cols-2 gap-4">
              <DescriptionCard
                heading="Length"
                value={`${totalModules} Module${totalModules !== 1 ? 's' : ''}`}
              />
              <DescriptionCard
                heading="Last Active"
                value={formatDate(course.lastActive)}
              />
            </div>
          </div>

          {/* Right Side - Module List */}
          <div className="flex-1">
            <ModuleList
              courseId={courseId}
              modules={course.modules}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
