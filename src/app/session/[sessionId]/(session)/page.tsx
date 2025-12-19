"use client";

import { use, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SessionTitleSection } from './components/SessionTitleSection';
import { SessionDescription } from './components/SessionDescription';
import { ModuleList } from './components/ModuleList';
import DescriptionCard from './components/DescriptionCard';
import { Spinner } from '@/components/ui/spinner';
import { useGetSession, useDeleteSession } from './hooks';
import { formatDate } from '@/lib/utils';

interface SessionPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = use(params);
  const { status: sessionStatus } = useSession();

  const getSessionQuery = useGetSession(sessionId);
  const deleteSessionMutation = useDeleteSession();

  const sessionData = useMemo(() => {
    if (!getSessionQuery.data) return null;

    const session = getSessionQuery.data;
    const totalModules = session.modules.length;
    const completedModules = session.modules.filter((m) => m.isComplete).length;

    // Infer length from module count (based on sessionService.ts:119)
    const inferredLength: 'short' | 'medium' | 'long' =
      totalModules <= 3 ? 'short' :
      totalModules <= 5 ? 'medium' :
      'long';

    return {
      session,
      totalModules,
      completedModules,
      inferredLength,
    };
  }, [getSessionQuery.data]);

  // Show loading while auth session or query is loading
  if (sessionStatus === 'loading' || getSessionQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="size-12" />
        </div>
      </div>
    );
  }

  if (!sessionData) {
    notFound();
  }

  const { session, totalModules, completedModules, inferredLength } = sessionData;

  return (
    <div className="min-h-screen">
      <div className="py-4">
        <SessionTitleSection
          sessionName={session.name}
          completedModules={completedModules}
          totalModules={totalModules}
        />

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Side - Session Info */}
          <div className="flex-1 space-y-4">
            <SessionDescription
              description={session.description}
            />

            {/* Three Cards in a Row */}
            <div className="grid grid-cols-3 gap-4">
              <DescriptionCard
                heading="Length"
                value={inferredLength.charAt(0).toUpperCase() + inferredLength.slice(1)}
              />
              <DescriptionCard
                heading="Difficulty"
                value="Intermediate"
              />
              <DescriptionCard
                heading="Last Updated"
                value={formatDate(session.lastUpdated)}
              />
            </div>
          </div>

          {/* Right Side - Module List */}
          <div className="flex-1">
            <ModuleList
              sessionId={sessionId}
              modules={session.modules}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
