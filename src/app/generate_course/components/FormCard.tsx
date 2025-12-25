'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressDots } from "./ProgressDots";
import { RootCard } from "./RootCard";
import { useState, useEffect } from "react";

interface FormCardProps {
  question: string;
  options: string[];
  allowCustom?: boolean;
  totalQuestions: number;
  currentQuestion: number;
  onNext: (answer: string) => void;
}

export function FormCard({
  question,
  options,
  allowCustom = true,
  totalQuestions,
  currentQuestion,
  onNext,
}: FormCardProps) {

  const [buttonSelected, setButtonSelected] = useState<number | null>(null);
  const [customAnswer, setCustomAnswer] = useState("");

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
      <ProgressDots numQuestions={totalQuestions} currentQuestionNum={currentQuestion} />

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

        {allowCustom && (
          <Input
            placeholder="Write a custom answer"
            className="bg-card"
            value={customAnswer}
            onChange={(e) => {
              setCustomAnswer(e.target.value);
              setButtonSelected(null);
            }}
          />
        )}
      </div>
    </RootCard>
  );

}