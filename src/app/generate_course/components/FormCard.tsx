'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressDots } from "./ProgressDots";
import { useState } from "react";

interface FormCardProps {
  question: string;
  options: string[];
}

export function FormCard({
  question,
  options,
}: FormCardProps) {

  const [buttonSelected, setButtonSelected] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto p-20 bg-card rounded shadow space-y-14">
      
      <ProgressDots numQuestions={4} currentQuestionNum={2} />
      
      <p className="text-lg">{question}</p>

      <div className="space-y-2">
        <div className="flex flex-nowrap gap-2 w-full">
          {options.map((option, index) => (
            <Button variant={buttonSelected === index ? "default" : "outline"} key={index} className="flex-1" onClick={() => setButtonSelected(index)}>{option}</Button>
          ))}
        </div>

        <Input placeholder="Write a custom answer" className="bg-card"/>
      </div>
    </div>
  );

}