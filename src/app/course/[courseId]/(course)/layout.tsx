import { use } from 'react';
import { CourseHeader } from "./components/CourseHeader";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    courseId: string;
  }>;
}

export default function CourseLayout({ children, params }: CourseLayoutProps) {
  const { courseId } = use(params);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <CourseHeader courseId={courseId} />
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}