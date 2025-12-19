'use client';

import { useSession } from 'next-auth/react';
import { useGetModule } from '../hooks';
import MarkdownRenderer from '@/app/MarkdownRenderer';

interface ContentProps {
  moduleId: string;
}

export function Content({ moduleId }: ContentProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const getModuleQuery = useGetModule(moduleId, userId);

  if (getModuleQuery.isLoading) {
    return (
      <div className="py-8 px-14 w-full max-w-6xl">
        <p className="text-muted-foreground text-center">Loading module content...</p>
      </div>
    );
  }

  if (getModuleQuery.error) {
    return (
      <div className="py-8 px-12 w-full max-w-6xl">
        <p className="text-destructive text-center">Error loading module content</p>
      </div>
    );
  }

  if (!getModuleQuery.data) {
    return (
      <div className="py-8 px-12 w-full max-w-6xl">
        <p className="text-muted-foreground text-center">Module not found</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-14 w-full max-w-6xl">
      <div className="prose prose-base dark:prose-invert max-w-none">
        <MarkdownRenderer>{getModuleQuery.data.content}</MarkdownRenderer>
      </div>
    </div>
  );
}
