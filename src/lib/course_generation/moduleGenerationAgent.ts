import { ChatOpenAI } from "@langchain/openai";
import { Course, Module } from "../schemas";  



export class ModuleGenerationAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
    });
  }

  // async generateModuleContent(course: Course): Module {

  // }
}