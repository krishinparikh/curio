'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootCard } from "./RootCard";
import { OnboardingQuestions } from "@/types/onboarding";
import { ChevronLeft, ChevronRight } from 'lucide-react';

type FormCardProps = {
  onboardingQuestions: OnboardingQuestions;
  currentQuestionIndex: number;
  onSelectOption: (optionIndex: number) => void;
  onCustomAnswer: (answer: string) => void;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
}

export function FormCard({
  onboardingQuestions,
  currentQuestionIndex,
  onSelectOption,
  onCustomAnswer,
  onNavigateNext,
  onNavigatePrevious,
}: FormCardProps) {
  const currentQuestion = onboardingQuestions[currentQuestionIndex];
  const { question, options, selectedOptionIndex, customAnswer } = currentQuestion;

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === onboardingQuestions.length - 1;

  return (
    <RootCard>
      <div className="flex items-center justify-between w-full">
        <Button
          disabled={isFirstQuestion || !onNavigatePrevious}
          variant="ghost"
          size="sm"
          onClick={onNavigatePrevious}
        >
          <ChevronLeft />
        </Button>

        <div className="flex gap-4 justify-center">
          {Array.from({ length: onboardingQuestions.length }).map((_, index) => (
            <span
              className={
                index < currentQuestionIndex
                  ? "bg-primary w-2 h-2 rounded"
                  : "bg-border w-2 h-2 rounded"
              }
              key={index}
            />
          ))}
        </div>

        <Button
          disabled={isLastQuestion || !onNavigateNext}
          variant="ghost"
          size="sm"
          onClick={onNavigateNext}
        >
          <ChevronRight />
        </Button>
      </div>

      <p className="text-lg">{question}</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          {options.map((option, index) => (
            <Button
              variant={selectedOptionIndex === index ? "default" : "outline"}
              key={index}
              onClick={() => onSelectOption(index)}
            >
              {option}
            </Button>
          ))}
        </div>

        <Input
          placeholder="Write a custom answer"
          className="bg-card"
          value={customAnswer || ""}
          onChange={(e) => onCustomAnswer(e.target.value)}
        />
      </div>
    </RootCard>
  );
}