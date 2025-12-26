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

// Synthsis of information that is passed to the CourseGenerationAgent
export const LLMInfoSynthesisSchema = z.object({
  topic: z.string(),
  goal: z.string(),
  currentLevel: z.array(z.string()).min(1).max(4),
  additionalConext: z.array(z.string())
});

export type LLMInfoSynthesis = z.infer<typeof LLMInfoSynthesisSchema>;

// Course
export const LLMCourseSchema = z.object({
  name: z.string(),
  description: z.string(),
  modules: z.array(z.object({
    name: z.string(),
    overview: z.string(),
    topics: z.array(z.string()).min(2).max(4)
  })).min(3).max(6)
})

export type LLMCourse = z.infer<typeof LLMCourseSchema>;