'use client'

import { Button } from "@/components/ui/button";
import { RootCard } from "./RootCard";
import { LLMInfoSynthesis } from "@/schemas/llm";
import { Spinner } from "@/components/ui/spinner";

interface RecapCardProps {
  infoSynthesis: LLMInfoSynthesis | null;
  onGenerateCourse: () => void;
  onGoBack: () => void;
  isGenerating?: boolean;
  isLoadingSynthesis?: boolean;
}

export function RecapCard({
  infoSynthesis,
  onGenerateCourse,
  onGoBack,
  isGenerating = false,
  isLoadingSynthesis = false,
}: RecapCardProps) {
  if (isLoadingSynthesis || !infoSynthesis) {
    return (
      <RootCard>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner className="size-8 text-primary" />
          <p className="text-muted-foreground">Analyzing your responses...</p>
        </div>
      </RootCard>
    );
  }

  return (
    <RootCard>
      <div className="space-y-4">
        <p className="text-lg">{infoSynthesis.topic}</p>

        <ul className="list-disc list-outside ml-5 space-y-4 text-lg">
          <li>{infoSynthesis.goal}</li>
          {infoSynthesis.currentLevel.map((level, index) => (
            <li key={`level-${index}`}>{level}</li>
          ))}
          {infoSynthesis.additionalConext.map((context, index) => (
            <li key={`context-${index}`}>{context}</li>
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
