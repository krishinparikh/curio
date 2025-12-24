"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { HomeHeader } from "./components/HomeHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useGetUser } from "@/hooks/useGetUser";
import { useCreateCourse } from "./hooks";

export default function HomePage() {
  const { data: session, status: sessionStatus } = useSession();

  const userId = session?.user?.id || "";

  const getUserQuery = useGetUser(userId);
  const createCourseMutation = useCreateCourse();

  const firstName = useMemo(() => {
    if (getUserQuery.data?.name) {
      const [first] = getUserQuery.data.name.trim().split(/\s+/);
      return first || null;
    }

    if (getUserQuery.data?.email) {
      return getUserQuery.data.email.split("@")[0];
    }

    return null;
  }, [getUserQuery.data]);

  const [topic, setTopic] = useState("");

  const isLoading = sessionStatus === "loading" || getUserQuery.isLoading;
  const isCreatingCourse = createCourseMutation.isPending;

  const handleCreateCourse = () => {
    if (!userId || !topic.trim()) return;

    createCourseMutation.mutate({
      userId,
      originalPrompt: topic.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <HomeHeader />
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="size-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <HomeHeader />

          {/* Loading Overlay for Course Creation */}
          {isCreatingCourse && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center">
              <div className="bg-card border border-border rounded p-8 mx-4 flex flex-col items-center gap-6 shadow-2xl max-w-md">
                <Spinner className="size-12 text-primary" />
                <p className="text-base sm:text-lg font-medium text-center text-foreground">Hold tight while your course generates...</p>
              </div>
            </div>
          )}

          <main className="flex-1 flex justify-center px-4 sm:px-6 pt-16 sm:pt-36">
            <div className="w-full max-w-3xl flex flex-col items-center space-y-10 sm:space-y-8 md:space-y-10">
              <h1 className="text-3xl sm:text-4xl md:text-4xl font-medium text-center text-foreground max-w-4xl px-4">
                {firstName ? `What do you want to learn today, ${firstName}?` : "What do you want to learn today?"}
              </h1>

              <Textarea
                placeholder="Ask Curio to teach you anything..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isCreatingCourse}
                className="w-full max-w-2xl h-32 !text-lg resize-none rounded px-4 py-4 bg-card border-border shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
              />

              <Button
                size="lg"
                className="w-full max-w-2xl h-14 text-base font-semibold rounded shadow-sm hover:shadow-md transition-shadow"
                onClick={handleCreateCourse}
                disabled={isCreatingCourse || !topic.trim()}
              >
                Generate Course
              </Button>
            </div>
          </main>
    </div>
  );
}
