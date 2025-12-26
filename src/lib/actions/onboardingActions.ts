'use server'

import { OnboardingAgent } from '@/lib/course_generation/onboardingAgent';
import { OnboardingContext, OnboardingQuestions } from '@/types/onboarding';
import { LLMInfoSynthesis } from '@/schemas/llm';

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

export async function generateInfoSynthesis(
  onboardingContext: OnboardingContext
): Promise<LLMInfoSynthesis> {
  const agent = new OnboardingAgent();
  const synthesis = await agent.synthesizeInfo(onboardingContext);

  return synthesis;
}