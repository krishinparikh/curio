import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressDotsProps {
  numQuestions: number;
  currentQuestionNum: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function ProgressDots({
  numQuestions,
  currentQuestionNum,
  onPrevious,
  onNext
}: ProgressDotsProps) {

  const isFirstQuestion = currentQuestionNum === 1;
  const isLastQuestion = currentQuestionNum === numQuestions;

  return (

    <div className="flex items-center justify-between w-full">

      <Button
        disabled={isFirstQuestion || !onPrevious}
        variant="ghost"
        size="sm"
        onClick={onPrevious}
      >
        <ChevronLeft />
      </Button>

      <div className="flex gap-4 justify-center">

        {
          Array.from({length: numQuestions}).map((_, index) => (
            <span className={
              index < currentQuestionNum ?
              "bg-primary w-2 h-2 rounded" :
              "bg-border w-2 h-2 rounded"
            } key={index} />
          ))
        }
      </div>

      <Button
        disabled={isLastQuestion || !onNext}
        variant="ghost"
        size="sm"
        onClick={onNext}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}