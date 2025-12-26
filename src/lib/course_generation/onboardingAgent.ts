import { ChatOpenAI } from "@langchain/openai";
import { onboardingSystemPrompt, onboardingUserPrompt } from "../prompts";
import { LLMOnboarding, LLMOnboardingSchema } from "@/schemas/llm";

export class OnboardingAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
    });
  }

  /**
   * Generates a series of onboarding questions based on the user's original prompt
   * Returns an array of questions with multiple choice options
   */
  async generateQuestions(originalPrompt: string): Promise<LLMOnboarding["questions"]> {
    const structuredModel = this.model.withStructuredOutput(LLMOnboardingSchema);

    const result = await structuredModel.invoke([
      { role: "system", content: onboardingSystemPrompt() },
      { role: "user", content: onboardingUserPrompt(originalPrompt) }
    ]);

    return result.questions;
  }
}