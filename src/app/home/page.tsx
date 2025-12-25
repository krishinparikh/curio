"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { HomeHeader } from "./components/HomeHeader";
import { Spinner } from "@/components/ui/spinner";
import { useGetUser } from "@/hooks/useGetUser";
import { CourseInput } from "./components/course_input/CourseInput";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status: sessionStatus } = useSession();

  const userId = session?.user?.id || "";

  const getUserQuery = useGetUser(userId);
  const router = useRouter();

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

  const handleStartOnboarding = () => {
    if (!userId || !topic.trim()) return;

    // Redirect to onboarding flow with the prompt
    router.push(`/generate_course?prompt=${encodeURIComponent(topic.trim())}`);
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

          <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-24">
            <div className="w-full max-w-3xl flex flex-col items-center space-y-10 sm:space-y-8 md:space-y-10">
              <h1 className="text-3xl sm:text-4xl md:text-4xl font-medium text-center text-foreground max-w-4xl px-4">
                {firstName ? `What do you want to learn today, ${firstName}?` : "What do you want to learn today?"}
              </h1>

              <CourseInput
                topic={topic}
                setTopic={setTopic}
                isCreatingCourse={false}
                onSubmit={handleStartOnboarding}
              />
            </div>
          </main>
    </div>
  );
}
