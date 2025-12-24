"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp } from "lucide-react";

interface CourseInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  isCreatingCourse: boolean;
  onSubmit: () => void;
}

export function CourseInput({ topic, setTopic, isCreatingCourse, onSubmit }: CourseInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (topic.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <InputGroup className="w-full max-w-2xl min-h-[120px] shadow-[0_0_4px_rgba(0,0,0,0.05)] bg-white overflow-hidden">
      <InputGroupTextarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask Curio to teach you anything..."
        disabled={isCreatingCourse}
        className="min-h-0 !text-lg pl-4 pt-4 pr-4"
      />
      <InputGroupAddon align="block-end" className="justify-end">
        <InputGroupButton
          variant="default"
          size="icon-sm"
          className="border border-border"
          onClick={onSubmit}
          disabled={isCreatingCourse || !topic.trim()}
        >
          <ArrowUp />
          <span className="sr-only">Generate course</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}