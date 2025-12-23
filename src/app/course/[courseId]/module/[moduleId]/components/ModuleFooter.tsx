'use client';

import { IconButton } from '@/components/IconButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetModule } from '../hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ModuleFooterProps {
  isPaneOpen: boolean;
  courseId: string;
  moduleId: string;
}

export function ModuleFooter({ isPaneOpen, courseId, moduleId }: ModuleFooterProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const { data: moduleData } = useGetModule(moduleId, userId);
  const router = useRouter();

  const containerClasses = isPaneOpen
    ? "px-4 w-full max-w-6xl pb-4"
    : "px-4 w-full max-w-6xl mx-auto pb-4";

  // Find current module index and determine prev/next
  const modules = moduleData?.course?.modules || [];
  const currentIndex = modules.findIndex(m => m.id === moduleId);
  const previousModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  const handlePrevious = () => {
    if (previousModule) {
      router.push(`/course/${courseId}/module/${previousModule.id}`);
    }
  };

  const handleNext = () => {
    if (nextModule) {
      router.push(`/course/${courseId}/module/${nextModule.id}`);
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex justify-between items-center">
        <IconButton
          icon={<ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          iconOnLeft={true}
          variant="outline"
          hideTextOnMobile
          onClick={handlePrevious}
          disabled={!previousModule}
        >
          Previous Module
        </IconButton>

        <IconButton
          icon={<ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          iconOnLeft={false}
          variant="default"
          hideTextOnMobile
          onClick={handleNext}
          disabled={!nextModule}
        >
          Next Module
        </IconButton>
      </div>
    </div>
  );
}
