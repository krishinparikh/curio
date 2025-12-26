'use client'

import { FormCard } from "./components/FormCard";
import { RecapCard } from "./components/RecapCard";
import { useGenerateQuestions, useCreateCourse } from "./hooks";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { OnboardingQuestions } from "@/types/onboarding";

export default function GenerateCoursePage() {
  const searchParams = useSearchParams();
  const originalPrompt = searchParams.get('prompt') || '';
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const storageKey = `onboarding_${originalPrompt}`;
  const { mutate: generateQuestions, isPending: isLoadingQuestions } = useGenerateQuestions();
  const { mutate: createCourse, isPending: isCreatingCourse } = useCreateCourse();

  const [questions, setQuestions] = useState<OnboardingQuestions>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecapScreen, setIsRecapScreen] = useState(false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify({ questions, currentQuestionIndex, isRecapScreen }));
    }
  }, [questions, currentQuestionIndex, isRecapScreen, storageKey]);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        setQuestions(savedData.questions || []);
        setCurrentQuestionIndex(savedData.currentQuestionIndex || 0);
        setIsRecapScreen(savedData.isRecapScreen || false);
      } catch (e) {
        console.error('Failed to load onboarding state:', e);
      }
    }
  }, [storageKey]);

  // Generate questions on mount
  useEffect(() => {
    if (originalPrompt && questions.length === 0) {
      generateQuestions(originalPrompt, {
        onSuccess: (generatedQuestions) => {
          setQuestions(generatedQuestions);
        },
      });
    }
  }, [originalPrompt, questions.length, generateQuestions]);

  const handleNext = (answer: string) => {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const currentQ = questions[currentQuestionIndex];

    // Check if answer matches one of the options
    const selectedIndex = currentQ.options.indexOf(answer);

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      selectedOptionIndex: selectedIndex >= 0 ? selectedIndex : null,
      customAnswer: answer,
    };

    setQuestions(updatedQuestions);

    if (isLastQuestion) {
      setIsRecapScreen(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleNavigatePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNavigateNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleGoBack = () => {
    setIsRecapScreen(false);
    setCurrentQuestionIndex(questions.length - 1);
  };

  const handleGenerateCourse = () => {
    if (!userId) return;

    // Convert questions with answers to answers object
    const answers: Record<string, string> = {};
    questions.forEach(q => {
      if (q.customAnswer) {
        answers[q.question] = q.customAnswer;
      }
    });

    createCourse({
      userId,
      context: {
        originalPrompt,
        responses: answers,
      },
    }, {
      onSuccess: () => {
        // Clear localStorage after successful course creation
        localStorage.removeItem(storageKey);
      },
    });
  };

  if (isLoadingQuestions || questions.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Let me ask you a few more questions to clarify your goals...</p>
      </div>
    );
  }

  if (isRecapScreen) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        {/* Loading Overlay for Course Creation */}
        {isCreatingCourse && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="bg-card border border-border rounded p-8 mx-4 flex flex-col items-center gap-6 shadow-2xl max-w-md">
              <Spinner className="size-12 text-primary" />
              <p className="text-base sm:text-lg font-medium text-center text-foreground">Hold tight while your course generates...</p>
            </div>
          </div>
        )}

        <RecapCard
          courseName={originalPrompt}
          courseDescription="A comprehensive introduction to the most popular frontend library, focusing on JSX, components, and state."
          answers={questions.reduce((acc, q) => {
            if (q.customAnswer) acc[q.question] = q.customAnswer;
            return acc;
          }, {} as Record<string, string>)}
          onGenerateCourse={handleGenerateCourse}
          onGoBack={handleGoBack}
          isGenerating={isCreatingCourse}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <FormCard
        onboardingQuestions={questions}
        currentQuestionIndex={currentQuestionIndex}
        onNext={handleNext}
        onNavigatePrevious={handleNavigatePrevious}
        onNavigateNext={handleNavigateNext}
      />
    </div>
  );
}