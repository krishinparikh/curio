import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateOnboardingQuestions, generateInfoSynthesis } from '@/lib/actions/onboardingActions';
import { createCourse } from '@/lib/actions/courseActions';
import { OnboardingQuestions, OnboardingContext } from '@/types/onboarding';
import { LLMInfoSynthesis } from '@/schemas/llm';
import { useRouter } from 'next/navigation';

/**
 * Hook to generate onboarding questions based on the original prompt
 */
export function useGenerateQuestions() {
  return useMutation({
    mutationFn: async (originalPrompt: string): Promise<OnboardingQuestions> => {
      return generateOnboardingQuestions(originalPrompt);
    },
  });
}

/**
 * Hook to generate info synthesis from onboarding context
 */
export function useGenerateInfoSynthesis() {
  return useMutation({
    mutationFn: async (onboardingContext: OnboardingContext): Promise<LLMInfoSynthesis> => {
      return generateInfoSynthesis(onboardingContext);
    },
  });
}

/**
 * Hook to create a course with info synthesis
 */
export function useCreateCourse() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      infoSynthesis
    }: {
      userId: string;
      infoSynthesis: LLMInfoSynthesis;
    }) => {
      return createCourse(userId, infoSynthesis);
    },
    onSuccess: (course, variables) => {
      // Invalidate courses query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['courses', variables.userId] });

      // Navigate to the newly created course
      router.push(`/course/${course.id}`);
    },
  });
}
