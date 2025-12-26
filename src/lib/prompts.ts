import { OnboardingContext } from "@/types/onboarding";
import { LLMCourse } from "@/schemas/llm"; 

export function onboardingSystemPrompt(): string {
  return `You are a world-class personal teacher. A user will request some topic they want to learn; your job is to ask clarifying questions to inform how to create the best possible course for them.
  
  Ask focused, valuable questions that will help create a better course. Keep questions:
  - Specific and actionable
  - Easy to answer (prefer multiple choice when possible)
  - Relevant to course design decisions`;
}

export function onboardingUserPrompt(originalPrompt: string): string {
  return `The user (learner) has requested the following:

  """
  ${originalPrompt}
  """`;
}

export function courseGenerationSystemPrompt(): string {
  return `You are a world-class teacher who is building a personalized course, broken down into modules, for a learner based on a prompt.

  Follow this process step-by-step:
  1. Deeply analyze the learner's request
  2. Define clear, achievable learning outcomes
  3. Identify specific steps required to achieve these outcomes
  4. Create modules from these steps.
  5. For each module, create:
    - A descriptive title
    - A descriptive overview (1 sentence)
  6. Create a clear, engaging course name (3-8 words) and description (2-3 sentences) that aligns with what you've planned.
  
  Note:
  - Create between 3-9 modules
  - The overviews should not include words/phrases like "this module" or "learners"`;
}

export function courseGenerationUserPrompt(onboardingContext: OnboardingContext): string {
  const hasResponses = Object.keys(onboardingContext.responses).length > 0;

  let prompt = `Below is the learner's original prompt:\n\n"""\n${onboardingContext.originalPrompt}\n"""\n`;

  if (hasResponses) {
    prompt += `\nAdditional context from the learner:\n`;
    
    Object.entries(onboardingContext.responses).forEach(([question, answer]) => {
      prompt += `\nQ: ${question}\nA: ${answer}\n`;
    })
  }

  prompt += `\nCreate a comprehensive course from this.`;

  return prompt;
}


export function moduleGenerationSystemPrompt(): string {
  return `You are a world-class educator and technical writer. Create comprehensive educational content that deeply explains the given module topic.
  
  Include a short "## Overview" at the start, and some "## Key Points" bullet points at the end. Everything in between is your choice: core concept explanations, practical examples and use cases, common pitfalls, how concepts relate to one another, etc. Be thorough and clear. Keep it to around 4-6 paragraphs — it should take about 5 minutes total to read. 

  Return only the educational content in markdown format with headings, code examples, and formatting as appropriate. Do NOT write an h1 title ("# Title") — only h2s and below.`;
}

export function moduleGenerationUserPrompt(course: LLMCourse, index: number): string {
  return `Write comprehensive educational content for this module:

  Module: ${course.modules[index].name}
  Overview: ${course.modules[index].overview}

  For context, this module falls within this course:
  ${course.name}: ${course.description}

  The other modules include:
  ${course.modules.map((m, i) => `${i + 1}. ${m.name}: ${m.overview}`).join('\n ')} 
  
  Provide in-depth explanations that teach the concepts thoroughly. Include examples, explanations, and practical guidance that helps learners truly understand and apply the material.`;
}
