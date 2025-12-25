'use client'

import { Button } from "@/components/ui/button";
import { RootCard } from "./RootCard";

interface RecapCardProps {
  courseName: string;
  courseDescription: string;
  answers: Record<string, string>;
  onGenerateCourse: () => void;
  onGoBack: () => void;
  isGenerating?: boolean;
}

export function RecapCard({
  courseName,
  courseDescription,
  answers,
  onGenerateCourse,
  onGoBack,
  isGenerating = false,
}: RecapCardProps) {
  const answerEntries = Object.entries(answers);

  return (
    <RootCard>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{courseName}</h2>
        <p className="text-muted-foreground">{courseDescription}</p>
      </div>

      <div className="space-y-3">
        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-medium">{answerEntries.length} interactive modules (~1 day timeline)</span>
          </li>
          {answerEntries.slice(0, 2).map(([_, answer], index) => (
            <li key={index}>
              <span className="font-medium">{answer}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onGoBack} disabled={isGenerating} className="flex-1">
          Go Back
        </Button>
        <Button onClick={onGenerateCourse} disabled={isGenerating} className="flex-1">
          {isGenerating ? "Generating..." : "Generate Course"}
        </Button>
      </div>
    </RootCard>
  );
}
