'use server'

import { OnboardingAgent } from '@/lib/course_generation/onboardingAgent';
import { OnboardingQuestion } from '@/lib/schemas';

/**
 * Generates onboarding questions based on the user's original prompt
 * These questions help gather more context to create a better tailored course
 */
export async function generateOnboardingQuestions(
  originalPrompt: string
): Promise<OnboardingQuestion[]> {
  const agent = new OnboardingAgent();
  return agent.generateQuestions(originalPrompt);
}
