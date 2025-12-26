'use server'

import { OnboardingAgent } from '@/lib/course_generation/onboardingAgent';
import { OnboardingQuestions } from '@/types/onboarding';

/**
 * Generates onboarding questions based on the user's original prompt
 * These questions help gather more context to create a better tailored course
 */
export async function generateOnboardingQuestions(
  originalPrompt: string
): Promise<OnboardingQuestions> {
  const agent = new OnboardingAgent();
  const agentResult = await agent.generateQuestions(originalPrompt);

  // Map LLMOnboarding to OnboardingQuestions
  const onboardingQuestions: OnboardingQuestions = agentResult.map(item => ({
    question: item.question,
    options: item.options,
    selectedOptionIndex: null,
    customAnswer: null
  }));

  return onboardingQuestions;
}