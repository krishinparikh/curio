import { ChatOpenAI } from "@langchain/openai";
import { Course, OnboardingContext } from "./../schemas";

export class CourseGenerationAgent {
  private model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.7,
    });
  }

  // async generateCourse(context: OnboardingContext): Promise<Course> {
    
  // }

  // private validateCourse() {
    
  // }
}