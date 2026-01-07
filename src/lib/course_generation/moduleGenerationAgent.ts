import { ChatOpenAI } from "@langchain/openai";
import { LLMCourse } from "@/schemas/llm";
import { moduleGenerationSystemPrompt, moduleGenerationUserPrompt } from "../prompts";

export class ModuleGenerationAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4.1-mini",
      temperature: 0.7,
    });
  }

  async generateModuleContent(course: LLMCourse, index: number): Promise<string> {
    const result = await this.model.invoke([
      { role: "system", content: moduleGenerationSystemPrompt() },
      { role: "user", content: moduleGenerationUserPrompt(course, index) }
    ]);

    return result.content as string;
  }
}