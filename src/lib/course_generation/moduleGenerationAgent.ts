import { ChatOpenAI } from "@langchain/openai";
import { Course, Module } from "../schemas";
import { moduleGenerationSystemPrompt, moduleGenerationUserPrompt } from "../prompts";

export class ModuleGenerationAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
    });
  }

  async generateModuleContent(course: Course, index: number): Promise<string> {
    const result = await this.model.invoke([
      { role: "system", content: moduleGenerationSystemPrompt() },
      { role: "user", content: moduleGenerationUserPrompt(course, index) }
    ]);

    return result.content as string;
  }
}