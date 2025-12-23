import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProgressDotsProps {
  numQuestions: number;
  currentQuestionNum: number;
}

export function ProgressDots({
  numQuestions,
  currentQuestionNum
}: ProgressDotsProps) {

  return (

    <div className="flex items-center justify-between w-full">

      <Button disabled={true} variant="ghost" size="sm">
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

      <Button variant="ghost" size="sm">
        <ChevronRight />
      </Button>
    </div>
  );
}