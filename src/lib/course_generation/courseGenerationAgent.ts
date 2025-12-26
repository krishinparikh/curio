import { ChatOpenAI } from "@langchain/openai";
import { courseGenerationSystemPrompt, courseGenerationUserPrompt } from "../prompts";
import { LLMCourse, LLMCourseSchema, LLMInfoSynthesis } from "@/schemas/llm";
import { OnboardingContext } from "@/types/onboarding";

export class CourseGenerationAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-5-mini",
      // temperature: 0.7,
    });
  }

  async generateCourse(infoSynthesis: LLMInfoSynthesis): Promise<LLMCourse> {
    const structuredModel = this.model.withStructuredOutput(LLMCourseSchema);

    const result = await structuredModel.invoke([
      { role: "system", content: courseGenerationSystemPrompt() },
      { role: "user", content: courseGenerationUserPrompt(infoSynthesis) }
    ]);

    return result;
  }
}
