'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressDots } from "./ProgressDots";
import { RootCard } from "./RootCard";
import { useState, useEffect } from "react";
import { OnboardingQuestions } from "@/types/onboarding";

type FormCardProps = {
  onboardingQuestions: OnboardingQuestions;
  currentQuestionIndex: number;
  onNext: (answer: string) => void;
  onNavigateNext?: () => void;
  onNavigatePrevious?: () => void;
}

export function FormCard({
  onboardingQuestions,
  currentQuestionIndex,
  onNext,
  onNavigateNext,
  onNavigatePrevious,
}: FormCardProps) {
  const currentQuestion = onboardingQuestions[currentQuestionIndex];
  const { question, options, selectedOptionIndex, customAnswer: initialCustomAnswer } = currentQuestion;

  const [buttonSelected, setButtonSelected] = useState<number | null>(selectedOptionIndex ?? null);
  const [customAnswer, setCustomAnswer] = useState(initialCustomAnswer || "");

  // Reset state when question changes (navigating between questions)
  useEffect(() => {
    setButtonSelected(currentQuestion.selectedOptionIndex ?? null);
    setCustomAnswer(currentQuestion.customAnswer || "");
  }, [currentQuestionIndex, currentQuestion.selectedOptionIndex, currentQuestion.customAnswer]);

  // Auto-advance after selecting an option
  useEffect(() => {
    if (buttonSelected !== null) {
      const timer = setTimeout(() => {
        onNext(options[buttonSelected]);
        setButtonSelected(null);
        setCustomAnswer("");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [buttonSelected, options, onNext]);

  return (
    <RootCard>
      <ProgressDots
        numQuestions={onboardingQuestions.length}
        currentQuestionNum={currentQuestionIndex}
        onPrevious={onNavigatePrevious}
        onNext={onNavigateNext}
      />

      <p className="text-lg">{question}</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          {options.map((option, index) => (
            <Button
              variant={buttonSelected === index ? "default" : "outline"}
              key={index}
              onClick={() => {
                setButtonSelected(index);
                setCustomAnswer("");
              }}
            >
              {option}
            </Button>
          ))}
        </div>

        <Input
          placeholder="Write a custom answer"
          className="bg-card"
          value={customAnswer}
          onChange={(e) => {
            setCustomAnswer(e.target.value);
            setButtonSelected(null);
          }}
        />
      </div>
    </RootCard>
  );
}