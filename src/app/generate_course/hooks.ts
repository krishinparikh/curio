import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateOnboardingQuestions } from '@/lib/actions/onboardingActions';
import { createCourse } from '@/lib/actions/courseActions';
import { OnboardingQuestions, OnboardingContext } from '@/types/onboarding';
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
 * Hook to create a course with onboarding context
 */
export function useCreateCourse() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, onboardingContext }: { userId: string; onboardingContext: OnboardingContext }) => {
      return createCourse(userId, onboardingContext);
    },
    onSuccess: (course, variables) => {
      // Invalidate courses query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['courses', variables.userId] });

      // Navigate to the newly created course
      router.push(`/course/${course.id}`);
    },
  });
}
