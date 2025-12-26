import { ChatOpenAI } from "@langchain/openai";
import { onboardingSystemPrompt, onboardingUserPrompt, infoSynthesisSystemPrompt, infoSynthesisUserPrompt } from "../prompts";
import { LLMOnboarding, LLMOnboardingSchema, LLMInfoSynthesis, LLMInfoSynthesisSchema } from "@/schemas/llm";
import { OnboardingContext } from "@/types/onboarding";

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

  async synthesizeInfo(onboardingContext: OnboardingContext): Promise<LLMInfoSynthesis> {
    const structuredModel = this.model.withStructuredOutput(LLMInfoSynthesisSchema);

    const result = await structuredModel.invoke([
      { role: "system", content: infoSynthesisSystemPrompt() },
      { role: "system", content: infoSynthesisUserPrompt(onboardingContext) },
    ])
    
    return result;
  }
}