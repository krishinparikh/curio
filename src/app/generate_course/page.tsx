'use client'

import { FormCard } from "./components/FormCard";
import { RecapCard } from "./components/RecapCard";
import { useCreateCourse, useGenerateInfoSynthesis } from "./hooks";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { OnboardingQuestions } from "@/types/onboarding";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LLMInfoSynthesis } from "@/schemas/llm";
import { useState } from "react";

type OnboardingState = {
  questions: OnboardingQuestions;
  currentQuestionIndex: number;
  isRecapScreen: boolean;
};

export default function GenerateCoursePage() {
  const searchParams = useSearchParams();
  const originalPrompt = searchParams.get('prompt') || '';
  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const storageKey = `onboarding_${originalPrompt}`;
  const { mutate: createCourse, isPending: isCreatingCourse } = useCreateCourse();
  const { mutate: generateSynthesis, isPending: isGeneratingSynthesis } = useGenerateInfoSynthesis();
  const router = useRouter();
  const [infoSynthesis, setInfoSynthesis] = useState<LLMInfoSynthesis | null>(null);

  const [state, setState, clearStorage] = useLocalStorage<OnboardingState>(storageKey, {
    questions: [],
    currentQuestionIndex: 0,
    isRecapScreen: false,
  });

  const { questions, currentQuestionIndex, isRecapScreen } = state;

  // Redirect back to home if no questions exist (shouldn't happen in normal flow)
  if (!originalPrompt || questions.length === 0) {
    router.push('/home');
    return null;
  }

  const handleSelectOption = (optionIndex: number) => {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const selectedOption = questions[currentQuestionIndex].options[optionIndex];

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      selectedOptionIndex: optionIndex,
      customAnswer: selectedOption,
    };

    setState(prev => ({ ...prev, questions: updatedQuestions }));

    // Auto-advance after selecting an option
    setTimeout(() => {
      if (isLastQuestion) {
        // Transition to recap screen and trigger synthesis
        setState(prev => ({ ...prev, isRecapScreen: true }));

        // Generate info synthesis
        const answers: Record<string, string> = {};
        updatedQuestions.forEach(q => {
          if (q.customAnswer) {
            answers[q.question] = q.customAnswer;
          }
        });

        generateSynthesis({
          originalPrompt,
          responses: answers,
        }, {
          onSuccess: (synthesis) => {
            setInfoSynthesis(synthesis);
          },
        });
      } else {
        setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
      }
    }, 500);
  };

  const handleCustomAnswer = (answer: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      selectedOptionIndex: answer ? null : updatedQuestions[currentQuestionIndex].selectedOptionIndex,
      customAnswer: answer,
    };

    setState(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleNavigatePrevious = () => {
    if (currentQuestionIndex > 0) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    }
  };

  const handleNavigateNext = () => {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      // Transition to recap screen and trigger synthesis
      setState(prev => ({ ...prev, isRecapScreen: true }));

      // Generate info synthesis
      const answers: Record<string, string> = {};
      questions.forEach(q => {
        if (q.customAnswer) {
          answers[q.question] = q.customAnswer;
        }
      });

      generateSynthesis({
        originalPrompt,
        responses: answers,
      }, {
        onSuccess: (synthesis) => {
          setInfoSynthesis(synthesis);
        },
      });
    } else {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    }
  };

  const handleGoBack = () => {
    setState(prev => ({
      ...prev,
      isRecapScreen: false,
      currentQuestionIndex: questions.length - 1,
    }));
    setInfoSynthesis(null);
  };

  const handleGenerateCourse = () => {
    if (!userId || !infoSynthesis) return;

    createCourse({
      userId,
      infoSynthesis,
    }, {
      onSuccess: () => {
        // Clear localStorage after successful course creation
        clearStorage();
      },
    });
  };

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
          infoSynthesis={infoSynthesis}
          onGenerateCourse={handleGenerateCourse}
          onGoBack={handleGoBack}
          isGenerating={isCreatingCourse}
          isLoadingSynthesis={isGeneratingSynthesis}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <FormCard
        onboardingQuestions={questions}
        currentQuestionIndex={currentQuestionIndex}
        onSelectOption={handleSelectOption}
        onCustomAnswer={handleCustomAnswer}
        onNavigatePrevious={handleNavigatePrevious}
        onNavigateNext={handleNavigateNext}
      />
    </div>
  );
}