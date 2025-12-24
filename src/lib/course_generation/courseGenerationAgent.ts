import { ChatOpenAI } from "@langchain/openai";
import { courseGenerationSystemPrompt, courseGenerationUserPrompt } from "../prompts";
import { Course, OnboardingContext, CourseSchema } from "./../schemas";

export class CourseGenerationAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-5-mini",
      // temperature: 0.7,
    });
  }

  async generateCourse(context: OnboardingContext): Promise<Course> {
    const structuredModel = this.model.withStructuredOutput(CourseSchema);

    const result = await structuredModel.invoke([
      { role: "system", content: courseGenerationSystemPrompt() },
      { role: "user", content: courseGenerationUserPrompt(context) }
    ]);

    return result;
  }

  // private validateCourse() {
    
  // }
}
