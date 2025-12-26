export type OnboardingQuestion = {
  question: string;
  options: string[];
  selectedOptionIndex?: number | null;
  customAnswer?: string | null;
};

export type OnboardingQuestions = OnboardingQuestion[];

export type OnboardingContext = {
  originalPrompt: string;
  responses: Record<string, string>; // Questions and Answers
}