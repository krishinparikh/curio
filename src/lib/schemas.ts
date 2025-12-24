import { z } from "zod";

// Onboarding question
export const OnboardingQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).min(2).max(4),
  allowCustom: z.boolean()
});

export type OnboardingQuestion = z.infer<typeof OnboardingQuestionSchema>;


// Shared context type
export const OnboardingContextSchema = z.object ({
  originalPrompt: z.string()
});

export type OnboardingContext = z.infer<typeof OnboardingContextSchema>;


export const CourseSchema = z.object({
  name: z.string(),
  description: z.string(),
  modules: z.array(z.object({
    name: z.string(),
    overview: z.string()
  })).min(3).max(9)
})

export type Course = z.infer<typeof CourseSchema>;

export interface Module {
  id: string;
  name: string;
  overview: string;
  order: number;
  learningObjectives?: string[];
}