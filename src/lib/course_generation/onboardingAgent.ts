import { ChatOpenAI } from "@langchain/openai";

export class OnboardingAgent {
  private model: ChatOpenAI;
  private maxQuestions = 5;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
    });
  }

  // async generateQuestion() {

  // }

  isDoneAsking(answersCount: number): boolean {
    // Could be more sophisticated - e.g., LLM decides
    return answersCount >= this.maxQuestions;
  }

  // synthesizeContext() {
    
  // }
}