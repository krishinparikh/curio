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
        <h2 className="text-2xl font-bold">{infoSynthesis.topic}</h2>
        <p className="text-muted-foreground">{infoSynthesis.goal}</p>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold mb-2">Your Current Level:</p>
          <ul className="list-disc list-inside space-y-1">
            {infoSynthesis.currentLevel.map((level, index) => (
              <li key={index}>
                <span className="text-sm">{level}</span>
              </li>
            ))}
          </ul>
        </div>

        {infoSynthesis.additionalConext.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2">Additional Context:</p>
            <ul className="list-disc list-inside space-y-1">
              {infoSynthesis.additionalConext.map((context, index) => (
                <li key={index}>
                  <span className="text-sm">{context}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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
