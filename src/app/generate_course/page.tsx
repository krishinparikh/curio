'use client'

import { FormCard } from "./components/FormCard";
import { RecapCard } from "./components/RecapCard";
import { useGenerateQuestions, useCreateCourse } from "./hooks";
import { useState, useEffect } from "react";
import { OnboardingQuestion } from "@/lib/schemas";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";

export default function GenerateCoursePage() {
  const searchParams = useSearchParams();
  const originalPrompt = searchParams.get('prompt') || '';
  const { data: session } = useSession();
  const userId = session?.user?.id || '';

  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isRecapScreen, setIsRecapScreen] = useState(false);

  const { mutate: generateQuestions, isPending: isLoadingQuestions } = useGenerateQuestions();
  const { mutate: createCourse, isPending: isCreatingCourse } = useCreateCourse();

  // Generate questions on mount
  useEffect(() => {
    if (originalPrompt) {
      generateQuestions(originalPrompt, {
        onSuccess: (generatedQuestions) => {
          setQuestions(generatedQuestions);
        },
      });
    }
  }, [originalPrompt]);

  const handleNext = (answer: string) => {
    const currentQuestion = questions[currentStep];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.question]: answer,
    }));

    // Check if this was the last question
    if (currentStep === questions.length - 1) {
      setIsRecapScreen(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleGoBack = () => {
    setIsRecapScreen(false);
    setCurrentStep(questions.length - 1);
  };

  const handleGenerateCourse = () => {
    if (!userId) return;

    createCourse({
      userId,
      context: {
        originalPrompt,
        answers,
      },
    });
  };

  if (isLoadingQuestions || questions.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading questions...</p>
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
          answers={answers}
          onGenerateCourse={handleGenerateCourse}
          onGoBack={handleGoBack}
          isGenerating={isCreatingCourse}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen flex justify-center items-center">
      <FormCard
        question={currentQuestion.question}
        options={currentQuestion.options}
        allowCustom={currentQuestion.allowCustom}
        totalQuestions={questions.length}
        currentQuestion={currentStep + 1}
        onNext={handleNext}
      />
    </div>
  );
}