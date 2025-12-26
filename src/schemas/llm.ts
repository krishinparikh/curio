import { z } from "zod";

// Onboarding questions and their options
// Note: Top-level must be object for OpenAI structured output API
export const LLMOnboardingSchema = z.object({
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()).min(2).max(4)
  })).min(3).max(5)
});

export type LLMOnboarding = z.infer<typeof LLMOnboardingSchema>;

// Course
export const LLMCourseSchema = z.object({
  name: z.string(),
  description: z.string(),
  modules: z.array(z.object({
    name: z.string(),
    overview: z.string()
  })).min(3).max(9)
})

export type LLMCourse = z.infer<typeof LLMCourseSchema>;